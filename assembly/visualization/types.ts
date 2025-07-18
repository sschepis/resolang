// visualization/types.ts
// Core types for the PRN visualization system

import { Complex, Prime } from "../types";
import { PrimeResonanceIdentity } from "../prn-node";
import { Quaternion } from "../quaternion";

/**
 * Represents a 2D coordinate in the visualization space
 */
export class Coordinate2D {
  x: f64;
  y: f64;

  constructor(x: f64 = 0, y: f64 = 0) {
    this.x = x;
    this.y = y;
  }

  /**
   * Calculate distance to another coordinate
   */
  distanceTo(other: Coordinate2D): f64 {
    const dx = this.x - other.x;
    const dy = this.y - other.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  /**
   * Linear interpolation to another coordinate
   */
  lerp(other: Coordinate2D, t: f64): Coordinate2D {
    return new Coordinate2D(
      this.x + (other.x - this.x) * t,
      this.y + (other.y - this.y) * t
    );
  }

  /**
   * Convert to array for serialization
   */
  toArray(): Float64Array {
    const arr = new Float64Array(2);
    arr[0] = this.x;
    arr[1] = this.y;
    return arr;
  }
}

/**
 * Represents a 3D coordinate in the visualization space
 */
export class Coordinate3D extends Coordinate2D {
  z: f64;

  constructor(x: f64 = 0, y: f64 = 0, z: f64 = 0) {
    super(x, y);
    this.z = z;
  }

  /**
   * Calculate 3D distance to another coordinate
   */
  distanceTo3D(other: Coordinate3D): f64 {
    const dx = this.x - other.x;
    const dy = this.y - other.y;
    const dz = this.z - other.z;
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  }

  /**
   * Apply quaternion rotation
   */
  rotate(q: Quaternion): Coordinate3D {
    // Convert point to quaternion (0, x, y, z)
    const point = new Quaternion(0, this.x, this.y, this.z);
    // Apply rotation: q * point * q^*
    const rotated = q.multiply(point).multiply(q.conjugate());
    return new Coordinate3D(rotated.x, rotated.y, rotated.z);
  }

  /**
   * Project to 2D using perspective projection
   */
  projectTo2D(focalLength: f64 = 1.0): Coordinate2D {
    const scale = focalLength / (focalLength + this.z);
    return new Coordinate2D(this.x * scale, this.y * scale);
  }

  /**
   * Linear interpolation to another 3D coordinate
   */
  lerp(other: Coordinate3D, t: f64): Coordinate3D {
    return new Coordinate3D(
      this.x + (other.x - this.x) * t,
      this.y + (other.y - this.y) * t,
      this.z + (other.z - this.z) * t
    );
  }

  /**
   * Convert to array for serialization
   */
  toArray3D(): Float64Array {
    const arr = new Float64Array(3);
    arr[0] = this.x;
    arr[1] = this.y;
    arr[2] = this.z;
    return arr;
  }
}

/**
 * Represents a holographic point in the field
 */
export class HolographicPoint {
  position: Coordinate3D;
  amplitude: Complex;
  phase: f64;
  frequency: f64;
  quaternion: Quaternion | null;

  constructor(
    position: Coordinate3D,
    amplitude: Complex,
    phase: f64 = 0,
    frequency: f64 = 1.0,
    quaternion: Quaternion | null = null
  ) {
    this.position = position;
    this.amplitude = amplitude;
    this.phase = phase;
    this.frequency = frequency;
    this.quaternion = quaternion;
  }

  /**
   * Calculate intensity at this point
   */
  intensity(): f64 {
    return this.amplitude.magnitude();
  }

  /**
   * Apply phase shift
   */
  shiftPhase(delta: f64): void {
    this.phase += delta;
    // Normalize to [0, 2π]
    while (this.phase >= 2 * Math.PI) this.phase -= 2 * Math.PI;
    while (this.phase < 0) this.phase += 2 * Math.PI;
  }

  /**
   * Calculate interference with another point
   */
  interferenceWith(other: HolographicPoint): Complex {
    const distance = this.position.distanceTo3D(other.position);
    const phaseDiff = this.phase - other.phase + 
                     2 * Math.PI * distance * (this.frequency - other.frequency);
    
    const interference = this.amplitude.multiply(
      Complex.fromPolar(1.0, phaseDiff)
    ).add(other.amplitude);
    
    return interference;
  }
}

/**
 * Visualization state for a network node
 */
export class NodeVisualizationState {
  nodeId: string;
  position: Coordinate3D;
  pri: PrimeResonanceIdentity;
  color: string;
  size: f64;
  isActive: boolean;
  isHovered: boolean;
  entanglementStrength: f64;
  holographicField: Array<HolographicPoint>;

  constructor(
    nodeId: string,
    position: Coordinate3D,
    pri: PrimeResonanceIdentity
  ) {
    this.nodeId = nodeId;
    this.position = position;
    this.pri = pri;
    this.color = this.calculateColor();
    this.size = 20.0;
    this.isActive = false;
    this.isHovered = false;
    this.entanglementStrength = 0.0;
    this.holographicField = new Array<HolographicPoint>();
  }

  /**
   * Calculate node color based on PRI
   */
  private calculateColor(): string {
    // Use prime values to generate unique colors
    const r = (this.pri.gaussianPrime % 256) as i32;
    const g = (this.pri.eisensteinPrime % 256) as i32;
    const b = (this.pri.quaternionicPrime % 256) as i32;
    
    return `rgb(${r}, ${g}, ${b})`;
  }

