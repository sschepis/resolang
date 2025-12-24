// visualization/holographic-field.ts
// Implements the holographic memory field visualization

import { Complex, Prime } from "../types";
import { Quaternion } from "../quaternion";
import { 
  Coordinate2D, 
  Coordinate3D, 
  HolographicPoint,
  RenderContext,
  AnimationState
} from "./types";

/**
 * Represents a holographic memory field that visualizes
 * quantum information distribution in 3D space
 */
export class HolographicField {
  points: Array<HolographicPoint>;
  resolution: i32;
  bounds: Coordinate3D;
  interferencePattern: Map<string, Complex>;
  animationStates: Map<string, AnimationState>;
  
  constructor(resolution: i32 = 20, bounds: Coordinate3D = new Coordinate3D(100, 100, 100)) {
    this.points = new Array<HolographicPoint>();
    this.resolution = resolution;
    this.bounds = bounds;
    this.interferencePattern = new Map<string, Complex>();
    this.animationStates = new Map<string, AnimationState>();
    
    this.initializeField();
  }
  
  /**
   * Initialize the holographic field with a grid of points
   */
  private initializeField(): void {
    const stepX = this.bounds.x / this.resolution;
    const stepY = this.bounds.y / this.resolution;
    const stepZ = this.bounds.z / this.resolution;
    
    for (let i = 0; i < this.resolution; i++) {
      for (let j = 0; j < this.resolution; j++) {
        for (let k = 0; k < this.resolution; k++) {
          const x = (i - this.resolution / 2) * stepX;
          const y = (j - this.resolution / 2) * stepY;
          const z = (k - this.resolution / 2) * stepZ;
          
          const position = new Coordinate3D(x, y, z);
          const amplitude = new Complex(0, 0);
          const phase = 0;
          const frequency = 1.0;
          
          this.points.push(
            new HolographicPoint(position, amplitude, phase, frequency)
          );
        }
      }
    }
  }
  
  /**
   * Add a quantum source to the field
   */
  addSource(position: Coordinate3D, amplitude: Complex, frequency: f64 = 1.0): void {
    // Find nearest grid point
    let nearestPoint: HolographicPoint | null = null;
    let minDistance = f64.MAX_VALUE;
    
    for (let i = 0; i < this.points.length; i++) {
      const point = this.points[i];
      const distance = point.position.distanceTo3D(position);
      if (distance < minDistance) {
        minDistance = distance;
        nearestPoint = point;
      }
    }
    
    if (nearestPoint) {
      nearestPoint.amplitude = amplitude;
      nearestPoint.frequency = frequency;
      this.propagateWave(nearestPoint);
    }
  }
  
  /**
   * Propagate wave from a source point through the field
   */
  private propagateWave(source: HolographicPoint): void {
    const waveSpeed = 1.0;
    const damping = 0.95;
    
    for (let i = 0; i < this.points.length; i++) {
      const point = this.points[i];
      if (point === source) continue;
      
      const distance = source.position.distanceTo3D(point.position);
      const phase = 2 * Math.PI * distance * source.frequency / waveSpeed;
      const amplitude = source.amplitude.multiply(
        Complex.fromPolar(damping ** distance, -phase)
      );
      
      // Superposition principle
      point.amplitude = point.amplitude.add(amplitude);
      point.phase = Math.atan2(point.amplitude.imag, point.amplitude.real);
    }
  }
  
  /**
   * Calculate interference pattern between multiple sources
   */
  calculateInterference(): void {
    this.interferencePattern.clear();
    
    // Sample interference at key points
    const sampleResolution = 10;
    const stepX = this.bounds.x / sampleResolution;
    const stepY = this.bounds.y / sampleResolution;
    
    for (let i = 0; i < sampleResolution; i++) {
      for (let j = 0; j < sampleResolution; j++) {
        const x = (i - sampleResolution / 2) * stepX;
        const y = (j - sampleResolution / 2) * stepY;
        const z = 0; // Sample at z=0 plane
        
        const samplePoint = new Coordinate3D(x, y, z);
        let totalAmplitude = new Complex(0, 0);
        
        // Sum contributions from all points
        for (let k = 0; k < this.points.length; k++) {
          const point = this.points[k];
          const distance = point.position.distanceTo3D(samplePoint);
          const phase = 2 * Math.PI * distance * point.frequency;
          
          const contribution = point.amplitude.multiply(
            Complex.fromPolar(1.0 / (1.0 + distance), -phase)
          );
          
          totalAmplitude = totalAmplitude.add(contribution);
        }
        
        const key = `${i},${j}`;
        this.interferencePattern.set(key, totalAmplitude);
      }
    }
  }
  
