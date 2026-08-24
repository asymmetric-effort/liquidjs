// (c) 2025-2026 Asymmetric Effort, LLC. MIT LICENSE
// SPDX-License-Identifier: MIT

import { describe, it, expect } from '@asymmetric-effort/nogginlessdom';
import {
  mat4Identity,
  mat4Multiply,
  mat4Transpose,
  mat4Inverse,
  mat4Translate,
  mat4Scale,
  mat4RotateX,
  mat4RotateY,
  mat4RotateZ,
  mat4Perspective,
  mat4Orthographic,
  mat4LookAt,
  mat4FromQuaternion,
  mat4TransformVec3,
  mat4TransformDirection,
  vec3,
  quatIdentity,
  quatFromAxisAngle,
} from '../../../../components/math/src/index';

const EPSILON = 1e-10;

describe('mat4Identity', () => {
  it('creates a 16-element Float64Array', () => {
    const m = mat4Identity();
    expect(m).toBeInstanceOf(Float64Array);
    expect(m.length).toBe(16);
  });

  it('has 1s on the diagonal and 0s elsewhere', () => {
    const m = mat4Identity();
    for (let col = 0; col < 4; col++) {
      for (let row = 0; row < 4; row++) {
        const expected = col === row ? 1 : 0;
        expect(m[col * 4 + row]).toBe(expected);
      }
    }
  });
});

describe('mat4Multiply', () => {
  it('returns identity when multiplying two identity matrices', () => {
    const I = mat4Identity();
    const result = mat4Multiply(I, I);
    for (let i = 0; i < 16; i++) {
      expect(result[i]).toBeCloseTo(I[i]!, EPSILON);
    }
  });

  it('returns A when multiplying identity * A', () => {
    const I = mat4Identity();
    const A = new Float64Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]);
    const result = mat4Multiply(I, A);
    for (let i = 0; i < 16; i++) {
      expect(result[i]).toBeCloseTo(A[i]!, EPSILON);
    }
  });

  it('returns A when multiplying A * identity', () => {
    const I = mat4Identity();
    const A = new Float64Array([2, 0, 0, 0, 0, 3, 0, 0, 0, 0, 4, 0, 0, 0, 0, 5]);
    const result = mat4Multiply(A, I);
    for (let i = 0; i < 16; i++) {
      expect(result[i]).toBeCloseTo(A[i]!, EPSILON);
    }
  });

  it('multiplies two diagonal matrices correctly', () => {
    const A = new Float64Array(16);
    A[0] = 2;
    A[5] = 3;
    A[10] = 4;
    A[15] = 1;
    const B = new Float64Array(16);
    B[0] = 5;
    B[5] = 6;
    B[10] = 7;
    B[15] = 1;
    const result = mat4Multiply(A, B);
    expect(result[0]).toBeCloseTo(10);
    expect(result[5]).toBeCloseTo(18);
    expect(result[10]).toBeCloseTo(28);
    expect(result[15]).toBeCloseTo(1);
  });

  it('is not commutative for general matrices', () => {
    const A = new Float64Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1, 2, 3, 1]);
    const B = new Float64Array([2, 0, 0, 0, 0, 2, 0, 0, 0, 0, 2, 0, 0, 0, 0, 1]);
    const AB = mat4Multiply(A, B);
    const BA = mat4Multiply(B, A);
    let same = true;
    for (let i = 0; i < 16; i++) {
      if (Math.abs(AB[i]! - BA[i]!) > EPSILON) same = false;
    }
    expect(same).toBe(false);
  });
});

describe('mat4Transpose', () => {
  it('transposes identity to identity', () => {
    const I = mat4Identity();
    const T = mat4Transpose(I);
    for (let i = 0; i < 16; i++) {
      expect(T[i]).toBe(I[i]);
    }
  });

  it('swaps rows and columns', () => {
    const m = new Float64Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]);
    const T = mat4Transpose(m);
    for (let col = 0; col < 4; col++) {
      for (let row = 0; row < 4; row++) {
        expect(T[col * 4 + row]).toBe(m[row * 4 + col]);
      }
    }
  });

  it('double transpose returns original', () => {
    const m = new Float64Array([1, 5, 9, 13, 2, 6, 10, 14, 3, 7, 11, 15, 4, 8, 12, 16]);
    const TT = mat4Transpose(mat4Transpose(m));
    for (let i = 0; i < 16; i++) {
      expect(TT[i]).toBeCloseTo(m[i]!, EPSILON);
    }
  });
});

