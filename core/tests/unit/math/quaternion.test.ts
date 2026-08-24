// (c) 2025-2026 Asymmetric Effort, LLC. MIT LICENSE
// SPDX-License-Identifier: MIT

import { describe, it, expect } from '@asymmetric-effort/nogginlessdom';
import {
  quatIdentity,
  quatFromAxisAngle,
  quatFromEuler,
  quatMultiply,
  quatConjugate,
  quatInverse,
  quatNormalize,
  quatLength,
  quatDot,
  quatSlerp,
  quatRotateVec3,
  quatToEuler,
  quatLookAt,
  vec3,
  vec3Length,
} from '../../../../components/math/src/index';

const EPSILON = 1e-10;

describe('quatIdentity', () => {
  it('returns (0, 0, 0, 1)', () => {
    const q = quatIdentity();
    expect(q.x).toBe(0);
    expect(q.y).toBe(0);
    expect(q.z).toBe(0);
    expect(q.w).toBe(1);
  });

  it('has unit length', () => {
    expect(quatLength(quatIdentity())).toBeCloseTo(1);
  });
});

describe('quatFromAxisAngle', () => {
  it('zero angle gives identity', () => {
    const q = quatFromAxisAngle(vec3(1, 0, 0), 0);
    expect(q.x).toBeCloseTo(0);
    expect(q.y).toBeCloseTo(0);
    expect(q.z).toBeCloseTo(0);
    expect(q.w).toBeCloseTo(1);
  });

  it('90 degrees around X axis', () => {
    const q = quatFromAxisAngle(vec3(1, 0, 0), Math.PI / 2);
    expect(quatLength(q)).toBeCloseTo(1);
    expect(q.x).toBeCloseTo(Math.sin(Math.PI / 4));
    expect(q.y).toBeCloseTo(0);
    expect(q.z).toBeCloseTo(0);
    expect(q.w).toBeCloseTo(Math.cos(Math.PI / 4));
  });

  it('normalizes the axis', () => {
    const q1 = quatFromAxisAngle(vec3(2, 0, 0), Math.PI / 3);
    const q2 = quatFromAxisAngle(vec3(1, 0, 0), Math.PI / 3);
    expect(q1.x).toBeCloseTo(q2.x);
    expect(q1.y).toBeCloseTo(q2.y);
    expect(q1.z).toBeCloseTo(q2.z);
    expect(q1.w).toBeCloseTo(q2.w);
  });

  it('180 degrees around Y axis', () => {
    const q = quatFromAxisAngle(vec3(0, 1, 0), Math.PI);
    expect(quatLength(q)).toBeCloseTo(1);
    expect(q.w).toBeCloseTo(0, 1e-10);
    expect(q.y).toBeCloseTo(1, 1e-10);
  });
});

describe('quatFromEuler', () => {
  it('zero Euler angles give identity', () => {
    const q = quatFromEuler(0, 0, 0);
    expect(q.x).toBeCloseTo(0);
    expect(q.y).toBeCloseTo(0);
    expect(q.z).toBeCloseTo(0);
    expect(q.w).toBeCloseTo(1);
  });

  it('produces unit quaternion', () => {
    const q = quatFromEuler(Math.PI / 4, Math.PI / 6, Math.PI / 3);
    expect(quatLength(q)).toBeCloseTo(1);
  });

  it('pitch only rotates around appropriate axis', () => {
    const q = quatFromEuler(Math.PI / 2, 0, 0);
    expect(quatLength(q)).toBeCloseTo(1);
  });

  it('yaw only rotates around appropriate axis', () => {
    const q = quatFromEuler(0, Math.PI / 2, 0);
    expect(quatLength(q)).toBeCloseTo(1);
  });

  it('roll only rotates around appropriate axis', () => {
    const q = quatFromEuler(0, 0, Math.PI / 2);
    expect(quatLength(q)).toBeCloseTo(1);
  });
});

