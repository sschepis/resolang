// visualization/memory-fragments.ts
// Implements memory fragment visualization and management

import { Complex, Prime } from "../types";
import { Quaternion } from "../quaternion";
import {
  Coordinate2D,
  Coordinate3D,
  MemoryFragmentVisualization,
  AnimationState,
  RenderContext
} from "./types";
import { NetworkNodeVisual } from "./network-node";
import { TeleportationOperation } from "./quantum-operations";

/**
 * Memory fragment states
 */
export enum FragmentState {
  IDLE = "idle",
  ACTIVE = "active",
  TELEPORTING = "teleporting",
  ENTANGLED = "entangled",
  COLLAPSED = "collapsed"
}

/**
 * Extended memory fragment with full visualization capabilities
 */
export class MemoryFragment extends MemoryFragmentVisualization {
  state: FragmentState;
  attachedNodeId: string | null;
  velocity: Coordinate3D;
  rotationQuaternion: Quaternion;
  rotationSpeed: f64;
  glowIntensity: f64;
  trailPositions: Array<Coordinate3D>;
  maxTrailLength: i32;
  
  constructor(
    id: string,
    content: string,
    position: Coordinate3D,
    holographicData: Map<Prime, Complex>
  ) {
    super(id, content, position, holographicData);
    this.state = FragmentState.IDLE;
    this.attachedNodeId = null;
    this.velocity = new Coordinate3D(0, 0, 0);
    this.rotationQuaternion = new Quaternion(1, 0, 0, 0);
    this.rotationSpeed = 0.5;
    this.glowIntensity = 0.5;
    this.trailPositions = [];
    this.maxTrailLength = 20;
  }
  
  /**
   * Attach fragment to a node
   */
  attachToNode(nodeId: string, node: NetworkNodeVisual): void {
    this.attachedNodeId = nodeId;
    this.state = FragmentState.ACTIVE;
    
    // Orbit around node
    const orbitRadius = node.state.size * 2;
    const angle = Math.random() * 2 * Math.PI;
    const offsetX = Math.cos(angle) * orbitRadius;
    const offsetY = Math.sin(angle) * orbitRadius;
    
    this.position = new Coordinate3D(
      node.state.position.x + offsetX,
      node.state.position.y + offsetY,
      node.state.position.z
    );
  }
  
  /**
   * Detach from node
   */
  detach(): void {
    this.attachedNodeId = null;
    this.state = FragmentState.IDLE;
    
    // Add some random velocity when detached
    this.velocity = new Coordinate3D(
      (Math.random() - 0.5) * 10,
      (Math.random() - 0.5) * 10,
      (Math.random() - 0.5) * 5
    );
  }
  
  /**
   * Update fragment physics and animation
   */
  update(deltaTime: f64, nodes: Map<string, NetworkNodeVisual>): void {
    // Store previous position for trail
    if (this.trailPositions.length >= this.maxTrailLength) {
      this.trailPositions.shift();
    }
    this.trailPositions.push(new Coordinate3D(
      this.position.x,
      this.position.y,
      this.position.z
    ));
    
    // Update based on state
    switch (this.state) {
      case FragmentState.IDLE:
        this.updateIdle(deltaTime);
        break;
      case FragmentState.ACTIVE:
        this.updateActive(deltaTime, nodes);
        break;
      case FragmentState.TELEPORTING:
        this.updateTeleporting(deltaTime);
        break;
      case FragmentState.ENTANGLED:
        this.updateEntangled(deltaTime);
        break;
      case FragmentState.COLLAPSED:
        this.updateCollapsed(deltaTime);
        break;
    }
    
    // Update rotation
    const angle = this.rotationSpeed * deltaTime * 0.001;
    const rotationDelta = new Quaternion(
      Math.cos(angle / 2),
      0,
      Math.sin(angle / 2),
      0
    );
    this.rotationQuaternion = this.rotationQuaternion.multiply(rotationDelta).normalize();
    
    // Update glow based on state
    const targetGlow = this.state === FragmentState.ACTIVE ? 1.0 : 0.5;
    this.glowIntensity += (targetGlow - this.glowIntensity) * 0.1;
  }
  