  /**
   * Apply quantum operation to the field
   */
  applyQuantumOperation(operation: string, params: Map<string, f64>): void {
    switch (operation) {
      case "collapse":
        this.collapseWaveFunction(params.get("position_x")!, 
                                 params.get("position_y")!, 
                                 params.get("position_z")!);
        break;
      case "entangle":
        this.createEntanglement(params.get("source_x")!,
                               params.get("source_y")!,
                               params.get("source_z")!,
                               params.get("target_x")!,
                               params.get("target_y")!,
                               params.get("target_z")!);
        break;
      case "rotate":
        this.rotateField(params.get("angle")!, 
                        params.get("axis_x")!,
                        params.get("axis_y")!,
                        params.get("axis_z")!);
        break;
    }
  }
  
  /**
   * Collapse wave function at a specific position
   */
  private collapseWaveFunction(x: f64, y: f64, z: f64): void {
    const collapsePoint = new Coordinate3D(x, y, z);
    const collapseRadius = 20.0;
    
    for (let i = 0; i < this.points.length; i++) {
      const point = this.points[i];
      const distance = point.position.distanceTo3D(collapsePoint);
      
      if (distance < collapseRadius) {
        // Gaussian collapse
        const factor = Math.exp(-(distance * distance) / (2 * collapseRadius * collapseRadius));
        point.amplitude = point.amplitude.multiply(new Complex(factor, 0));
        
        // Add animation
        const animKey = `collapse_${i}`;
        this.animationStates.set(animKey, new AnimationState(
          point.amplitude.magnitude(),
          point.amplitude.magnitude() * factor,
          1000, // 1 second duration
          AnimationState.easeOutElastic
        ));
      }
    }
  }
  
  /**
   * Create quantum entanglement between two regions
   */
  private createEntanglement(x1: f64, y1: f64, z1: f64, 
                            x2: f64, y2: f64, z2: f64): void {
    const source = new Coordinate3D(x1, y1, z1);
    const target = new Coordinate3D(x2, y2, z2);
    const entangleRadius = 15.0;
    
    let sourcePoints: Array<HolographicPoint> = [];
    let targetPoints: Array<HolographicPoint> = [];
    
    // Find points in source and target regions
    for (let i = 0; i < this.points.length; i++) {
      const point = this.points[i];
      
      if (point.position.distanceTo3D(source) < entangleRadius) {
        sourcePoints.push(point);
      }
      if (point.position.distanceTo3D(target) < entangleRadius) {
        targetPoints.push(point);
      }
    }
    
    // Create entanglement by correlating phases
    for (let i = 0; i < sourcePoints.length && i < targetPoints.length; i++) {
      const sourcePoint = sourcePoints[i];
      const targetPoint = targetPoints[i];
      
      // Entangle phases
      const avgPhase = (sourcePoint.phase + targetPoint.phase) / 2;
      sourcePoint.phase = avgPhase;
      targetPoint.phase = avgPhase;
      
      // Create visual connection
      const midpoint = sourcePoint.position.lerp(targetPoint.position, 0.5);
      const entangleAmplitude = sourcePoint.amplitude.add(targetPoint.amplitude).multiply(
        new Complex(0.5, 0)
      );
      
      this.addSource(midpoint, entangleAmplitude, 2.0); // Higher frequency for entanglement
    }
  }
  
  /**
   * Rotate the entire field using quaternion rotation
   */
  private rotateField(angle: f64, axisX: f64, axisY: f64, axisZ: f64): void {
    const axis = new Quaternion(0, axisX, axisY, axisZ).normalize();
    const halfAngle = angle / 2.0;
    const rotation = new Quaternion(
      Math.cos(halfAngle),
      Math.sin(halfAngle) * axis.x,
      Math.sin(halfAngle) * axis.y,
      Math.sin(halfAngle) * axis.z
    );
    
    for (let i = 0; i < this.points.length; i++) {
      const point = this.points[i];
      const rotated = point.position.rotate(rotation);
      point.position = rotated;
      
      // Also rotate the quaternion if present
      if (point.quaternion) {
        point.quaternion = rotation.multiply(point.quaternion);
      }
    }
  }
  
  /**
   * Update animations
   */
  updateAnimations(deltaTime: f64): void {
    const keys = this.animationStates.keys();
    const toRemove: Array<string> = [];
    
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const animation = this.animationStates.get(key);
      
      if (animation) {
        animation.update(deltaTime);
        
        if (animation.isComplete) {
          toRemove.push(key);
        }
      }
    }
    
