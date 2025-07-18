// visualization/quantum-operations.ts
// Implements quantum operations visualization

import { Complex, Prime } from "../types";
import { PrimeResonanceIdentity } from "../prn-node";
import { Quaternion } from "../quaternion";
import {
  Coordinate2D,
  Coordinate3D,
  AnimationState,
  RenderContext
} from "./types";
import { NetworkNodeVisual, NetworkVisualization } from "./network-node";
import { HolographicField } from "./holographic-field";

/**
 * Quantum operation types
 */
export enum QuantumOperationType {
  ENTANGLEMENT = "entanglement",
  TELEPORTATION = "teleportation",
  ROUTING = "routing",
  MEASUREMENT = "measurement",
  SUPERPOSITION = "superposition"
}

/**
 * Base class for quantum operations
 */
export abstract class QuantumOperation {
  type: QuantumOperationType;
  sourceNodeId: string;
  targetNodeId: string | null;
  progress: f64;
  duration: f64;
  isComplete: boolean;
  visualEffects: Array<VisualEffect>;
  
  constructor(
    type: QuantumOperationType,
    sourceNodeId: string,
    targetNodeId: string | null = null,
    duration: f64 = 1000
  ) {
    this.type = type;
    this.sourceNodeId = sourceNodeId;
    this.targetNodeId = targetNodeId;
    this.progress = 0;
    this.duration = duration;
    this.isComplete = false;
    this.visualEffects = [];
  }
  
  /**
   * Update operation progress
   */
  update(deltaTime: f64, network: NetworkVisualization): void {
    if (this.isComplete) return;
    
    this.progress += deltaTime / this.duration;
    if (this.progress >= 1.0) {
      this.progress = 1.0;
      this.isComplete = true;
      this.onComplete(network);
    }
    
    // Update visual effects
    for (let i = 0; i < this.visualEffects.length; i++) {
      this.visualEffects[i].update(deltaTime);
    }
    
    // Remove completed effects
    this.visualEffects = this.visualEffects.filter(
      (effect: VisualEffect): boolean => !effect.isComplete
    );
    
    // Operation-specific update
    this.updateOperation(deltaTime, network);
  }
  
  /**
   * Abstract methods for subclasses
   */
  abstract updateOperation(deltaTime: f64, network: NetworkVisualization): void;
  abstract onComplete(network: NetworkVisualization): void;
  abstract getRenderData(context: RenderContext, network: NetworkVisualization): OperationRenderData;
}

/**
 * Quantum entanglement operation
 */
export class EntanglementOperation extends QuantumOperation {
  entanglementStrength: f64;
  phaseCorrelation: f64;
  
  constructor(
    sourceNodeId: string,
    targetNodeId: string,
    strength: f64 = 1.0
  ) {
    super(QuantumOperationType.ENTANGLEMENT, sourceNodeId, targetNodeId, 2000);
    this.entanglementStrength = strength;
    this.phaseCorrelation = 0;
  }
  
  updateOperation(deltaTime: f64, network: NetworkVisualization): void {
    const sourceNode = network.nodes.get(this.sourceNodeId);
    const targetNode = network.nodes.get(this.targetNodeId!);
    
    if (!sourceNode || !targetNode) return;
    
    // Update entanglement strength on nodes
    const currentStrength = this.entanglementStrength * this.progress;
    sourceNode.updateEntanglement(currentStrength);
    targetNode.updateEntanglement(currentStrength);
    
    // Create visual connection
    if (this.progress > 0.2 && this.visualEffects.length === 0) {
      const midpoint = sourceNode.state.position.lerp(
        targetNode.state.position, 
        0.5
      );
      
      this.visualEffects.push(new EntanglementBeam(
        sourceNode.state.position,
        targetNode.state.position,
        this.duration * 0.8
      ));
      
      this.visualEffects.push(new QuantumPulse(
        midpoint,
        50,
        this.duration * 0.5
      ));
    }
    
    // Update phase correlation
    this.phaseCorrelation = Math.sin(this.progress * Math.PI);
  }
  
  onComplete(network: NetworkVisualization): void {
    const sourceNode = network.nodes.get(this.sourceNodeId);
    const targetNode = network.nodes.get(this.targetNodeId!);
    
    if (sourceNode && targetNode) {
      // Mark connections as entangled
      const connection = sourceNode.connections.get(this.targetNodeId!);
      if (connection) {
        connection.isEntangled = true;
      }
      
      // Create persistent entanglement effect
      network.connectNodes(
        this.sourceNodeId,
        this.targetNodeId!,
        this.entanglementStrength
      );
    }
  }
  
