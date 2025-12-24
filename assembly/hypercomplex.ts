/**
 * Generic Cayley-Dickson Hypercomplex Algebra
 * 
 * Port from tinyaleph/core/hypercomplex.js to AssemblyScript
 * 
 * Supports any dimension that is a power of 2:
 * - Dimension 2:  Complex numbers
 * - Dimension 4:  Quaternions (non-commutative)
 * - Dimension 8:  Octonions (non-associative)
 * - Dimension 16: Sedenions (has zero divisors)
 * - Dimension 32: Pathions
 * - And beyond...
 */

import { multiplyIndices, MultiplicationResult } from './fano';
import { Serializable } from './core/interfaces';
import { JSONBuilder } from './core/serialization';
import { toFixed } from './utils';

/**
 * Generic Hypercomplex number of dimension 2^n
 * Uses Float64Array for efficient storage of components
 */
export class Hypercomplex implements Serializable {
  /** Dimension of the hypercomplex space (must be power of 2) */
  readonly dim: i32;
  
  /** Components array */
  c: Float64Array;
  
  /**
   * Construct a hypercomplex number
   * @param dim Dimension (must be power of 2)
   * @param components Optional initial components
   */
  constructor(dim: i32, components: Float64Array | null = null) {
    // Validate dimension is power of 2
    if (!isPowerOfTwo(dim)) {
      throw new Error("Dimension must be power of 2");
    }
    
    this.dim = dim;
    
    if (components !== null) {
      this.c = components;
    } else {
      this.c = new Float64Array(dim);
    }
  }
  
  // ============================================================================
  // Factory Methods
  // ============================================================================
  
  /**
   * Create a zero hypercomplex number
   */
  static zero(dim: i32): Hypercomplex {
    return new Hypercomplex(dim);
  }
  
  /**
   * Create a hypercomplex number with a single basis element
   * @param dim Dimension
   * @param index Basis index
   * @param value Value at that basis (default 1)
   */
  static basis(dim: i32, index: i32, value: f64 = 1.0): Hypercomplex {
    const h = new Hypercomplex(dim);
    h.c[index] = value;
    return h;
  }
  
  /**
   * Create a hypercomplex number from a real number
   */
  static fromReal(dim: i32, real: f64): Hypercomplex {
    const h = new Hypercomplex(dim);
    h.c[0] = real;
    return h;
  }
  
  /**
   * Create a hypercomplex number from a Float64Array
   */
  static fromArray(arr: Float64Array): Hypercomplex {
    const dim = arr.length;
    if (!isPowerOfTwo(dim)) {
      throw new Error("Array length must be power of 2");
    }
    return new Hypercomplex(dim, arr);
  }
  
  /**
   * Create a hypercomplex number from a regular array
   */
  static fromNumberArray(arr: Array<f64>): Hypercomplex {
    const dim = arr.length;
    if (!isPowerOfTwo(dim)) {
      throw new Error("Array length must be power of 2");
    }
    const h = new Hypercomplex(dim);
    for (let i = 0; i < dim; i++) {
      h.c[i] = arr[i];
    }
    return h;
  }
  
  // ============================================================================
  // Arithmetic Operations
  // ============================================================================
  
  /**
   * Add two hypercomplex numbers
   */
  add(other: Hypercomplex): Hypercomplex {
    const result = new Hypercomplex(this.dim);
    for (let i = 0; i < this.dim; i++) {
      result.c[i] = this.c[i] + other.c[i];
    }
    return result;
  }
  
  /**
   * Subtract two hypercomplex numbers
   */
  sub(other: Hypercomplex): Hypercomplex {
    const result = new Hypercomplex(this.dim);
    for (let i = 0; i < this.dim; i++) {
      result.c[i] = this.c[i] - other.c[i];
    }
    return result;
  }
  
  /**
   * Scale by a real number
   */
  scale(k: f64): Hypercomplex {
    const result = new Hypercomplex(this.dim);
    for (let i = 0; i < this.dim; i++) {
      result.c[i] = this.c[i] * k;
    }
    return result;
  }
  