describe('mat4Inverse', () => {
  it('returns identity when inverting identity', () => {
    const I = mat4Identity();
    const inv = mat4Inverse(I);
    expect(inv).not.toBeNull();
    for (let i = 0; i < 16; i++) {
      expect(inv![i]).toBeCloseTo(I[i]!, EPSILON);
    }
  });

  it('returns null for singular (zero) matrix', () => {
    const zero = new Float64Array(16);
    expect(mat4Inverse(zero)).toBeNull();
  });

  it('A * A^-1 = I for a translation matrix', () => {
    const A = mat4Translate(mat4Identity(), vec3(3, -7, 11));
    const invA = mat4Inverse(A);
    expect(invA).not.toBeNull();
    const product = mat4Multiply(A, invA!);
    const I = mat4Identity();
    for (let i = 0; i < 16; i++) {
      expect(product[i]).toBeCloseTo(I[i]!, 1e-8);
    }
  });

  it('A * A^-1 = I for a scale matrix', () => {
    const A = mat4Scale(mat4Identity(), vec3(2, 3, 4));
    const invA = mat4Inverse(A);
    expect(invA).not.toBeNull();
    const product = mat4Multiply(A, invA!);
    const I = mat4Identity();
    for (let i = 0; i < 16; i++) {
      expect(product[i]).toBeCloseTo(I[i]!, 1e-8);
    }
  });

  it('inverts a rotation matrix', () => {
    const A = mat4RotateX(mat4Identity(), Math.PI / 4);
    const invA = mat4Inverse(A);
    expect(invA).not.toBeNull();
    const product = mat4Multiply(A, invA!);
    const I = mat4Identity();
    for (let i = 0; i < 16; i++) {
      expect(product[i]).toBeCloseTo(I[i]!, 1e-8);
    }
  });
});

describe('mat4Translate', () => {
  it('translates identity matrix', () => {
    const m = mat4Translate(mat4Identity(), vec3(5, 10, 15));
    expect(m[12]).toBe(5);
    expect(m[13]).toBe(10);
    expect(m[14]).toBe(15);
    expect(m[15]).toBe(1);
    // Upper-left 3x3 should remain identity
    expect(m[0]).toBe(1);
    expect(m[5]).toBe(1);
    expect(m[10]).toBe(1);
  });

  it('translates by zero vector gives same matrix', () => {
    const I = mat4Identity();
    const result = mat4Translate(I, vec3(0, 0, 0));
    for (let i = 0; i < 16; i++) {
      expect(result[i]).toBeCloseTo(I[i]!, EPSILON);
    }
  });

  it('composes translations', () => {
    let m = mat4Translate(mat4Identity(), vec3(1, 2, 3));
    m = mat4Translate(m, vec3(4, 5, 6));
    expect(m[12]).toBeCloseTo(5);
    expect(m[13]).toBeCloseTo(7);
    expect(m[14]).toBeCloseTo(9);
  });
});

describe('mat4Scale', () => {
  it('scales identity matrix', () => {
    const m = mat4Scale(mat4Identity(), vec3(2, 3, 4));
    expect(m[0]).toBe(2);
    expect(m[5]).toBe(3);
    expect(m[10]).toBe(4);
    expect(m[15]).toBe(1);
  });

  it('scales by 1 gives identity', () => {
    const I = mat4Identity();
    const result = mat4Scale(I, vec3(1, 1, 1));
    for (let i = 0; i < 16; i++) {
      expect(result[i]).toBeCloseTo(I[i]!, EPSILON);
    }
  });

  it('preserves translation column', () => {
    const m = mat4Translate(mat4Identity(), vec3(10, 20, 30));
    const scaled = mat4Scale(m, vec3(2, 2, 2));
    expect(scaled[12]).toBe(10);
    expect(scaled[13]).toBe(20);
    expect(scaled[14]).toBe(30);
  });
});