  getRenderData(context: RenderContext, network: NetworkVisualization): OperationRenderData {
    const effects: Array<EffectRenderData> = [];
    
    for (let i = 0; i < this.visualEffects.length; i++) {
      effects.push(this.visualEffects[i].getRenderData(context));
    }
    
    return new OperationRenderData(
      this.type,
      this.progress,
      effects
    );
  }
}

/**
 * Quantum teleportation operation
 */
export class TeleportationOperation extends QuantumOperation {
  data: string;
  teleportProgress: f64;
  
  constructor(
    sourceNodeId: string,
    targetNodeId: string,
    data: string
  ) {
    super(QuantumOperationType.TELEPORTATION, sourceNodeId, targetNodeId, 3000);
    this.data = data;
    this.teleportProgress = 0;
  }
  
  updateOperation(deltaTime: f64, network: NetworkVisualization): void {
    const sourceNode = network.nodes.get(this.sourceNodeId);
    const targetNode = network.nodes.get(this.targetNodeId!);
    
    if (!sourceNode || !targetNode) return;
    
    // Three phases: prepare, teleport, reconstruct
    if (this.progress < 0.33) {
      // Preparation phase
      if (this.visualEffects.length === 0) {
        this.visualEffects.push(new QuantumPulse(
          sourceNode.state.position,
          30,
          1000
        ));
      }
    } else if (this.progress < 0.66) {
      // Teleportation phase
      this.teleportProgress = (this.progress - 0.33) / 0.33;
      
      if (this.visualEffects.length === 1) {
        this.visualEffects.push(new TeleportBeam(
          sourceNode.state.position,
          targetNode.state.position,
          1000
        ));
      }
    } else {
      // Reconstruction phase
      if (this.visualEffects.length === 2) {
        this.visualEffects.push(new QuantumPulse(
          targetNode.state.position,
          30,
          1000
        ));
      }
    }
  }
  
  onComplete(network: NetworkVisualization): void {
    // Transfer complete - could trigger memory fragment movement
    const targetNode = network.nodes.get(this.targetNodeId!);
    if (targetNode) {
      targetNode.activate();
      
      // Create completion effect
      this.visualEffects.push(new QuantumPulse(
        targetNode.state.position,
        60,
        500
      ));
    }
  }
  
  getRenderData(context: RenderContext, network: NetworkVisualization): OperationRenderData {
    const effects: Array<EffectRenderData> = [];
    
    for (let i = 0; i < this.visualEffects.length; i++) {
      effects.push(this.visualEffects[i].getRenderData(context));
    }
    
    // Add teleportation progress indicator
    if (this.teleportProgress > 0 && this.teleportProgress < 1) {
      const sourceNode = network.nodes.get(this.sourceNodeId);
      const targetNode = network.nodes.get(this.targetNodeId!);
      
      if (sourceNode && targetNode) {
        const pos = sourceNode.state.position.lerp(
          targetNode.state.position,
          this.teleportProgress
        );
        const screenPos = context.worldToScreen(pos);
        
        effects.push(new EffectRenderData(
          "teleport_particle",
          screenPos,
          10,
          `rgba(0, 255, 255, ${1 - this.teleportProgress})`,
          this.teleportProgress
        ));
      }
    }
    
    return new OperationRenderData(
      this.type,
      this.progress,
      effects
    );
  }
}

/**
 * Quantum routing operation
 */
export class RoutingOperation extends QuantumOperation {
  path: Array<string>;
  currentSegment: i32;
  segmentProgress: f64;
  
  constructor(
    sourceNodeId: string,
    targetNodeId: string,
    path: Array<string>
  ) {
    super(QuantumOperationType.ROUTING, sourceNodeId, targetNodeId, 2000 + path.length * 500);
    this.path = path;
    this.currentSegment = 0;
    this.segmentProgress = 0;
  }
  
  updateOperation(deltaTime: f64, network: NetworkVisualization): void {
    if (this.path.length === 0) return;
    
    // Calculate current segment
    const segmentDuration = this.duration / this.path.length;
    const totalProgress = this.progress * this.duration;
    this.currentSegment = Math.floor(totalProgress / segmentDuration) as i32;
    this.segmentProgress = (totalProgress % segmentDuration) / segmentDuration;
    
    if (this.currentSegment >= this.path.length) {
      this.currentSegment = (this.path.length - 1) as i32;
      this.segmentProgress = 1.0;
    }
    
    // Create routing pulse for current segment
    if (this.currentSegment < this.path.length - 1) {
      const fromId = this.currentSegment === 0 
        ? this.sourceNodeId 
        : this.path[this.currentSegment - 1];
      const toId = this.path[this.currentSegment];
      
      const fromNode = network.nodes.get(fromId);
      const toNode = network.nodes.get(toId);
      
      if (fromNode && toNode) {
        const pos = fromNode.state.position.lerp(
          toNode.state.position,
          this.segmentProgress
        );
        
        // Add routing pulse effect
        if (this.visualEffects.length === 0 || 
            this.visualEffects[this.visualEffects.length - 1].isComplete) {
          this.visualEffects.push(new RoutingPulse(
            pos,
            20,
            segmentDuration
          ));
        }
      }
    }
  }
  