  /**
   * Cayley-Dickson multiplication
   * Uses the Fano plane table lookup for efficient computation
   */
  mul(other: Hypercomplex): Hypercomplex {
    const result = new Hypercomplex(this.dim);
    
    for (let i = 0; i < this.dim; i++) {
      for (let j = 0; j < this.dim; j++) {
        const mr = multiplyIndices(this.dim, i, j);
        result.c[mr.index] += <f64>mr.sign * this.c[i] * other.c[j];
      }
    }
    
    return result;
  }
  
  /**
   * Conjugate: negate all imaginary components
   */
  conjugate(): Hypercomplex {
    const result = new Hypercomplex(this.dim);
    result.c[0] = this.c[0];  // Real part stays the same
    for (let i = 1; i < this.dim; i++) {
      result.c[i] = -this.c[i];
    }
    return result;
  }
  
  /**
   * Inverse: h^(-1) = conjugate(h) / |h|²
   */
  inverse(): Hypercomplex {
    const n2 = this.dot(this);
    if (n2 < 1e-10) return Hypercomplex.zero(this.dim);
    return this.conjugate().scale(1.0 / n2);
  }
  
  /**
   * Division: a / b = a * b^(-1)
   */
  div(other: Hypercomplex): Hypercomplex {
    return this.mul(other.inverse());
  }
  
  // ============================================================================
  // Metrics and Properties
  // ============================================================================
  
  /**
   * Euclidean norm (magnitude)
   */
  norm(): f64 {
    return Math.sqrt(this.dot(this));
  }
  
  /**
   * Alias for norm
   */
  magnitude(): f64 {
    return this.norm();
  }
  
  /**
   * Squared norm (more efficient when sqrt not needed)
   */
  normSquared(): f64 {
    return this.dot(this);
  }
  
  /**
   * Alias for normSquared
   */
  magnitudeSquared(): f64 {
    return this.normSquared();
  }
  
  /**
   * Normalize to unit length
   */
  normalize(): Hypercomplex {
    const n = this.norm();
    return n > 1e-10 ? this.scale(1.0 / n) : Hypercomplex.zero(this.dim);
  }
  
  /**
   * Dot product (as real vectors)
   */
  dot(other: Hypercomplex): f64 {
    let sum: f64 = 0;
    for (let i = 0; i < this.dim; i++) {
      sum += this.c[i] * other.c[i];
    }
    return sum;
  }
  
  /**
   * Shannon entropy of the probability distribution defined by |c_i|²/|h|²
   */
  entropy(): f64 {
    const n2 = this.normSquared();
    if (n2 < 1e-10) return 0;
    
    let h: f64 = 0;
    for (let i = 0; i < this.dim; i++) {
      const p = (this.c[i] * this.c[i]) / n2;
      if (p > 1e-10) {
        h -= p * Math.log2(p);
      }
    }
    return h;
  }
  
  /**
   * Coherence with another hypercomplex number
   * Returns |⟨h1|h2⟩| / (|h1| × |h2|)
   */
  coherence(other: Hypercomplex): f64 {
    const n1 = this.norm();
    const n2 = other.norm();
    if (n1 < 1e-10 || n2 < 1e-10) return 0;
    return Math.abs(this.dot(other)) / (n1 * n2);
  }
  
  /**
   * Check if this and another hypercomplex form zero divisors
   * (For dim >= 16, zero divisors can exist)
   */
  isZeroDivisorWith(other: Hypercomplex): bool {
    const prod = this.mul(other);
    return this.norm() > 0.1 && other.norm() > 0.1 && prod.norm() < 0.01;
  }
  
  // ============================================================================
  // Component Access
  // ============================================================================
  
  /**
   * Get component by index
   */
  get(index: i32): f64 {
    return this.c[index];
  }
  
  /**
   * Set component by index
   */
  set(index: i32, value: f64): void {
    this.c[index] = value;
  }
  