describe('mat4RotateX', () => {
  it('rotating by 0 gives same matrix', () => {
    const I = mat4Identity();
    const result = mat4RotateX(I, 0);
    for (let i = 0; i < 16; i++) {
      expect(result[i]).toBeCloseTo(I[i]!, EPSILON);
    }
  });

  it('rotating by PI/2 transforms Y to Z', () => {
    const m = mat4RotateX(mat4Identity(), Math.PI / 2);
    // Column 1 (Y basis vector): should go from (0,1,0) to (0,0,1)
    expect(m[4]).toBeCloseTo(0);
    expect(m[5]).toBeCloseTo(0, 1e-10);
    expect(m[6]).toBeCloseTo(1);
  });

  it('rotating by 2*PI gives identity', () => {
    const I = mat4Identity();
    const result = mat4RotateX(I, 2 * Math.PI);
    for (let i = 0; i < 16; i++) {
      expect(result[i]).toBeCloseTo(I[i]!, 1e-10);
    }
  });

  it('preserves the first column (X axis)', () => {
    const I = mat4Identity();
    const result = mat4RotateX(I, Math.PI / 3);
    expect(result[0]).toBeCloseTo(1);
    expect(result[1]).toBeCloseTo(0);
    expect(result[2]).toBeCloseTo(0);
    expect(result[3]).toBeCloseTo(0);
  });
});

describe('mat4RotateY', () => {
  it('rotating by 0 gives same matrix', () => {
    const I = mat4Identity();
    const result = mat4RotateY(I, 0);
    for (let i = 0; i < 16; i++) {
      expect(result[i]).toBeCloseTo(I[i]!, EPSILON);
    }
  });

  it('rotating by PI/2 transforms X to -Z', () => {
    const m = mat4RotateY(mat4Identity(), Math.PI / 2);
    // Column 0 (X basis): should go from (1,0,0) to (0,0,-1)
    expect(m[0]).toBeCloseTo(0, 1e-10);
    expect(m[1]).toBeCloseTo(0);
    expect(m[2]).toBeCloseTo(-1);
  });

  it('rotating by 2*PI gives identity', () => {
    const I = mat4Identity();
    const result = mat4RotateY(I, 2 * Math.PI);
    for (let i = 0; i < 16; i++) {
      expect(result[i]).toBeCloseTo(I[i]!, 1e-10);
    }
  });

  it('preserves the second column (Y axis)', () => {
    const I = mat4Identity();
    const result = mat4RotateY(I, Math.PI / 5);
    expect(result[4]).toBeCloseTo(0);
    expect(result[5]).toBeCloseTo(1);
    expect(result[6]).toBeCloseTo(0);
    expect(result[7]).toBeCloseTo(0);
  });
});

describe('mat4RotateZ', () => {
  it('rotating by 0 gives same matrix', () => {
    const I = mat4Identity();
    const result = mat4RotateZ(I, 0);
    for (let i = 0; i < 16; i++) {
      expect(result[i]).toBeCloseTo(I[i]!, EPSILON);
    }
  });

  it('rotating by PI/2 transforms X to Y', () => {
    const m = mat4RotateZ(mat4Identity(), Math.PI / 2);
    // Column 0 (X basis): should go from (1,0,0) to (0,1,0)
    expect(m[0]).toBeCloseTo(0, 1e-10);
    expect(m[1]).toBeCloseTo(1);
    expect(m[2]).toBeCloseTo(0);
  });

  it('rotating by 2*PI gives identity', () => {
    const I = mat4Identity();
    const result = mat4RotateZ(I, 2 * Math.PI);
    for (let i = 0; i < 16; i++) {
      expect(result[i]).toBeCloseTo(I[i]!, 1e-10);
    }
  });

  it('preserves the third column (Z axis)', () => {
    const I = mat4Identity();
    const result = mat4RotateZ(I, Math.PI / 6);
    expect(result[8]).toBeCloseTo(0);
    expect(result[9]).toBeCloseTo(0);
    expect(result[10]).toBeCloseTo(1);
    expect(result[11]).toBeCloseTo(0);
  });
});

describe('mat4Perspective', () => {
  it('creates a perspective projection matrix', () => {
    const fovY = Math.PI / 4;
    const aspect = 16 / 9;
    const near = 0.1;
    const far = 100;
    const m = mat4Perspective(fovY, aspect, near, far);

    expect(m.length).toBe(16);
    // m[0] = f / aspect
    const f = 1 / Math.tan(fovY / 2);
    expect(m[0]).toBeCloseTo(f / aspect);
    // m[5] = f
    expect(m[5]).toBeCloseTo(f);
    // m[11] = -1
    expect(m[11]).toBe(-1);
    // m[15] = 0
    expect(m[15]).toBe(0);
    // m[10] and m[14] relate to near/far
    const nf = 1 / (near - far);
    expect(m[10]).toBeCloseTo((far + near) * nf);
    expect(m[14]).toBeCloseTo(2 * far * near * nf);
  });

  it('has zeros in off-diagonal positions', () => {
    const m = mat4Perspective(Math.PI / 3, 1, 1, 10);
    expect(m[1]).toBe(0);
    expect(m[2]).toBe(0);
    expect(m[3]).toBe(0);
    expect(m[4]).toBe(0);
    expect(m[6]).toBe(0);
    expect(m[7]).toBe(0);
    expect(m[8]).toBe(0);
    expect(m[9]).toBe(0);
    expect(m[12]).toBe(0);
    expect(m[13]).toBe(0);
    expect(m[15]).toBe(0);
  });
});