  onComplete(network: NetworkVisualization): void {
    // Activate all nodes in path
    for (let i = 0; i < this.path.length; i++) {
      const node = network.nodes.get(this.path[i]);
      if (node) {
        node.activate();
      }
    }
  }
  
  getRenderData(context: RenderContext, network: NetworkVisualization): OperationRenderData {
    const effects: Array<EffectRenderData> = [];
    
    // Render path
    for (let i = 0; i < this.currentSegment && i < this.path.length - 1; i++) {
      const fromId = i === 0 ? this.sourceNodeId : this.path[i - 1];
      const toId = this.path[i];
      
      const fromNode = network.nodes.get(fromId);
      const toNode = network.nodes.get(toId);
      
      if (fromNode && toNode) {
        const fromScreen = context.worldToScreen(fromNode.state.position);
        const toScreen = context.worldToScreen(toNode.state.position);
        
        effects.push(new EffectRenderData(
          "routing_path",
          fromScreen,
          0,
          "rgba(255, 200, 0, 0.5)",
          0,
          toScreen
        ));
      }
    }
    
    // Render current effects
    for (let i = 0; i < this.visualEffects.length; i++) {
      effects.push(this.visualEffects[i].getRenderData(context));
    }
    
    return new OperationRenderData(
      this.type,
      this.progress,
      effects
    );
  }
}

/**
 * Base class for visual effects
 */
export abstract class VisualEffect {
  position: Coordinate3D;
  duration: f64;
  elapsed: f64;
  isComplete: boolean;
  
  constructor(position: Coordinate3D, duration: f64) {
    this.position = position;
    this.duration = duration;
    this.elapsed = 0;
    this.isComplete = false;
  }
  
  update(deltaTime: f64): void {
    this.elapsed += deltaTime;
    if (this.elapsed >= this.duration) {
      this.isComplete = true;
    }
    this.updateEffect(deltaTime);
  }
  
  abstract updateEffect(deltaTime: f64): void;
  abstract getRenderData(context: RenderContext): EffectRenderData;
}

/**
 * Quantum pulse effect
 */
export class QuantumPulse extends VisualEffect {
  radius: f64;
  maxRadius: f64;
  
  constructor(position: Coordinate3D, maxRadius: f64, duration: f64) {
    super(position, duration);
    this.radius = 0;
    this.maxRadius = maxRadius;
  }
  
  updateEffect(deltaTime: f64): void {
    const progress = this.elapsed / this.duration;
    this.radius = this.maxRadius * AnimationState.easeOutElastic(progress);
  }
  
  getRenderData(context: RenderContext): EffectRenderData {
    const screenPos = context.worldToScreen(this.position);
    const opacity = 1.0 - (this.elapsed / this.duration);
    
    return new EffectRenderData(
      "quantum_pulse",
      screenPos,
      this.radius,
      `rgba(100, 200, 255, ${opacity})`,
      this.elapsed / this.duration
    );
  }
}

/**
 * Entanglement beam effect
 */
export class EntanglementBeam extends VisualEffect {
  target: Coordinate3D;
  pulsePhase: f64;
  
  constructor(source: Coordinate3D, target: Coordinate3D, duration: f64) {
    super(source, duration);
    this.target = target;
    this.pulsePhase = 0;
  }
  
  updateEffect(deltaTime: f64): void {
    this.pulsePhase += deltaTime * 0.005;
  }
  
  getRenderData(context: RenderContext): EffectRenderData {
    const sourceScreen = context.worldToScreen(this.position);
    const targetScreen = context.worldToScreen(this.target);
    const opacity = Math.sin((this.elapsed / this.duration) * Math.PI);
    
    return new EffectRenderData(
      "entanglement_beam",
      sourceScreen,
      0,
      `rgba(255, 0, 255, ${opacity})`,
      this.pulsePhase,
      targetScreen
    );
  }
}

/**
 * Teleport beam effect
 */
export class TeleportBeam extends VisualEffect {
  target: Coordinate3D;
  particlePositions: Array<f64>;
  
  constructor(source: Coordinate3D, target: Coordinate3D, duration: f64) {
    super(source, duration);
    this.target = target;
    this.particlePositions = [];
    
    // Initialize particle positions
    for (let i = 0; i < 10; i++) {
      this.particlePositions.push(Math.random());
    }
  }
  