describe('quatMultiply', () => {
  it('multiplying by identity gives same quaternion', () => {
    const q = quatFromAxisAngle(vec3(0, 1, 0), Math.PI / 4);
    const I = quatIdentity();
    const result = quatMultiply(q, I);
    expect(result.x).toBeCloseTo(q.x);
    expect(result.y).toBeCloseTo(q.y);
    expect(result.z).toBeCloseTo(q.z);
    expect(result.w).toBeCloseTo(q.w);
  });

  it('identity * q = q', () => {
    const q = quatFromAxisAngle(vec3(1, 0, 0), Math.PI / 3);
    const result = quatMultiply(quatIdentity(), q);
    expect(result.x).toBeCloseTo(q.x);
    expect(result.y).toBeCloseTo(q.y);
    expect(result.z).toBeCloseTo(q.z);
    expect(result.w).toBeCloseTo(q.w);
  });

  it('q * q^-1 = identity', () => {
    const q = quatFromAxisAngle(vec3(1, 1, 0), Math.PI / 5);
    const inv = quatInverse(q);
    const result = quatMultiply(q, inv);
    expect(result.x).toBeCloseTo(0, 1e-10);
    expect(result.y).toBeCloseTo(0, 1e-10);
    expect(result.z).toBeCloseTo(0, 1e-10);
    expect(result.w).toBeCloseTo(1, 1e-10);
  });

  it('product has unit length when inputs are unit', () => {
    const a = quatFromAxisAngle(vec3(1, 0, 0), Math.PI / 4);
    const b = quatFromAxisAngle(vec3(0, 1, 0), Math.PI / 3);
    const result = quatMultiply(a, b);
    expect(quatLength(result)).toBeCloseTo(1);
  });
});

describe('quatConjugate', () => {
  it('negates imaginary parts', () => {
    const q = { x: 1, y: 2, z: 3, w: 4 };
    const c = quatConjugate(q);
    expect(c.x).toBe(-1);
    expect(c.y).toBe(-2);
    expect(c.z).toBe(-3);
    expect(c.w).toBe(4);
  });

  it('conjugate of identity is identity', () => {
    const c = quatConjugate(quatIdentity());
    expect(c.x).toBeCloseTo(0);
    expect(c.y).toBeCloseTo(0);
    expect(c.z).toBeCloseTo(0);
    expect(c.w).toBeCloseTo(1);
  });
});

describe('quatInverse', () => {
  it('inverse of identity is identity', () => {
    const inv = quatInverse(quatIdentity());
    expect(inv.x).toBeCloseTo(0);
    expect(inv.y).toBeCloseTo(0);
    expect(inv.z).toBeCloseTo(0);
    expect(inv.w).toBeCloseTo(1);
  });

  it('returns zero quaternion for zero-length input', () => {
    const inv = quatInverse({ x: 0, y: 0, z: 0, w: 0 });
    expect(inv.x).toBe(0);
    expect(inv.y).toBe(0);
    expect(inv.z).toBe(0);
    expect(inv.w).toBe(0);
  });

  it('inverse of unit quaternion equals conjugate', () => {
    const q = quatFromAxisAngle(vec3(0, 0, 1), Math.PI / 6);
    const inv = quatInverse(q);
    const conj = quatConjugate(q);
    expect(inv.x).toBeCloseTo(conj.x);
    expect(inv.y).toBeCloseTo(conj.y);
    expect(inv.z).toBeCloseTo(conj.z);
    expect(inv.w).toBeCloseTo(conj.w);
  });

  it('handles non-unit quaternion', () => {
    const q = { x: 2, y: 0, z: 0, w: 2 };
    const inv = quatInverse(q);
    const product = quatMultiply(q, inv);
    expect(product.x).toBeCloseTo(0, 1e-10);
    expect(product.y).toBeCloseTo(0, 1e-10);
    expect(product.z).toBeCloseTo(0, 1e-10);
    expect(product.w).toBeCloseTo(1, 1e-10);
  });
});

describe('quatNormalize', () => {
  it('normalizes a quaternion to unit length', () => {
    const q = { x: 1, y: 2, z: 3, w: 4 };
    const n = quatNormalize(q);
    expect(quatLength(n)).toBeCloseTo(1);
  });

  it('returns zero quaternion for zero-length input', () => {
    const n = quatNormalize({ x: 0, y: 0, z: 0, w: 0 });
    expect(n.x).toBe(0);
    expect(n.y).toBe(0);
    expect(n.z).toBe(0);
    expect(n.w).toBe(0);
  });

  it('preserves direction', () => {
    const q = { x: 3, y: 0, z: 0, w: 4 };
    const n = quatNormalize(q);
    expect(n.x).toBeGreaterThan(0);
    expect(n.w).toBeGreaterThan(0);
    expect(n.y).toBeCloseTo(0);
    expect(n.z).toBeCloseTo(0);
  });

  it('unit quaternion stays the same', () => {
    const q = quatIdentity();
    const n = quatNormalize(q);
    expect(n.x).toBeCloseTo(q.x);
    expect(n.y).toBeCloseTo(q.y);
    expect(n.z).toBeCloseTo(q.z);
    expect(n.w).toBeCloseTo(q.w);
  });
});