describe('mat4Orthographic', () => {
  it('creates an orthographic projection matrix', () => {
    const m = mat4Orthographic(-1, 1, -1, 1, 0.1, 100);
    expect(m.length).toBe(16);
    expect(m[15]).toBe(1);
    // For symmetric bounds (-1,1,-1,1), m[0] and m[5] should be 1
    expect(m[0]).toBeCloseTo(1);
    expect(m[5]).toBeCloseTo(1);
  });

  it('produces correct values for asymmetric bounds', () => {
    const left = 0,
      right = 800,
      bottom = 0,
      top = 600,
      near = -1,
      far = 1;
    const m = mat4Orthographic(left, right, bottom, top, near, far);
    const lr = 1 / (left - right);
    const bt = 1 / (bottom - top);
    const nf = 1 / (near - far);
    expect(m[0]).toBeCloseTo(-2 * lr);
    expect(m[5]).toBeCloseTo(-2 * bt);
    expect(m[10]).toBeCloseTo(2 * nf);
    expect(m[12]).toBeCloseTo((left + right) * lr);
    expect(m[13]).toBeCloseTo((top + bottom) * bt);
    expect(m[14]).toBeCloseTo((far + near) * nf);
    expect(m[15]).toBe(1);
  });

  it('has zeros in off-diagonal positions except translation', () => {
    const m = mat4Orthographic(-5, 5, -5, 5, 1, 100);
    expect(m[1]).toBe(0);
    expect(m[2]).toBe(0);
    expect(m[3]).toBe(0);
    expect(m[4]).toBe(0);
    expect(m[6]).toBe(0);
    expect(m[7]).toBe(0);
    expect(m[8]).toBe(0);
    expect(m[9]).toBe(0);
    expect(m[11]).toBe(0);
  });
});

describe('mat4LookAt', () => {
  it('looking along -Z from origin produces correct view matrix', () => {
    const eye = vec3(0, 0, 0);
    const target = vec3(0, 0, -1);
    const up = vec3(0, 1, 0);
    const m = mat4LookAt(eye, target, up);

    expect(m.length).toBe(16);
    // With eye at origin, translation column should be ~0
    expect(m[12]).toBeCloseTo(0);
    expect(m[13]).toBeCloseTo(0);
    expect(m[14]).toBeCloseTo(0);
    expect(m[15]).toBe(1);
  });

  it('looking from offset position includes translation', () => {
    const eye = vec3(5, 3, 10);
    const target = vec3(0, 0, 0);
    const up = vec3(0, 1, 0);
    const m = mat4LookAt(eye, target, up);

    expect(m.length).toBe(16);
    expect(m[15]).toBe(1);
    // Translation components should be non-zero
    const hasTranslation =
      Math.abs(m[12]!) > 0.001 || Math.abs(m[13]!) > 0.001 || Math.abs(m[14]!) > 0.001;
    expect(hasTranslation).toBe(true);
  });

  it('produces an orthonormal upper-left 3x3', () => {
    const eye = vec3(1, 2, 3);
    const target = vec3(4, 5, 6);
    const up = vec3(0, 1, 0);
    const m = mat4LookAt(eye, target, up);

    // Check each column vector has unit length
    for (let col = 0; col < 3; col++) {
      const x = m[col * 4]!;
      const y = m[col * 4 + 1]!;
      const z = m[col * 4 + 2]!;
      const len = Math.sqrt(x * x + y * y + z * z);
      expect(len).toBeCloseTo(1, 1e-10);
    }
  });
});

