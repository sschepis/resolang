// visualization/network-node.ts
// Implements the network node visualization component

import { Complex, Prime } from "../types";
import { PrimeResonanceIdentity } from "../prn-node";
import { Quaternion } from "../quaternion";
import {
  Coordinate2D,
  Coordinate3D,
  NodeVisualizationState,
  HolographicPoint,
  AnimationState,
  RenderContext
} from "./types";
import { HolographicField } from "./holographic-field";

/**
 * Represents a visual network node in the PRN
 */
export class NetworkNodeVisual {
  state: NodeVisualizationState;
  connections: Map<string, NetworkConnection>;
  localField: HolographicField;
  pulseAnimation: AnimationState | null;
  rotationSpeed: f64;
  
  constructor(
    nodeId: string,
    position: Coordinate3D,
    pri: PrimeResonanceIdentity
  ) {
    this.state = new NodeVisualizationState(nodeId, position, pri);
    this.connections = new Map<string, NetworkConnection>();
    this.localField = new HolographicField(5, new Coordinate3D(50, 50, 50));
    this.pulseAnimation = null;
    this.rotationSpeed = 0.5;
    
    this.initializeLocalField();
  }
  
  /**
   * Initialize the local holographic field around the node
   */
  private initializeLocalField(): void {
    // Add quantum sources based on PRI
    const amplitude1 = Complex.fromPolar(
      this.state.pri.gaussianPrime / 1000.0,
      0
    );
    const amplitude2 = Complex.fromPolar(
      this.state.pri.eisensteinPrime / 1000.0,
      Math.PI / 3
    );
    const amplitude3 = Complex.fromPolar(
      this.state.pri.quaternionicPrime / 1000.0,
      2 * Math.PI / 3
    );
    
    this.localField.addSource(new Coordinate3D(10, 0, 0), amplitude1, 1.0);
    this.localField.addSource(new Coordinate3D(-5, 8.66, 0), amplitude2, 1.2);
    this.localField.addSource(new Coordinate3D(-5, -8.66, 0), amplitude3, 0.8);
  }
  
  /**
   * Add a connection to another node
   */
  addConnection(targetNodeId: string, strength: f64 = 1.0): void {
    const connection = new NetworkConnection(
      this.state.nodeId,
      targetNodeId,
      strength
    );
    this.connections.set(targetNodeId, connection);
  }
  
  /**
   * Remove a connection
   */
  removeConnection(targetNodeId: string): void {
    this.connections.delete(targetNodeId);
  }
  
  /**
   * Update entanglement strength
   */
  updateEntanglement(strength: f64): void {
    this.state.entanglementStrength = strength;
    this.state.updateHolographicField(Math.floor(5 + strength * 5) as i32);
    
    // Trigger pulse animation
    this.pulseAnimation = new AnimationState(
      this.state.size,
      this.state.size * (1.0 + strength * 0.5),
      500,
      AnimationState.easeOutElastic
    );
  }
  
  /**
   * Handle hover state
   */
  setHovered(hovered: boolean): void {
    this.state.isHovered = hovered;
    
    if (hovered) {
      // Expand on hover
      this.pulseAnimation = new AnimationState(
        this.state.size,
        this.state.size * 1.3,
        200,
        AnimationState.easeInOutCubic
      );
    } else {
      // Return to normal size
      this.pulseAnimation = new AnimationState(
        this.state.size * 1.3,
        this.state.size,
        200,
        AnimationState.easeInOutCubic
      );
    }
  }
  
  /**
   * Activate the node
   */
  activate(): void {
    this.state.isActive = true;
    this.rotationSpeed = 2.0;
    
    // Create activation effect in local field
    const params = new Map<string, f64>();
    params.set("position_x", 0);
    params.set("position_y", 0);
    params.set("position_z", 0);
    this.localField.applyQuantumOperation("collapse", params);
  }
  
  /**
   * Deactivate the node
   */
  deactivate(): void {
    this.state.isActive = false;
    this.rotationSpeed = 0.5;
  }
  
  /**
   * Update node state and animations
   */
  update(deltaTime: f64): void {
    // Update animations
    if (this.pulseAnimation) {
      this.pulseAnimation.update(deltaTime);
      if (this.pulseAnimation.isComplete) {
        this.pulseAnimation = null;
      } else {
        this.state.size = this.pulseAnimation.currentValue;
      }
    }
    
    // Rotate local field
    if (this.rotationSpeed > 0) {
      const angle = this.rotationSpeed * deltaTime * 0.001; // Convert ms to seconds
      const params = new Map<string, f64>();
      params.set("angle", angle);
      params.set("axis_x", 0);
      params.set("axis_y", 1);
      params.set("axis_z", 0);
      this.localField.applyQuantumOperation("rotate", params);
    }
    
    // Update local field animations
    this.localField.updateAnimations(deltaTime);
  }
  