  /**
   * Update idle state
   */
  private updateIdle(deltaTime: f64): void {
    // Apply velocity with damping
    this.position.x += this.velocity.x * deltaTime * 0.001;
    this.position.y += this.velocity.y * deltaTime * 0.001;
    this.position.z += this.velocity.z * deltaTime * 0.001;
    
    // Damping
    this.velocity.x *= 0.98;
    this.velocity.y *= 0.98;
    this.velocity.z *= 0.98;
    
    // Gentle floating motion
    const time = deltaTime * 0.001;
    this.position.y += Math.sin(time) * 0.1;
  }
  
  /**
   * Update active state (attached to node)
   */
  private updateActive(deltaTime: f64, nodes: Map<string, NetworkNodeVisual>): void {
    if (!this.attachedNodeId) {
      this.state = FragmentState.IDLE;
      return;
    }
    
    const node = nodes.get(this.attachedNodeId);
    if (!node) {
      this.detach();
      return;
    }
    
    // Orbit around node
    const time = Date.now() * 0.001;
    const orbitRadius = node.state.size * 2;
    const orbitSpeed = 0.5 + this.glowIntensity * 0.5;
    const angle = time * orbitSpeed;
    
    const targetX = node.state.position.x + Math.cos(angle) * orbitRadius;
    const targetY = node.state.position.y + Math.sin(angle) * orbitRadius;
    const targetZ = node.state.position.z + Math.sin(angle * 0.5) * 10;
    
    // Smooth movement to target
    this.position.x += (targetX - this.position.x) * 0.1;
    this.position.y += (targetY - this.position.y) * 0.1;
    this.position.z += (targetZ - this.position.z) * 0.1;
    
    // Increase rotation speed when active
    this.rotationSpeed = 1.0 + node.state.entanglementStrength;
  }
  
  /**
   * Update teleporting state
   */
  private updateTeleporting(deltaTime: f64): void {
    // Handled by TeleportationOperation
    this.opacity = 0.5 + Math.sin(Date.now() * 0.01) * 0.3;
    this.scale = 0.8 + Math.sin(Date.now() * 0.02) * 0.2;
  }
  
  /**
   * Update entangled state
   */
  private updateEntangled(deltaTime: f64): void {
    // Quantum fluctuations
    this.position.x += (Math.random() - 0.5) * 0.5;
    this.position.y += (Math.random() - 0.5) * 0.5;
    this.position.z += (Math.random() - 0.5) * 0.5;
    
    // Pulsing glow
    this.glowIntensity = 0.7 + Math.sin(Date.now() * 0.005) * 0.3;
  }
  
  /**
   * Update collapsed state
   */
  private updateCollapsed(deltaTime: f64): void {
    this.opacity *= 0.95;
    this.scale *= 0.98;
    
    if (this.opacity < 0.01) {
      this.state = FragmentState.IDLE;
      this.opacity = 1.0;
      this.scale = 1.0;
    }
  }
  
  /**
   * Start teleportation
   */
  startTeleportation(): void {
    this.state = FragmentState.TELEPORTING;
    this.isTeleported = true;
  }
  
  /**
   * Complete teleportation
   */
  completeTeleportation(newPosition: Coordinate3D): void {
    this.position = newPosition;
    this.state = FragmentState.IDLE;
    this.isTeleported = false;
    
    // Flash effect
    this.glowIntensity = 2.0;
  }
  
  /**
   * Apply entanglement
   */
  applyEntanglement(partner: MemoryFragment): void {
    this.state = FragmentState.ENTANGLED;
    this.isNonLocal = true;
    
    // Synchronize some properties
    const avgGlow = (this.glowIntensity + partner.glowIntensity) / 2;
    this.glowIntensity = avgGlow;
    partner.glowIntensity = avgGlow;
  }
  
  /**
   * Collapse wave function
   */
  collapse(): void {
    this.state = FragmentState.COLLAPSED;
    this.applyQuantumEffect("collapse", 1000);
  }
  