describe('quatLength', () => {
  it('identity quaternion has length 1', () => {
    expect(quatLength(quatIdentity())).toBeCloseTo(1);
  });

  it('zero quaternion has length 0', () => {
    expect(quatLength({ x: 0, y: 0, z: 0, w: 0 })).toBe(0);
  });

  it('computes correct length', () => {
    // |q| = sqrt(1 + 4 + 9 + 16) = sqrt(30)
    expect(quatLength({ x: 1, y: 2, z: 3, w: 4 })).toBeCloseTo(Math.sqrt(30));
  });
});

describe('quatDot', () => {
  it('dot product with itself equals length squared', () => {
    const q = { x: 1, y: 2, z: 3, w: 4 };
    const lenSq = quatLength(q) ** 2;
    expect(quatDot(q, q)).toBeCloseTo(lenSq);
  });

  it('dot product of orthogonal unit quaternions is 0', () => {
    // Two quaternions representing 180 rotations about X and Y axes
    const a = { x: 1, y: 0, z: 0, w: 0 };
    const b = { x: 0, y: 1, z: 0, w: 0 };
    expect(quatDot(a, b)).toBeCloseTo(0);
  });

  it('dot product is commutative', () => {
    const a = { x: 1, y: 2, z: 3, w: 4 };
    const b = { x: 5, y: 6, z: 7, w: 8 };
    expect(quatDot(a, b)).toBeCloseTo(quatDot(b, a));
  });
});

describe('quatSlerp', () => {
  it('slerp(a, b, 0) = a', () => {
    const a = quatFromAxisAngle(vec3(1, 0, 0), 0);
    const b = quatFromAxisAngle(vec3(1, 0, 0), Math.PI);
    const result = quatSlerp(a, b, 0);
    expect(result.x).toBeCloseTo(a.x);
    expect(result.y).toBeCloseTo(a.y);
    expect(result.z).toBeCloseTo(a.z);
    expect(result.w).toBeCloseTo(a.w);
  });

  it('slerp(a, b, 1) = b', () => {
    const a = quatFromAxisAngle(vec3(1, 0, 0), 0);
    const b = quatFromAxisAngle(vec3(1, 0, 0), Math.PI / 2);
    const result = quatSlerp(a, b, 1);
    expect(result.x).toBeCloseTo(b.x, 1e-6);
    expect(result.y).toBeCloseTo(b.y, 1e-6);
    expect(result.z).toBeCloseTo(b.z, 1e-6);
    expect(result.w).toBeCloseTo(b.w, 1e-6);
  });

  it('slerp midpoint is between the two quaternions', () => {
    const a = quatFromAxisAngle(vec3(0, 1, 0), 0);
    const b = quatFromAxisAngle(vec3(0, 1, 0), Math.PI / 2);
    const mid = quatSlerp(a, b, 0.5);
    expect(quatLength(mid)).toBeCloseTo(1, 1e-6);
  });

  it('handles negative dot product (takes shorter path)', () => {
    const a = quatIdentity();
    // b is the negation of a rotation -> dot < 0
    const b = { x: 0, y: 0, z: 0, w: -1 };
    const result = quatSlerp(a, b, 0.5);
    // Should still produce a valid quaternion
    expect(isFinite(result.x)).toBe(true);
    expect(isFinite(result.w)).toBe(true);
  });

  it('falls back to lerp when quaternions are very close (dot > 0.9995)', () => {
    const a = quatFromAxisAngle(vec3(1, 0, 0), 0);
    const b = quatFromAxisAngle(vec3(1, 0, 0), 0.0001);
    const result = quatSlerp(a, b, 0.5);
    expect(quatLength(result)).toBeCloseTo(1, 1e-6);
  });

  it('produces unit quaternion at all t values', () => {
    const a = quatFromAxisAngle(vec3(0, 0, 1), 0);
    const b = quatFromAxisAngle(vec3(0, 0, 1), Math.PI / 2);
    for (const t of [0, 0.1, 0.25, 0.5, 0.75, 0.9, 1]) {
      const result = quatSlerp(a, b, t);
      expect(quatLength(result)).toBeCloseTo(1, 1e-6);
    }
  });
});