  /**
   * Get render data for the node
   */
  getRenderData(context: RenderContext): NodeRenderData {
    const screenPos = context.worldToScreen(this.state.position);
    const size = this.pulseAnimation 
      ? this.pulseAnimation.currentValue 
      : this.state.size;
    
    // Adjust size based on perspective
    const perspectiveFactor = context.perspective / 
      (context.perspective + this.state.position.z);
    const adjustedSize = size * perspectiveFactor;
    
    return new NodeRenderData(
      screenPos,
      adjustedSize,
      this.state.color,
      this.state.isActive,
      this.state.isHovered,
      this.state.entanglementStrength
    );
  }
}

/**
 * Represents a connection between two nodes
 */
export class NetworkConnection {
  sourceId: string;
  targetId: string;
  strength: f64;
  pulsePhase: f64;
  isEntangled: boolean;
  
  constructor(sourceId: string, targetId: string, strength: f64 = 1.0) {
    this.sourceId = sourceId;
    this.targetId = targetId;
    this.strength = strength;
    this.pulsePhase = 0;
    this.isEntangled = false;
  }
  
  /**
   * Update connection animation
   */
  update(deltaTime: f64): void {
    // Animate pulse along connection
    this.pulsePhase += deltaTime * 0.002; // 2 radians per second
    if (this.pulsePhase > 2 * Math.PI) {
      this.pulsePhase -= 2 * Math.PI;
    }
  }
  
  /**
   * Get interpolated position along connection
   */
  getPositionAt(t: f64, sourcePos: Coordinate3D, targetPos: Coordinate3D): Coordinate3D {
    // Add wave effect
    const wave = Math.sin(t * Math.PI * 4 + this.pulsePhase) * 0.1;
    const adjustedT = t + wave * 0.1;
    
    return sourcePos.lerp(targetPos, Math.max(0, Math.min(1, adjustedT)));
  }
}

/**
 * Network visualization manager
 */
export class NetworkVisualization {
  nodes: Map<string, NetworkNodeVisual>;
  globalField: HolographicField;
  selectedNode: string | null;
  
  constructor() {
    this.nodes = new Map<string, NetworkNodeVisual>();
    this.globalField = new HolographicField(30, new Coordinate3D(200, 200, 200));
    this.selectedNode = null;
  }
  
  /**
   * Add a node to the network
   */
  addNode(nodeId: string, position: Coordinate3D, pri: PrimeResonanceIdentity): void {
    const node = new NetworkNodeVisual(nodeId, position, pri);
    this.nodes.set(nodeId, node);
    
    // Add to global field
    const amplitude = Complex.fromPolar(
      (pri.gaussianPrime + pri.eisensteinPrime + pri.quaternionicPrime) / 3000.0,
      0
    );
    this.globalField.addSource(position, amplitude, 1.0);
  }
  
  /**
   * Remove a node from the network
   */
  removeNode(nodeId: string): void {
    const node = this.nodes.get(nodeId);
    if (node) {
      // Remove all connections
      const nodeIds = this.nodes.keys();
      for (let i = 0; i < nodeIds.length; i++) {
        const otherId = nodeIds[i];
        const otherNode = this.nodes.get(otherId);
        if (otherNode) {
          otherNode.removeConnection(nodeId);
        }
      }
      
      this.nodes.delete(nodeId);
    }
  }
  
  /**
   * Create connection between nodes
   */
  connectNodes(sourceId: string, targetId: string, strength: f64 = 1.0): void {
    const sourceNode = this.nodes.get(sourceId);
    const targetNode = this.nodes.get(targetId);
    
    if (sourceNode && targetNode) {
      sourceNode.addConnection(targetId, strength);
      targetNode.addConnection(sourceId, strength);
      
      // Create entanglement in global field
      const params = new Map<string, f64>();
      params.set("source_x", sourceNode.state.position.x);
      params.set("source_y", sourceNode.state.position.y);
      params.set("source_z", sourceNode.state.position.z);
      params.set("target_x", targetNode.state.position.x);
      params.set("target_y", targetNode.state.position.y);
      params.set("target_z", targetNode.state.position.z);
      
      this.globalField.applyQuantumOperation("entangle", params);
    }
  }
  
  /**
   * Select a node
   */
  selectNode(nodeId: string | null): void {
    // Deselect previous
    if (this.selectedNode) {
      const prevNode = this.nodes.get(this.selectedNode);
      if (prevNode) {
        prevNode.deactivate();
      }
    }
    
    // Select new
    this.selectedNode = nodeId;
    if (nodeId) {
      const node = this.nodes.get(nodeId);
      if (node) {
        node.activate();
      }
    }
  }
  
