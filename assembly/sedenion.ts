/**
 * Sedenion Algebra Implementation (16D Hypercomplex Numbers)
 * 
 * Sedenions are 16-dimensional hypercomplex numbers built via Cayley-Dickson construction.
 * They are non-commutative and non-associative, with zero divisors.
 * 
 * Components: e0 (real), e1-e15 (imaginary units)
 */

import { Serializable } from './core/interfaces';
import { JSONBuilder } from './core/serialization';
import { toFixed } from './utils';

// @ts-ignore
export class Sedenion implements Serializable {
  // 16 components
  public c0: f64; public c1: f64; public c2: f64; public c3: f64;
  public c4: f64; public c5: f64; public c6: f64; public c7: f64;
  public c8: f64; public c9: f64; public c10: f64; public c11: f64;
  public c12: f64; public c13: f64; public c14: f64; public c15: f64;

  constructor(
    c0: f64, c1: f64, c2: f64, c3: f64,
    c4: f64, c5: f64, c6: f64, c7: f64,
    c8: f64, c9: f64, c10: f64, c11: f64,
    c12: f64, c13: f64, c14: f64, c15: f64
  ) {
    this.c0 = c0; this.c1 = c1; this.c2 = c2; this.c3 = c3;
    this.c4 = c4; this.c5 = c5; this.c6 = c6; this.c7 = c7;
    this.c8 = c8; this.c9 = c9; this.c10 = c10; this.c11 = c11;
    this.c12 = c12; this.c13 = c13; this.c14 = c14; this.c15 = c15;
  }

  static zero(): Sedenion {
    return new Sedenion(0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0);
  }

  static unit(): Sedenion {
    return new Sedenion(1,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0);
  }

  // Helper to get component by index
  get(index: i32): f64 {
    switch (index) {
      case 0: return this.c0;
      case 1: return this.c1;
      case 2: return this.c2;
      case 3: return this.c3;
      case 4: return this.c4;
      case 5: return this.c5;
      case 6: return this.c6;
      case 7: return this.c7;
      case 8: return this.c8;
      case 9: return this.c9;
      case 10: return this.c10;
      case 11: return this.c11;
      case 12: return this.c12;
      case 13: return this.c13;
      case 14: return this.c14;
      case 15: return this.c15;
      default: return 0.0;
    }
  }

  set(index: i32, value: f64): void {
    switch (index) {
      case 0: this.c0 = value; break;
      case 1: this.c1 = value; break;
      case 2: this.c2 = value; break;
      case 3: this.c3 = value; break;
      case 4: this.c4 = value; break;
      case 5: this.c5 = value; break;
      case 6: this.c6 = value; break;
      case 7: this.c7 = value; break;
      case 8: this.c8 = value; break;
      case 9: this.c9 = value; break;
      case 10: this.c10 = value; break;
      case 11: this.c11 = value; break;
      case 12: this.c12 = value; break;
      case 13: this.c13 = value; break;
      case 14: this.c14 = value; break;
      case 15: this.c15 = value; break;
    }
  }

  add(other: Sedenion): Sedenion {
    return new Sedenion(
      this.c0 + other.c0, this.c1 + other.c1, this.c2 + other.c2, this.c3 + other.c3,
      this.c4 + other.c4, this.c5 + other.c5, this.c6 + other.c6, this.c7 + other.c7,
      this.c8 + other.c8, this.c9 + other.c9, this.c10 + other.c10, this.c11 + other.c11,
      this.c12 + other.c12, this.c13 + other.c13, this.c14 + other.c14, this.c15 + other.c15
    );
  }

  subtract(other: Sedenion): Sedenion {
    return new Sedenion(
      this.c0 - other.c0, this.c1 - other.c1, this.c2 - other.c2, this.c3 - other.c3,
      this.c4 - other.c4, this.c5 - other.c5, this.c6 - other.c6, this.c7 - other.c7,
      this.c8 - other.c8, this.c9 - other.c9, this.c10 - other.c10, this.c11 - other.c11,
      this.c12 - other.c12, this.c13 - other.c13, this.c14 - other.c14, this.c15 - other.c15
    );
  }