  /**
   * Update holographic field around the node
   */
  updateHolographicField(resolution: i32 = 10): void {
    this.holographicField = new Array<HolographicPoint>();
    
    const radius = this.size * 2;
    const step = radius / resolution;
    
    for (let i = 0; i < resolution; i++) {
      for (let j = 0; j < resolution; j++) {
        const theta = (i / resolution as f64) * 2 * Math.PI;
        const phi = (j / resolution as f64) * Math.PI;
        
        const x = this.position.x + radius * Math.sin(phi) * Math.cos(theta);
        const y = this.position.y + radius * Math.sin(phi) * Math.sin(theta);
        const z = this.position.z + radius * Math.cos(phi);
        
        const pos = new Coordinate3D(x, y, z);
        const amplitude = Complex.fromPolar(
          this.entanglementStrength,
          theta + phi
        );
        
        this.holographicField.push(
          new HolographicPoint(pos, amplitude, theta, 1.0)
        );
      }
    }
  }
}

/**
 * Represents a memory fragment in the visualization
 */
export class MemoryFragmentVisualization {
  id: string;
  content: string;
  position: Coordinate3D;
  holographicData: Map<Prime, Complex>;
  isTeleported: boolean;
  isNonLocal: boolean;
  quaternionicEncoding: Quaternion | null;
  opacity: f64;
  scale: f64;

  constructor(
    id: string,
    content: string,
    position: Coordinate3D,
    holographicData: Map<Prime, Complex>
  ) {
    this.id = id;
    this.content = content;
    this.position = position;
    this.holographicData = holographicData;
    this.isTeleported = false;
    this.isNonLocal = false;
    this.quaternionicEncoding = null;
    this.opacity = 1.0;
    this.scale = 1.0;
  }

  /**
   * Calculate the center of mass for the holographic pattern
   */
  calculateCenterOfMass(): Coordinate2D {
    let totalWeight = 0.0;
    let centerX = 0.0;
    let centerY = 0.0;
    
    const keys = this.holographicData.keys();
    for (let i = 0; i < keys.length; i++) {
      const prime = keys[i];
      const amplitude = this.holographicData.get(prime);
      if (amplitude) {
        const weight = amplitude.magnitude();
        // Use prime value to determine position in pattern
        const angle = (prime as f64) * 0.1;
        centerX += Math.cos(angle) * weight;
        centerY += Math.sin(angle) * weight;
        totalWeight += weight;
      }
    }
    
    if (totalWeight > 0) {
      centerX /= totalWeight;
      centerY /= totalWeight;
    }
    
    return new Coordinate2D(centerX, centerY);
  }

  /**
   * Apply quantum operation visual effect
   */
  applyQuantumEffect(effectType: string, duration: f64): void {
    switch (effectType) {
      case "teleport":
        this.isTeleported = true;
        this.opacity = 0.5;
        break;
      case "entangle":
        this.isNonLocal = true;
        this.scale = 1.2;
        break;
      case "collapse":
        this.opacity = 0.8;
        this.scale = 0.9;
        break;
    }
  }
}

/**
 * Animation state for smooth transitions
 */
export class AnimationState {
  startValue: f64;
  endValue: f64;
  currentValue: f64;
  duration: f64;
  elapsed: f64;
  easing: (t: f64) => f64;
  isComplete: boolean;

  constructor(
    startValue: f64,
    endValue: f64,
    duration: f64,
    easing: (t: f64) => f64 = AnimationState.easeInOutCubic
  ) {
    this.startValue = startValue;
    this.endValue = endValue;
    this.currentValue = startValue;
    this.duration = duration;
    this.elapsed = 0;
    this.easing = easing;
    this.isComplete = false;
  }

  /**
   * Update animation state
   */
  update(deltaTime: f64): void {
    if (this.isComplete) return;
    
    this.elapsed += deltaTime;
    const t = Math.min(this.elapsed / this.duration, 1.0);
    const easedT = this.easing(t);
    
    this.currentValue = this.startValue + 
                       (this.endValue - this.startValue) * easedT;
    
    if (t >= 1.0) {
      this.isComplete = true;
      this.currentValue = this.endValue;
    }
  }

  /**
   * Common easing functions
   */
  static linear(t: f64): f64 {
    return t;
  }

  static easeInOutCubic(t: f64): f64 {
    return t < 0.5 
      ? 4 * t * t * t 
      : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  static easeOutElastic(t: f64): f64 {
    const c4 = (2 * Math.PI) / 3;
    return t === 0 ? 0 : t === 1 ? 1 :
      Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
  }
}

/**
 * Render context for visualization
 */
export class RenderContext {
  width: f64;
  height: f64;
  scale: f64;
  offset: Coordinate2D;
  rotation: Quaternion;
  perspective: f64;
  time: f64;

  constructor(width: f64, height: f64) {
    this.width = width;
    this.height = height;
    this.scale = 1.0;
    this.offset = new Coordinate2D(width / 2, height / 2);
    this.rotation = new Quaternion(1, 0, 0, 0); // Identity quaternion
    this.perspective = 1000.0;
    this.time = 0.0;
  }

  /**
   * Transform world coordinates to screen coordinates
   */
  worldToScreen(world: Coordinate3D): Coordinate2D {
    // Apply rotation
    const rotated = world.rotate(this.rotation);
    
    // Apply perspective projection
    const projected = rotated.projectTo2D(this.perspective);
    
    // Apply scale and offset
    return new Coordinate2D(
      projected.x * this.scale + this.offset.x,
      projected.y * this.scale + this.offset.y
    );
  }

  /**
   * Transform screen coordinates to world coordinates (2D only)
   */
  screenToWorld2D(screen: Coordinate2D): Coordinate2D {
    return new Coordinate2D(
      (screen.x - this.offset.x) / this.scale,
      (screen.y - this.offset.y) / this.scale
    );
  }

  /**
   * Update time for animations
   */
  updateTime(deltaTime: f64): void {
    this.time += deltaTime;
  }
}