  /**
   * Get render data
   */
  getRenderData(context: RenderContext): FragmentRenderData {
    const screenPos = context.worldToScreen(this.position);
    
    // Apply rotation to get oriented bounding box
    const size = 20 * this.scale;
    const corners = [
      new Coordinate3D(-size/2, -size/2, 0),
      new Coordinate3D(size/2, -size/2, 0),
      new Coordinate3D(size/2, size/2, 0),
      new Coordinate3D(-size/2, size/2, 0)
    ];
    
    const rotatedCorners: Array<Coordinate2D> = [];
    for (let i = 0; i < corners.length; i++) {
      const rotated = corners[i].rotate(this.rotationQuaternion);
      const projected = new Coordinate3D(
        this.position.x + rotated.x,
        this.position.y + rotated.y,
        this.position.z + rotated.z
      ).projectTo2D(context.perspective);
      rotatedCorners.push(projected);
    }
    
    // Trail data
    const trail: Array<Coordinate2D> = [];
    for (let i = 0; i < this.trailPositions.length; i++) {
      trail.push(context.worldToScreen(this.trailPositions[i]));
    }
    
    return new FragmentRenderData(
      this.id,
      screenPos,
      rotatedCorners,
      this.opacity,
      this.glowIntensity,
      this.state,
      trail,
      this.calculateHolographicPattern()
    );
  }
  
  /**
   * Calculate holographic interference pattern
   */
  private calculateHolographicPattern(): Array<HolographicPatternPoint> {
    const pattern: Array<HolographicPatternPoint> = [];
    const center = this.calculateCenterOfMass();
    
    // Sample points around the fragment
    const samples = 8;
    for (let i = 0; i < samples; i++) {
      const angle = (i / samples as f64) * 2 * Math.PI;
      const radius = 30;
      
      const x = center.x + Math.cos(angle) * radius;
      const y = center.y + Math.sin(angle) * radius;
      
      // Calculate interference at this point
      let totalAmplitude = new Complex(0, 0);
      const keys = this.holographicData.keys();
      
      for (let j = 0; j < keys.length; j++) {
        const prime = keys[j];
        const amplitude = this.holographicData.get(prime)!;
        const phase = (prime as f64) * 0.1 + angle;
        
        totalAmplitude = totalAmplitude.add(
          amplitude.multiply(Complex.fromPolar(1.0, phase))
        );
      }
      
      pattern.push(new HolographicPatternPoint(
        new Coordinate2D(x, y),
        totalAmplitude.magnitude(),
        Math.atan2(totalAmplitude.imag, totalAmplitude.real)
      ));
    }
    
    return pattern;
  }
}

/**
 * Memory fragment manager
 */
export class MemoryFragmentManager {
  fragments: Map<string, MemoryFragment>;
  nextFragmentId: i32;
  maxFragments: i32;
  
  constructor(maxFragments: i32 = 100) {
    this.fragments = new Map<string, MemoryFragment>();
    this.nextFragmentId = 1;
    this.maxFragments = maxFragments;
  }
  
  /**
   * Create a new memory fragment
   */
  createFragment(
    content: string,
    position: Coordinate3D,
    primes: Array<Prime>
  ): MemoryFragment {
    const id = `fragment_${this.nextFragmentId++}`;
    
    // Generate holographic data from primes
    const holographicData = new Map<Prime, Complex>();
    for (let i = 0; i < primes.length; i++) {
      const prime = primes[i];
      const amplitude = 1.0 / (1.0 + i);
      const phase = (prime as f64) * 0.1;
      holographicData.set(prime, Complex.fromPolar(amplitude, phase));
    }
    
    const fragment = new MemoryFragment(id, content, position, holographicData);
    this.fragments.set(id, fragment);
    
    // Remove oldest if over limit
    if (this.fragments.size > this.maxFragments) {
      const keys = this.fragments.keys();
      this.fragments.delete(keys[0]);
    }
    
    return fragment;
  }
  
  /**
   * Remove a fragment
   */
  removeFragment(id: string): void {
    this.fragments.delete(id);
  }
  
  /**
   * Get fragment by ID
   */
  getFragment(id: string): MemoryFragment | null {
    return this.fragments.get(id) || null;
  }
  
  /**
   * Find fragments near a position
   */
  findFragmentsNear(position: Coordinate3D, radius: f64): Array<MemoryFragment> {
    const nearby: Array<MemoryFragment> = [];
    const fragmentIds = this.fragments.keys();
    
    for (let i = 0; i < fragmentIds.length; i++) {
      const fragment = this.fragments.get(fragmentIds[i])!;
      if (fragment.position.distanceTo3D(position) <= radius) {
        nearby.push(fragment);
      }
    }
    
    return nearby;
  }
  
  /**
   * Update all fragments
   */
  update(deltaTime: f64, nodes: Map<string, NetworkNodeVisual>): void {
    const fragmentIds = this.fragments.keys();
    
    for (let i = 0; i < fragmentIds.length; i++) {
      const fragment = this.fragments.get(fragmentIds[i])!;
      fragment.update(deltaTime, nodes);
    }
  }
  