  scale(scalar: f64): Sedenion {
    return new Sedenion(
      this.c0 * scalar, this.c1 * scalar, this.c2 * scalar, this.c3 * scalar,
      this.c4 * scalar, this.c5 * scalar, this.c6 * scalar, this.c7 * scalar,
      this.c8 * scalar, this.c9 * scalar, this.c10 * scalar, this.c11 * scalar,
      this.c12 * scalar, this.c13 * scalar, this.c14 * scalar, this.c15 * scalar
    );
  }

  conjugate(): Sedenion {
    return new Sedenion(
      this.c0, -this.c1, -this.c2, -this.c3,
      -this.c4, -this.c5, -this.c6, -this.c7,
      -this.c8, -this.c9, -this.c10, -this.c11,
      -this.c12, -this.c13, -this.c14, -this.c15
    );
  }

  normSquared(): f64 {
    return this.c0*this.c0 + this.c1*this.c1 + this.c2*this.c2 + this.c3*this.c3 +
           this.c4*this.c4 + this.c5*this.c5 + this.c6*this.c6 + this.c7*this.c7 +
           this.c8*this.c8 + this.c9*this.c9 + this.c10*this.c10 + this.c11*this.c11 +
           this.c12*this.c12 + this.c13*this.c13 + this.c14*this.c14 + this.c15*this.c15;
  }

  norm(): f64 {
    return Math.sqrt(this.normSquared());
  }

  normalize(): Sedenion {
    const n = this.norm();
    if (n < 1e-10) return Sedenion.unit();
    const inv = 1.0 / n;
    return this.scale(inv);
  }

  dot(other: Sedenion): f64 {
    return this.c0*other.c0 + this.c1*other.c1 + this.c2*other.c2 + this.c3*other.c3 +
           this.c4*other.c4 + this.c5*other.c5 + this.c6*other.c6 + this.c7*other.c7 +
           this.c8*other.c8 + this.c9*other.c9 + this.c10*other.c10 + this.c11*other.c11 +
           this.c12*other.c12 + this.c13*other.c13 + this.c14*other.c14 + this.c15*other.c15;
  }

  entropy(): f64 {
    const total = this.normSquared();
    if (total == 0) return 0.0;
    
    let entropy = 0.0;
    // Loop through all 16 components
    for (let i = 0; i < 16; i++) {
      const val = this.get(i);
      const p = (val * val) / total;
      if (p > 0) {
        entropy -= p * Math.log(p);
      }
    }
    return entropy;
  }

  // Sedenion multiplication using Cayley-Dickson construction
  // (a,b)(c,d) = (ac - d*b, da + bc*)
  // where a,b,c,d are Octonions
  multiply(other: Sedenion): Sedenion {
    // Extract octonions
    const a = this.getOctonion(0);
    const b = this.getOctonion(1);
    const c = other.getOctonion(0);
    const d = other.getOctonion(1);

    const dConj = d.conjugate();
    const cConj = c.conjugate();

    // r0 = ac - d*b
    const ac = a.multiply(c);
    const dConjB = dConj.multiply(b);
    const r0 = ac.subtract(dConjB);

    // r1 = da + bc*
    const da = d.multiply(a);
    const bcConj = b.multiply(cConj);
    const r1 = da.add(bcConj);

    return Sedenion.fromOctonions(r0, r1);
  }

  // Helper to extract octonions
  // index 0 = first 8 components, index 1 = last 8 components
  private getOctonion(index: i32): Octonion {
    if (index == 0) {
      return new Octonion(this.c0, this.c1, this.c2, this.c3, this.c4, this.c5, this.c6, this.c7);
    } else {
      return new Octonion(this.c8, this.c9, this.c10, this.c11, this.c12, this.c13, this.c14, this.c15);
    }
  }