  /**
   * Get dominant axes (indices with largest absolute values)
   */
  dominantAxes(n: i32 = 3): Array<DominantAxis> {
    const axes = new Array<DominantAxis>(this.dim);
    
    for (let i = 0; i < this.dim; i++) {
      axes[i] = new DominantAxis(i, Math.abs(this.c[i]));
    }
    
    // Sort by descending value
    axes.sort((a: DominantAxis, b: DominantAxis): i32 => {
      if (b.value > a.value) return 1;
      if (b.value < a.value) return -1;
      return 0;
    });
    
    // Return top n
    const result = new Array<DominantAxis>(n);
    for (let i = 0; i < n && i < this.dim; i++) {
      result[i] = axes[i];
    }
    return result;
  }
  
  // ============================================================================
  // Serialization
  // ============================================================================
  
  /**
   * Convert to regular array
   */
  toArray(): Array<f64> {
    const arr = new Array<f64>(this.dim);
    for (let i = 0; i < this.dim; i++) {
      arr[i] = this.c[i];
    }
    return arr;
  }
  
  /**
   * Clone this hypercomplex number
   */
  clone(): Hypercomplex {
    const components = new Float64Array(this.dim);
    for (let i = 0; i < this.dim; i++) {
      components[i] = this.c[i];
    }
    return new Hypercomplex(this.dim, components);
  }
  
  /**
   * JSON representation
   */
  toJSON(): string {
    const builder = new JSONBuilder();
    builder.startObject()
      .addNumberField("dim", <f64>this.dim);
    
    // Build components array
    let componentsJson = "[";
    for (let i = 0; i < this.dim; i++) {
      if (i > 0) componentsJson += ",";
      componentsJson += toFixed(this.c[i], 6);
    }
    componentsJson += "]";
    
    builder.addRawField("components", componentsJson)
      .addNumberField("norm", this.norm())
      .addNumberField("entropy", this.entropy())
      .endObject();
    
    return builder.build();
  }
  
  /**
   * String representation
   */
  toString(): string {
    let str = "Hypercomplex(" + this.dim.toString() + ")[";
    for (let i = 0; i < this.dim; i++) {
      if (i > 0) str += ", ";
      str += toFixed(this.c[i], 4);
    }
    str += "]";
    return str;
  }
}

/**
 * Helper class for dominant axis tracking
 */
export class DominantAxis {
  index: i32;
  value: f64;
  
  constructor(index: i32, value: f64) {
    this.index = index;
    this.value = value;
  }
}

/**
 * Check if a number is a power of 2
 */
function isPowerOfTwo(n: i32): bool {
  return n > 0 && (n & (n - 1)) == 0;
}

// ============================================================================
// Convenience Factories for Common Dimensions
// ============================================================================

/**
 * Create a complex number (dim=2)
 */
export function complex(real: f64, imag: f64): Hypercomplex {
  const h = new Hypercomplex(2);
  h.c[0] = real;
  h.c[1] = imag;
  return h;
}

/**
 * Create a quaternion (dim=4)
 */
export function quaternion(w: f64, x: f64, y: f64, z: f64): Hypercomplex {
  const h = new Hypercomplex(4);
  h.c[0] = w;
  h.c[1] = x;
  h.c[2] = y;
  h.c[3] = z;
  return h;
}

/**
 * Create an octonion (dim=8)
 */
export function octonion(
  c0: f64, c1: f64, c2: f64, c3: f64,
  c4: f64, c5: f64, c6: f64, c7: f64
): Hypercomplex {
  const h = new Hypercomplex(8);
  h.c[0] = c0; h.c[1] = c1; h.c[2] = c2; h.c[3] = c3;
  h.c[4] = c4; h.c[5] = c5; h.c[6] = c6; h.c[7] = c7;
  return h;
}

/**
 * Get the dimension name
 */
export function getDimensionName(dim: i32): string {
  switch (dim) {
    case 1: return "Real";
    case 2: return "Complex";
    case 4: return "Quaternion";
    case 8: return "Octonion";
    case 16: return "Sedenion";
    case 32: return "Pathion";
    case 64: return "Chingon";
    case 128: return "Routon";
    case 256: return "Voudon";
    default: return `Hypercomplex(${dim})`;
  }
}