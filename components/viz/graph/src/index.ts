// (c) 2025-2026 Asymmetric Effort, LLC. MIT LICENSE
// SPDX-License-Identifier: MIT

export { HypercubeGraph, useHypercube } from './HypercubeGraph';
export type { HypercubeGraphProps, UseHypercubeOptions } from './HypercubeGraph';

export {
  generateVertices,
  generateEdges,
  generateHypercube,
  buildRotationMatrix,
  transformVec,
  projectTo2D,
  numRotationAngles,
  generatePalette,
} from './hypercube';
export type { Vec, Vertex, Edge, HypercubeData } from './hypercube';