  /**
   * Get render data for all fragments
   */
  getRenderData(context: RenderContext): Array<FragmentRenderData> {
    const renderData: Array<FragmentRenderData> = [];
    const fragmentIds = this.fragments.keys();
    
    // Sort by z-depth for proper rendering
    const sortedFragments: Array<MemoryFragment> = [];
    for (let i = 0; i < fragmentIds.length; i++) {
      sortedFragments.push(this.fragments.get(fragmentIds[i])!);
    }
    
    sortedFragments.sort((a: MemoryFragment, b: MemoryFragment): i32 => {
      return (b.position.z - a.position.z) > 0 ? 1 : -1;
    });
    
    for (let i = 0; i < sortedFragments.length; i++) {
      renderData.push(sortedFragments[i].getRenderData(context));
    }
    
    return renderData;
  }
  
  /**
   * Clear all fragments
   */
  clear(): void {
    this.fragments.clear();
  }
}

/**
 * Fragment render data
 */
export class FragmentRenderData {
  id: string;
  position: Coordinate2D;
  corners: Array<Coordinate2D>;
  opacity: f64;
  glowIntensity: f64;
  state: FragmentState;
  trail: Array<Coordinate2D>;
  holographicPattern: Array<HolographicPatternPoint>;
  
  constructor(
    id: string,
    position: Coordinate2D,
    corners: Array<Coordinate2D>,
    opacity: f64,
    glowIntensity: f64,
    state: FragmentState,
    trail: Array<Coordinate2D>,
    holographicPattern: Array<HolographicPatternPoint>
  ) {
    this.id = id;
    this.position = position;
    this.corners = corners;
    this.opacity = opacity;
    this.glowIntensity = glowIntensity;
    this.state = state;
    this.trail = trail;
    this.holographicPattern = holographicPattern;
  }
}

/**
 * Holographic pattern point
 */
export class HolographicPatternPoint {
  position: Coordinate2D;
  intensity: f64;
  phase: f64;
  
  constructor(position: Coordinate2D, intensity: f64, phase: f64) {
    this.position = position;
    this.intensity = intensity;
    this.phase = phase;
  }
}

/**
 * Memory fragment interactions
 */
export class FragmentInteractionHandler {
  manager: MemoryFragmentManager;
  selectedFragment: string | null;
  dragOffset: Coordinate2D | null;
  
  constructor(manager: MemoryFragmentManager) {
    this.manager = manager;
    this.selectedFragment = null;
    this.dragOffset = null;
  }
  
  /**
   * Handle mouse down
   */
  handleMouseDown(screenPos: Coordinate2D, context: RenderContext): boolean {
    const fragment = this.findFragmentAt(screenPos, context);
    
    if (fragment) {
      this.selectedFragment = fragment.id;
      const fragmentScreen = context.worldToScreen(fragment.position);
      this.dragOffset = new Coordinate2D(
        screenPos.x - fragmentScreen.x,
        screenPos.y - fragmentScreen.y
      );
      return true;
    }
    
    return false;
  }
  
  /**
   * Handle mouse move
   */
  handleMouseMove(screenPos: Coordinate2D, context: RenderContext): void {
    if (this.selectedFragment && this.dragOffset) {
      const fragment = this.manager.getFragment(this.selectedFragment);
      if (fragment) {
        // Convert screen position to world position
        const worldPos = context.screenToWorld2D(new Coordinate2D(
          screenPos.x - this.dragOffset.x,
          screenPos.y - this.dragOffset.y
        ));
        
        fragment.position.x = worldPos.x;
        fragment.position.y = worldPos.y;
      }
    }
  }
  
  /**
   * Handle mouse up
   */
  handleMouseUp(): void {
    this.selectedFragment = null;
    this.dragOffset = null;
  }
  
  /**
   * Find fragment at screen position
   */
  private findFragmentAt(screenPos: Coordinate2D, context: RenderContext): MemoryFragment | null {
    const fragmentIds = this.manager.fragments.keys();
    
    for (let i = 0; i < fragmentIds.length; i++) {
      const fragment = this.manager.fragments.get(fragmentIds[i])!;
      const fragmentScreen = context.worldToScreen(fragment.position);
      const distance = screenPos.distanceTo(fragmentScreen);
      
      if (distance < 20 * fragment.scale) {
        return fragment;
      }
    }
    
    return null;
  }
}