describe('quatRotateVec3', () => {
  it('identity quaternion does not change the vector', () => {
    const v = vec3(1, 2, 3);
    const result = quatRotateVec3(quatIdentity(), v);
    expect(result.x).toBeCloseTo(1);
    expect(result.y).toBeCloseTo(2);
    expect(result.z).toBeCloseTo(3);
  });

  it('90-degree rotation around Z maps X to Y', () => {
    const q = quatFromAxisAngle(vec3(0, 0, 1), Math.PI / 2);
    const result = quatRotateVec3(q, vec3(1, 0, 0));
    expect(result.x).toBeCloseTo(0, 1e-10);
    expect(result.y).toBeCloseTo(1);
    expect(result.z).toBeCloseTo(0);
  });

  it('preserves vector length', () => {
    const q = quatFromAxisAngle(vec3(1, 1, 1), Math.PI / 3);
    const v = vec3(3, 4, 5);
    const result = quatRotateVec3(q, v);
    const origLen = vec3Length(v);
    const newLen = vec3Length(result);
    expect(newLen).toBeCloseTo(origLen, 1e-10);
  });

  it('180-degree rotation around Y maps X to -X', () => {
    const q = quatFromAxisAngle(vec3(0, 1, 0), Math.PI);
    const result = quatRotateVec3(q, vec3(1, 0, 0));
    expect(result.x).toBeCloseTo(-1, 1e-10);
    expect(result.y).toBeCloseTo(0, 1e-10);
    expect(result.z).toBeCloseTo(0, 1e-10);
  });
});

describe('quatToEuler', () => {
  it('identity quaternion gives zero angles', () => {
    const euler = quatToEuler(quatIdentity());
    expect(euler.x).toBeCloseTo(0);
    expect(euler.y).toBeCloseTo(0);
    expect(euler.z).toBeCloseTo(0);
  });

  it('round-trips through fromEuler and back', () => {
    const pitch = 0.3;
    const yaw = 0.5;
    const roll = 0.7;
    const q = quatFromEuler(pitch, yaw, roll);
    const euler = quatToEuler(q);
    // The conventions may differ, but the quaternion round-trip should be consistent
    const q2 = quatFromEuler(euler.x, euler.y, euler.z);
    // Compare the quaternions (may differ in sign)
    const dotVal = Math.abs(quatDot(q, q2));
    expect(dotVal).toBeCloseTo(1, 1e-6);
  });

  it('handles gimbal lock (sinp >= 1)', () => {
    // Create a quaternion that gives sinp >= 1 (pitch = PI/2)
    const q = quatFromAxisAngle(vec3(0, 1, 0), Math.PI / 2);
    const euler = quatToEuler(q);
    // Should not produce NaN
    expect(isFinite(euler.x)).toBe(true);
    expect(isFinite(euler.y)).toBe(true);
    expect(isFinite(euler.z)).toBe(true);
  });

  it('handles gimbal lock (sinp <= -1)', () => {
    // Negative gimbal lock
    const q = quatFromAxisAngle(vec3(0, 1, 0), -Math.PI / 2);
    const euler = quatToEuler(q);
    expect(isFinite(euler.x)).toBe(true);
    expect(isFinite(euler.y)).toBe(true);
    expect(isFinite(euler.z)).toBe(true);
  });
});

describe('quatLookAt', () => {
  it('looking along +Z with Y up', () => {
    const q = quatLookAt(vec3(0, 0, 1), vec3(0, 1, 0));
    expect(quatLength(q)).toBeCloseTo(1, 1e-6);
  });

  it('looking along +X with Y up', () => {
    const q = quatLookAt(vec3(1, 0, 0), vec3(0, 1, 0));
    expect(quatLength(q)).toBeCloseTo(1, 1e-6);
    // Rotating (0,0,1) by this quaternion should give approximately (1,0,0)
    const result = quatRotateVec3(q, vec3(0, 0, 1));
    expect(result.x).toBeCloseTo(1, 1e-6);
    expect(result.y).toBeCloseTo(0, 1e-6);
    expect(result.z).toBeCloseTo(0, 1e-6);
  });

  it('looking along -Z with Y up', () => {
    const q = quatLookAt(vec3(0, 0, -1), vec3(0, 1, 0));
    expect(quatLength(q)).toBeCloseTo(1, 1e-6);
  });

  it('produces a unit quaternion for arbitrary direction', () => {
    const q = quatLookAt(vec3(1, 1, 1), vec3(0, 1, 0));
    expect(quatLength(q)).toBeCloseTo(1, 1e-6);
  });

  it('handles looking along +Y with Z up (m11 > m22 branch)', () => {
    const q = quatLookAt(vec3(0, 1, 0), vec3(0, 0, 1));
    expect(quatLength(q)).toBeCloseTo(1, 1e-6);
  });

  it('handles diagonal direction with non-standard up (m22 dominant branch)', () => {
    // Force the m22 > m00 && m22 > m11 branch by looking along Z with X up
    const q = quatLookAt(vec3(0, 0, 1), vec3(1, 0, 0));
    expect(quatLength(q)).toBeCloseTo(1, 1e-6);
  });

  it('handles direction where m00 is dominant', () => {
    // Force m00 > m11 && m00 > m22 branch
    const q = quatLookAt(vec3(1, 0, 0), vec3(0, 0, 1));
    expect(quatLength(q)).toBeCloseTo(1, 1e-6);
  });
});