  updateEffect(deltaTime: f64): void {
    // Move particles along beam
    for (let i = 0; i < this.particlePositions.length; i++) {
      this.particlePositions[i] += deltaTime * 0.001;
      if (this.particlePositions[i] > 1.0) {
        this.particlePositions[i] -= 1.0;
      }
    }
  }
  
  getRenderData(context: RenderContext): EffectRenderData {
    const sourceScreen = context.worldToScreen(this.position);
    const targetScreen = context.worldToScreen(this.target);
    const opacity = 1.0 - (this.elapsed / this.duration);
    
    return new EffectRenderData(
      "teleport_beam",
      sourceScreen,
      0,
      `rgba(0, 255, 255, ${opacity})`,
      0,
      targetScreen,
      this.particlePositions
    );
  }
}

/**
 * Routing pulse effect
 */
export class RoutingPulse extends VisualEffect {
  size: f64;
  
  constructor(position: Coordinate3D, size: f64, duration: f64) {
    super(position, duration);
    this.size = size;
  }
  
  updateEffect(deltaTime: f64): void {
    // Pulse size
    const progress = this.elapsed / this.duration;
    const pulse = Math.sin(progress * Math.PI * 4) * 0.2 + 1.0;
    this.size = 20 * pulse;
  }
  
  getRenderData(context: RenderContext): EffectRenderData {
    const screenPos = context.worldToScreen(this.position);
    const opacity = 1.0 - (this.elapsed / this.duration);
    
    return new EffectRenderData(
      "routing_pulse",
      screenPos,
      this.size,
      `rgba(255, 200, 0, ${opacity})`,
      this.elapsed / this.duration
    );
  }
}

/**
 * Quantum operations manager
 */
export class QuantumOperationsManager {
  activeOperations: Array<QuantumOperation>;
  operationHistory: Array<QuantumOperation>;
  maxHistorySize: i32;
  
  constructor(maxHistorySize: i32 = 100) {
    this.activeOperations = [];
    this.operationHistory = [];
    this.maxHistorySize = maxHistorySize;
  }
  
  /**
   * Start a new quantum operation
   */
  startOperation(operation: QuantumOperation): void {
    this.activeOperations.push(operation);
  }
  
  /**
   * Update all active operations
   */
  update(deltaTime: f64, network: NetworkVisualization): void {
    // Update operations
    for (let i = 0; i < this.activeOperations.length; i++) {
      this.activeOperations[i].update(deltaTime, network);
    }
    
    // Move completed operations to history
    const completed = this.activeOperations.filter(
      (op: QuantumOperation): boolean => op.isComplete
    );
    
    for (let i = 0; i < completed.length; i++) {
      this.operationHistory.push(completed[i]);
    }
    
    // Remove completed from active
    this.activeOperations = this.activeOperations.filter(
      (op: QuantumOperation): boolean => !op.isComplete
    );
    
    // Trim history if needed
    if (this.operationHistory.length > this.maxHistorySize) {
      this.operationHistory = this.operationHistory.slice(
        this.operationHistory.length - this.maxHistorySize
      );
    }
  }
  
  /**
   * Get render data for all active operations
   */
  getRenderData(context: RenderContext, network: NetworkVisualization): Array<OperationRenderData> {
    const renderData: Array<OperationRenderData> = [];
    
    for (let i = 0; i < this.activeOperations.length; i++) {
      renderData.push(
        this.activeOperations[i].getRenderData(context, network)
      );
    }
    
    return renderData;
  }
  
  /**
   * Clear all operations
   */
  clear(): void {
    this.activeOperations = [];
  }
}

/**
 * Effect render data
 */
export class EffectRenderData {
  type: string;
  position: Coordinate2D;
  size: f64;
  color: string;
  progress: f64;
  targetPosition: Coordinate2D | null;
  particleData: Array<f64> | null;
  
  constructor(
    type: string,
    position: Coordinate2D,
    size: f64,
    color: string,
    progress: f64,
    targetPosition: Coordinate2D | null = null,
    particleData: Array<f64> | null = null
  ) {
    this.type = type;
    this.position = position;
    this.size = size;
    this.color = color;
    this.progress = progress;
    this.targetPosition = targetPosition;
    this.particleData = particleData;
  }
}

/**
 * Operation render data
 */
export class OperationRenderData {
  type: QuantumOperationType;
  progress: f64;
  effects: Array<EffectRenderData>;
  
  constructor(
    type: QuantumOperationType,
    progress: f64,
    effects: Array<EffectRenderData>
  ) {
    this.type = type;
    this.progress = progress;
    this.effects = effects;
  }
}