describe('mat4FromQuaternion', () => {
  it('identity quaternion produces identity matrix', () => {
    const q = quatIdentity();
    const m = mat4FromQuaternion(q);
    const I = mat4Identity();
    for (let i = 0; i < 16; i++) {
      expect(m[i]).toBeCloseTo(I[i]!, EPSILON);
    }
  });

  it('90-degree rotation around Y axis', () => {
    const q = quatFromAxisAngle(vec3(0, 1, 0), Math.PI / 2);
    const m = mat4FromQuaternion(q);
    // X basis (column 0) should become (0, 0, -1)
    expect(m[0]).toBeCloseTo(0, 1e-10);
    expect(m[1]).toBeCloseTo(0);
    expect(m[2]).toBeCloseTo(-1);
    // Y basis (column 1) should stay (0, 1, 0)
    expect(m[4]).toBeCloseTo(0);
    expect(m[5]).toBeCloseTo(1);
    expect(m[6]).toBeCloseTo(0);
    // Last row should be (0,0,0,1)
    expect(m[3]).toBe(0);
    expect(m[7]).toBe(0);
    expect(m[11]).toBe(0);
    expect(m[15]).toBe(1);
  });

  it('rotation matrix is orthogonal', () => {
    const q = quatFromAxisAngle(vec3(1, 1, 1), Math.PI / 3);
    const m = mat4FromQuaternion(q);
    // M * M^T should be identity (for the 3x3 upper-left)
    const MT = mat4Transpose(m);
    const product = mat4Multiply(m, MT);
    const I = mat4Identity();
    for (let i = 0; i < 16; i++) {
      expect(product[i]).toBeCloseTo(I[i]!, 1e-10);
    }
  });
});

describe('mat4TransformVec3', () => {
  it('identity matrix does not change a point', () => {
    const v = vec3(3, 4, 5);
    const result = mat4TransformVec3(mat4Identity(), v);
    expect(result.x).toBeCloseTo(3);
    expect(result.y).toBeCloseTo(4);
    expect(result.z).toBeCloseTo(5);
  });

  it('translation matrix moves a point', () => {
    const m = mat4Translate(mat4Identity(), vec3(10, 20, 30));
    const result = mat4TransformVec3(m, vec3(1, 2, 3));
    expect(result.x).toBeCloseTo(11);
    expect(result.y).toBeCloseTo(22);
    expect(result.z).toBeCloseTo(33);
  });

  it('scale matrix scales a point', () => {
    const m = mat4Scale(mat4Identity(), vec3(2, 3, 4));
    const result = mat4TransformVec3(m, vec3(1, 1, 1));
    expect(result.x).toBeCloseTo(2);
    expect(result.y).toBeCloseTo(3);
    expect(result.z).toBeCloseTo(4);
  });

  it('handles perspective division when w != 1', () => {
    const m = mat4Perspective(Math.PI / 4, 1, 0.1, 100);
    const result = mat4TransformVec3(m, vec3(1, 1, -5));
    // Result should be finite (perspective division occurred)
    expect(isFinite(result.x)).toBe(true);
    expect(isFinite(result.y)).toBe(true);
    expect(isFinite(result.z)).toBe(true);
  });

  it('handles w=0 gracefully (uses invW=1)', () => {
    // Create a matrix where w column produces 0
    const m = new Float64Array(16);
    m[0] = 1;
    m[5] = 1;
    m[10] = 1;
    // m[3], m[7], m[11], m[15] are all 0 -> w = 0
    const result = mat4TransformVec3(m, vec3(1, 2, 3));
    expect(isFinite(result.x)).toBe(true);
  });
});

describe('mat4TransformDirection', () => {
  it('identity matrix does not change a direction', () => {
    const v = vec3(1, 0, 0);
    const result = mat4TransformDirection(mat4Identity(), v);
    expect(result.x).toBeCloseTo(1);
    expect(result.y).toBeCloseTo(0);
    expect(result.z).toBeCloseTo(0);
  });

  it('ignores translation', () => {
    const m = mat4Translate(mat4Identity(), vec3(100, 200, 300));
    const result = mat4TransformDirection(m, vec3(1, 0, 0));
    expect(result.x).toBeCloseTo(1);
    expect(result.y).toBeCloseTo(0);
    expect(result.z).toBeCloseTo(0);
  });

  it('rotation applies to direction', () => {
    const m = mat4RotateZ(mat4Identity(), Math.PI / 2);
    const result = mat4TransformDirection(m, vec3(1, 0, 0));
    expect(result.x).toBeCloseTo(0, 1e-10);
    expect(result.y).toBeCloseTo(1);
    expect(result.z).toBeCloseTo(0);
  });

  it('scale applies to direction', () => {
    const m = mat4Scale(mat4Identity(), vec3(2, 3, 4));
    const result = mat4TransformDirection(m, vec3(1, 1, 1));
    expect(result.x).toBeCloseTo(2);
    expect(result.y).toBeCloseTo(3);
    expect(result.z).toBeCloseTo(4);
  });
});