    // Remove completed animations
    for (let i = 0; i < toRemove.length; i++) {
      this.animationStates.delete(toRemove[i]);
    }
  }
  
  /**
   * Get visible points for rendering (with frustum culling)
   */
  getVisiblePoints(context: RenderContext): Array<HolographicPoint> {
    const visible: Array<HolographicPoint> = [];
    const threshold = 0.01; // Minimum amplitude to render
    
    for (let i = 0; i < this.points.length; i++) {
      const point = this.points[i];
      
      // Skip points with negligible amplitude
      if (point.intensity() < threshold) continue;
      
      // Simple frustum culling
      const screenPos = context.worldToScreen(point.position);
      if (screenPos.x >= -50 && screenPos.x <= context.width + 50 &&
          screenPos.y >= -50 && screenPos.y <= context.height + 50) {
        visible.push(point);
      }
    }
    
    return visible;
  }
  
  /**
   * Clear the field
   */
  clear(): void {
    for (let i = 0; i < this.points.length; i++) {
      const point = this.points[i];
      point.amplitude = new Complex(0, 0);
      point.phase = 0;
    }
    this.interferencePattern.clear();
    this.animationStates.clear();
  }
}

/**
 * Holographic field renderer for visualization
 */
export class HolographicFieldRenderer {
  field: HolographicField;
  colorMap: (intensity: f64, phase: f64) => string;
  
  constructor(field: HolographicField) {
    this.field = field;
    this.colorMap = HolographicFieldRenderer.defaultColorMap;
  }
  
  /**
   * Default color mapping function
   */
  static defaultColorMap(intensity: f64, phase: f64): string {
    // Map phase to hue (0-360)
    const hue = (phase / (2 * Math.PI)) * 360;
    // Map intensity to lightness (20-80%)
    const lightness = 20 + intensity * 60;
    // Full saturation for vivid colors
    const saturation = 100;
    
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  }
  
  /**
   * Render the field to a 2D context (returns render data)
   */
  render(context: RenderContext): Array<RenderData> {
    const renderData: Array<RenderData> = [];
    const visiblePoints = this.field.getVisiblePoints(context);
    
    // Sort by z-depth for proper rendering order
    visiblePoints.sort((a: HolographicPoint, b: HolographicPoint): i32 => {
      return (b.position.z - a.position.z) > 0 ? 1 : -1;
    });
    
    for (let i = 0; i < visiblePoints.length; i++) {
      const point = visiblePoints[i];
      const screenPos = context.worldToScreen(point.position);
      const intensity = point.intensity();
      const color = this.colorMap(intensity, point.phase);
      
      // Size based on intensity and perspective
      const baseSize = 5.0;
      const perspectiveFactor = context.perspective / (context.perspective + point.position.z);
      const size = baseSize * intensity * perspectiveFactor;
      
      renderData.push(new RenderData(
        screenPos,
        size,
        color,
        intensity,
        point.phase
      ));
    }
    
    return renderData;
  }
  
  /**
   * Render interference pattern overlay
   */
  renderInterferencePattern(context: RenderContext): Array<RenderData> {
    const renderData: Array<RenderData> = [];
    const pattern = this.field.interferencePattern;
    const keys = pattern.keys();
    
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const parts = key.split(',');
      const gridX = parseInt(parts[0]);
      const gridY = parseInt(parts[1]);
      
      const amplitude = pattern.get(key)!;
      const intensity = amplitude.magnitude();
      const phase = Math.atan2(amplitude.imag, amplitude.real);
      
      // Convert grid position to world coordinates
      const worldX = (gridX - 5) * this.field.bounds.x / 10;
      const worldY = (gridY - 5) * this.field.bounds.y / 10;
      const worldPos = new Coordinate3D(worldX, worldY, 0);
      
      const screenPos = context.worldToScreen(worldPos);
      const color = this.colorMap(intensity, phase);
      
      renderData.push(new RenderData(
        screenPos,
        10.0, // Fixed size for pattern
        color,
        intensity,
        phase
      ));
    }
    
    return renderData;
  }
}

/**
 * Render data structure for visualization
 */
export class RenderData {
  position: Coordinate2D;
  size: f64;
  color: string;
  intensity: f64;
  phase: f64;
  
  constructor(
    position: Coordinate2D,
    size: f64,
    color: string,
    intensity: f64,
    phase: f64
  ) {
    this.position = position;
    this.size = size;
    this.color = color;
    this.intensity = intensity;
    this.phase = phase;
  }
}