  /**
   * Handle mouse hover
   */
  handleHover(screenPos: Coordinate2D, context: RenderContext): string | null {
    let hoveredNode: string | null = null;
    let minDistance = f64.MAX_VALUE;
    
    const nodeIds = this.nodes.keys();
    for (let i = 0; i < nodeIds.length; i++) {
      const nodeId = nodeIds[i];
      const node = this.nodes.get(nodeId)!;
      const nodeScreenPos = context.worldToScreen(node.state.position);
      const distance = screenPos.distanceTo(nodeScreenPos);
      
      if (distance < node.state.size && distance < minDistance) {
        minDistance = distance;
        hoveredNode = nodeId;
      }
    }
    
    // Update hover states
    for (let i = 0; i < nodeIds.length; i++) {
      const nodeId = nodeIds[i];
      const node = this.nodes.get(nodeId)!;
      node.setHovered(nodeId === hoveredNode);
    }
    
    return hoveredNode;
  }
  
  /**
   * Update all nodes and connections
   */
  update(deltaTime: f64): void {
    // Update nodes
    const nodeIds = this.nodes.keys();
    for (let i = 0; i < nodeIds.length; i++) {
      const node = this.nodes.get(nodeIds[i])!;
      node.update(deltaTime);
    }
    
    // Update connections
    for (let i = 0; i < nodeIds.length; i++) {
      const node = this.nodes.get(nodeIds[i])!;
      const connectionIds = node.connections.keys();
      for (let j = 0; j < connectionIds.length; j++) {
        const connection = node.connections.get(connectionIds[j])!;
        connection.update(deltaTime);
      }
    }
    
    // Update global field
    this.globalField.updateAnimations(deltaTime);
  }
  
  /**
   * Get all render data for visualization
   */
  getRenderData(context: RenderContext): NetworkRenderData {
    const nodeRenderData: Array<NodeRenderData> = [];
    const connectionRenderData: Array<ConnectionRenderData> = [];
    
    // Collect node render data
    const nodeIds = this.nodes.keys();
    for (let i = 0; i < nodeIds.length; i++) {
      const node = this.nodes.get(nodeIds[i])!;
      nodeRenderData.push(node.getRenderData(context));
    }
    
    // Collect connection render data
    for (let i = 0; i < nodeIds.length; i++) {
      const sourceNode = this.nodes.get(nodeIds[i])!;
      const connectionIds = sourceNode.connections.keys();
      
      for (let j = 0; j < connectionIds.length; j++) {
        const targetId = connectionIds[j];
        const targetNode = this.nodes.get(targetId);
        
        if (targetNode && sourceNode.state.nodeId < targetId) { // Avoid duplicates
          const connection = sourceNode.connections.get(targetId)!;
          const sourceScreen = context.worldToScreen(sourceNode.state.position);
          const targetScreen = context.worldToScreen(targetNode.state.position);
          
          connectionRenderData.push(new ConnectionRenderData(
            sourceScreen,
            targetScreen,
            connection.strength,
            connection.pulsePhase,
            connection.isEntangled
          ));
        }
      }
    }
    
    return new NetworkRenderData(nodeRenderData, connectionRenderData);
  }
}

/**
 * Node render data
 */
export class NodeRenderData {
  position: Coordinate2D;
  size: f64;
  color: string;
  isActive: boolean;
  isHovered: boolean;
  entanglementStrength: f64;
  
  constructor(
    position: Coordinate2D,
    size: f64,
    color: string,
    isActive: boolean,
    isHovered: boolean,
    entanglementStrength: f64
  ) {
    this.position = position;
    this.size = size;
    this.color = color;
    this.isActive = isActive;
    this.isHovered = isHovered;
    this.entanglementStrength = entanglementStrength;
  }
}

/**
 * Connection render data
 */
export class ConnectionRenderData {
  source: Coordinate2D;
  target: Coordinate2D;
  strength: f64;
  pulsePhase: f64;
  isEntangled: boolean;
  
  constructor(
    source: Coordinate2D,
    target: Coordinate2D,
    strength: f64,
    pulsePhase: f64,
    isEntangled: boolean
  ) {
    this.source = source;
    this.target = target;
    this.strength = strength;
    this.pulsePhase = pulsePhase;
    this.isEntangled = isEntangled;
  }
}

/**
 * Complete network render data
 */
export class NetworkRenderData {
  nodes: Array<NodeRenderData>;
  connections: Array<ConnectionRenderData>;
  
  constructor(
    nodes: Array<NodeRenderData>,
    connections: Array<ConnectionRenderData>
  ) {
    this.nodes = nodes;
    this.connections = connections;
  }
}