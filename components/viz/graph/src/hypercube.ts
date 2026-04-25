// (c) 2025-2026 Asymmetric Effort, LLC. MIT LICENSE
// SPDX-License-Identifier: MIT

/**
 * Hypercube math engine.
 *
 * Generates vertices and edges for an N-dimensional hypercube and projects
 * them to 2D via configurable rotation + orthographic projection.
 */

// -- Types ------------------------------------------------------------------

export interface Vec {
  /** N-dimensional coordinates */
  coords: number[];
}

export interface Vertex {
  id: number;
  /** Original N-dimensional position (each coord 0 or 1) */
  position: Vec;
  /** Projected 2D position after rotation */
  x: number;
  y: number;
  /** Projected depth for z-ordering */
  depth: number;
}

export interface Edge {
  source: number;
  target: number;
}

export interface HypercubeData {
  vertices: Vertex[];
  edges: Edge[];
  dimension: number;
}

// -- Vertex generation ------------------------------------------------------

/**
 * Generate all 2^n vertices of an n-dimensional hypercube.
 * Each vertex is a binary vector of length n, centered at the origin
 * (coords mapped from {0,1} to {-1,+1}).
 */
export function generateVertices(dimension: number): Vec[] {
  const count = 1 << dimension; // 2^n
  const verts: Vec[] = [];

  for (let i = 0; i < count; i++) {
    const coords: number[] = [];
    for (let d = 0; d < dimension; d++) {
      // Map bit d of i from {0,1} to {-1, +1}
      coords.push(((i >> d) & 1) * 2 - 1);
    }
    verts.push({ coords });
  }

  return verts;
}

// -- Edge generation --------------------------------------------------------

/**
 * Generate edges connecting vertices that differ in exactly one coordinate
 * (Hamming distance 1).
 */
export function generateEdges(dimension: number): Edge[] {
  const count = 1 << dimension;
  const edges: Edge[] = [];

  for (let i = 0; i < count; i++) {
    for (let d = 0; d < dimension; d++) {
      const j = i ^ (1 << d); // Flip bit d
      if (j > i) {
        // Avoid duplicate edges
        edges.push({ source: i, target: j });
      }
    }
  }

  return edges;
}

// -- Rotation ---------------------------------------------------------------

/**
 * Build an N×N rotation matrix that applies rotations in each pair of
 * coordinate planes. `angles` is an array of rotation angles (radians),
 * one per plane pair: (0,1), (0,2), (1,2), (0,3), (1,3), (2,3), ...
 */
export function buildRotationMatrix(dimension: number, angles: number[]): number[][] {
  // Start with identity
  let mat = identity(dimension);

  let angleIdx = 0;
  for (let i = 0; i < dimension; i++) {
    for (let j = i + 1; j < dimension; j++) {
      if (angleIdx < angles.length) {
        const theta = angles[angleIdx]!;
        mat = multiplyMatrices(mat, planeRotation(dimension, i, j, theta));
      }
      angleIdx++;
    }
  }

  return mat;
}

function identity(n: number): number[][] {
  const m: number[][] = [];
  for (let i = 0; i < n; i++) {
    const row: number[] = new Array(n).fill(0);
    row[i] = 1;
    m.push(row);
  }
  return m;
}

function planeRotation(n: number, a: number, b: number, theta: number): number[][] {
  const m = identity(n);
  const c = Math.cos(theta);
  const s = Math.sin(theta);
  m[a]![a] = c;
  m[a]![b] = -s;
  m[b]![a] = s;
  m[b]![b] = c;
  return m;
}

function multiplyMatrices(a: number[][], b: number[][]): number[][] {
  const n = a.length;
  const result: number[][] = [];
  for (let i = 0; i < n; i++) {
    const row: number[] = new Array(n).fill(0);
    for (let j = 0; j < n; j++) {
      for (let k = 0; k < n; k++) {
        row[j] += a[i]![k]! * b[k]![j]!;
      }
    }
    result.push(row);
  }
  return result;
}

/**
 * Apply an N×N matrix to an N-dimensional vector.
 */
export function transformVec(matrix: number[][], v: Vec): number[] {
  const n = matrix.length;
  const result: number[] = new Array(n).fill(0);
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      result[i] += matrix[i]![j]! * v.coords[j]!;
    }
  }
  return result;
}

// -- Projection -------------------------------------------------------------

/**
 * Project an N-dimensional point to 2D using orthographic projection
 * (just take the first two coordinates) with optional perspective scaling
 * based on depth (average of remaining coordinates).
 */
export function projectTo2D(
  transformed: number[],
  perspective: number = 0,
): { x: number; y: number; depth: number } {
  const x = transformed[0] ?? 0;
  const y = transformed[1] ?? 0;

  // Depth = average of all remaining dimensions
  let depth = 0;
  for (let i = 2; i < transformed.length; i++) {
    depth += transformed[i] ?? 0;
  }
  if (transformed.length > 2) {
    depth /= transformed.length - 2;
  }

  if (perspective > 0) {
    const scale = 1 / (1 + perspective * (depth + 2));
    return { x: x * scale, y: y * scale, depth };
  }

  return { x, y, depth };
}

// -- Full pipeline ----------------------------------------------------------

/**
 * Generate a complete projected hypercube.
 *
 * @param dimension   Number of dimensions (2 = square, 3 = cube, 4 = tesseract, ...)
 * @param angles      Rotation angles for each plane pair
 * @param perspective Perspective strength (0 = orthographic)
 * @param scale       Scaling factor for output coordinates
 */
export function generateHypercube(
  dimension: number,
  angles: number[] = [],
  perspective: number = 0.3,
  scale: number = 1,
): HypercubeData {
  const rawVerts = generateVertices(dimension);
  const edges = generateEdges(dimension);
  const rotMatrix = buildRotationMatrix(dimension, angles);

  const vertices: Vertex[] = rawVerts.map((v, i) => {
    const transformed = transformVec(rotMatrix, v);
    const proj = projectTo2D(transformed, perspective);
    return {
      id: i,
      position: v,
      x: proj.x * scale,
      y: proj.y * scale,
      depth: proj.depth,
    };
  });

  return { vertices, edges, dimension };
}

// -- Utilities --------------------------------------------------------------

/**
 * Number of rotation plane-pairs for a given dimension.
 * This is C(n,2) = n*(n-1)/2.
 */
export function numRotationAngles(dimension: number): number {
  return (dimension * (dimension - 1)) / 2;
}

/**
 * Generate a palette of distinct colors for vertices.
 */
export function generatePalette(count: number, saturation = 70, lightness = 55): string[] {
  const colors: string[] = [];
  for (let i = 0; i < count; i++) {
    const hue = Math.round((360 * i) / count);
    colors.push(`hsl(${hue}, ${saturation}%, ${lightness}%)`);
  }
  return colors;
}