  static fromOctonions(o1: Octonion, o2: Octonion): Sedenion {
    return new Sedenion(
      o1.c0, o1.c1, o1.c2, o1.c3, o1.c4, o1.c5, o1.c6, o1.c7,
      o2.c0, o2.c1, o2.c2, o2.c3, o2.c4, o2.c5, o2.c6, o2.c7
    );
  }

  toJSON(): string {
    const builder = new JSONBuilder();
    builder.startObject();
    builder.addNumberField("c0", this.c0);
    builder.addNumberField("c1", this.c1);
    // ... brevity for JSON
    builder.endObject();
    return builder.build();
  }

  toString(): string {
    return `Sedenion(${toFixed(this.c0, 2)}, ${toFixed(this.c1, 2)}...)`;
  }
}

// Helper class for Octonion arithmetic (8D)
class Octonion {
  constructor(
    public c0: f64, public c1: f64, public c2: f64, public c3: f64,
    public c4: f64, public c5: f64, public c6: f64, public c7: f64
  ) {}

  add(other: Octonion): Octonion {
    return new Octonion(
      this.c0 + other.c0, this.c1 + other.c1, this.c2 + other.c2, this.c3 + other.c3,
      this.c4 + other.c4, this.c5 + other.c5, this.c6 + other.c6, this.c7 + other.c7
    );
  }

  subtract(other: Octonion): Octonion {
    return new Octonion(
      this.c0 - other.c0, this.c1 - other.c1, this.c2 - other.c2, this.c3 - other.c3,
      this.c4 - other.c4, this.c5 - other.c5, this.c6 - other.c6, this.c7 - other.c7
    );
  }

  conjugate(): Octonion {
    return new Octonion(
      this.c0, -this.c1, -this.c2, -this.c3,
      -this.c4, -this.c5, -this.c6, -this.c7
    );
  }

  multiply(other: Octonion): Octonion {
    // Cayley-Dickson: (a,b)(c,d) = (ac - d*b, da + bc*)
    // a,b,c,d are Quaternions
    const a = new Quaternion(this.c0, this.c1, this.c2, this.c3);
    const b = new Quaternion(this.c4, this.c5, this.c6, this.c7);
    const c = new Quaternion(other.c0, other.c1, other.c2, other.c3);
    const d = new Quaternion(other.c4, other.c5, other.c6, other.c7);

    const dConj = d.conjugate();
    const cConj = c.conjugate();

    const ac = a.multiply(c);
    const dConjB = dConj.multiply(b);
    const r0 = ac.subtract(dConjB);

    const da = d.multiply(a);
    const bcConj = b.multiply(cConj);
    const r1 = da.add(bcConj);

    return new Octonion(r0.w, r0.x, r0.y, r0.z, r1.w, r1.x, r1.y, r1.z);
  }
}

// Basic Quaternion for Octonion construction (internal use)
class Quaternion {
  constructor(public w: f64, public x: f64, public y: f64, public z: f64) {}

  add(other: Quaternion): Quaternion {
    return new Quaternion(this.w + other.w, this.x + other.x, this.y + other.y, this.z + other.z);
  }

  subtract(other: Quaternion): Quaternion {
    return new Quaternion(this.w - other.w, this.x - other.x, this.y - other.y, this.z - other.z);
  }

  conjugate(): Quaternion {
    return new Quaternion(this.w, -this.x, -this.y, -this.z);
  }

  multiply(q: Quaternion): Quaternion {
    return new Quaternion(
      this.w * q.w - this.x * q.x - this.y * q.y - this.z * q.z,
      this.w * q.x + this.x * q.w + this.y * q.z - this.z * q.y,
      this.w * q.y - this.x * q.z + this.y * q.w + this.z * q.x,
      this.w * q.z + this.x * q.y - this.y * q.x + this.z * q.w
    );
  }
}