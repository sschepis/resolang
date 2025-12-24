// visualization/index.ts
// Main entry point for the PRN visualization system

// Import all required types and classes
import {
  Coordinate2D,
  Coordinate3D,
  HolographicPoint,
  NodeVisualizationState,
  MemoryFragmentVisualization,
  AnimationState,
  RenderContext
} from "./types";

import {
  HolographicField,
  HolographicFieldRenderer,
  RenderData
} from "./holographic-field";

import {
  NetworkNodeVisual,
  NetworkConnection,
  NetworkVisualization,
  NodeRenderData,
  ConnectionRenderData,
  NetworkRenderData
} from "./network-node";

import {
  QuantumOperationType,
  QuantumOperation,
  EntanglementOperation,
  TeleportationOperation,
  RoutingOperation,
  VisualEffect,
  QuantumPulse,
  EntanglementBeam,
  TeleportBeam,
  RoutingPulse,
  QuantumOperationsManager,
  EffectRenderData,
  OperationRenderData
} from "./quantum-operations";

import {
  FragmentState,
  MemoryFragment,
  MemoryFragmentManager,
  FragmentRenderData,
  HolographicPatternPoint,
  FragmentInteractionHandler
} from "./memory-fragments";

import { Quaternion } from "../quaternion";
import { PrimeResonanceIdentity } from "../prn-node";
import { Prime } from "../types";

// Re-export all types
export {
  Coordinate2D,
  Coordinate3D,
  HolographicPoint,
  NodeVisualizationState,
  MemoryFragmentVisualization,
  AnimationState,
  RenderContext
} from "./types";

export {
  HolographicField,
  HolographicFieldRenderer,
  RenderData
} from "./holographic-field";

export {
  NetworkNodeVisual,
  NetworkConnection,
  NetworkVisualization,
  NodeRenderData,
  ConnectionRenderData,
  NetworkRenderData
} from "./network-node";

export {
  QuantumOperationType,
  QuantumOperation,
  EntanglementOperation,
  TeleportationOperation,
  RoutingOperation,
  VisualEffect,
  QuantumPulse,
  EntanglementBeam,
  TeleportBeam,
  RoutingPulse,
  QuantumOperationsManager,
  EffectRenderData,
  OperationRenderData
} from "./quantum-operations";

export {
  FragmentState,
  MemoryFragment,
  MemoryFragmentManager,
  FragmentRenderData,
  HolographicPatternPoint,
  FragmentInteractionHandler
} from "./memory-fragments";

/**
 * Main visualization system that integrates all components
 */
export class PRNVisualizationSystem {
  network: NetworkVisualization;
  globalField: HolographicField;
  fragmentManager: MemoryFragmentManager;
  operationsManager: QuantumOperationsManager;
  renderContext: RenderContext;
  
  constructor(width: f64, height: f64) {
    this.network = new NetworkVisualization();
    this.globalField = new HolographicField(40, new Coordinate3D(300, 300, 300));
    this.fragmentManager = new MemoryFragmentManager(200);
    this.operationsManager = new QuantumOperationsManager();
    this.renderContext = new RenderContext(width, height);
  }
  
  /**
   * Update all visualization components
   */
  update(deltaTime: f64): void {
    // Update render context time
    this.renderContext.updateTime(deltaTime);
    
    // Update all components
    this.network.update(deltaTime);
    this.globalField.updateAnimations(deltaTime);
    this.fragmentManager.update(deltaTime, this.network.nodes);
    this.operationsManager.update(deltaTime, this.network);
  }
  
  /**
   * Get complete render data for visualization
   */
  getRenderData(): VisualizationRenderData {
    // Network data
    const networkData = this.network.getRenderData(this.renderContext);
    
    // Holographic field data
    const fieldRenderer = new HolographicFieldRenderer(this.globalField);
    const fieldData = fieldRenderer.render(this.renderContext);
    const interferenceData = fieldRenderer.renderInterferencePattern(this.renderContext);
    
    // Memory fragments
    const fragmentData = this.fragmentManager.getRenderData(this.renderContext);
    
    // Quantum operations
    const operationData = this.operationsManager.getRenderData(
      this.renderContext,
      this.network
    );
    
    return new VisualizationRenderData(
      networkData,
      fieldData,
      interferenceData,
      fragmentData,
      operationData
    );
  }
  
  /**
   * Handle mouse interaction
   */
  handleMouseMove(x: f64, y: f64): void {
    const screenPos = new Coordinate2D(x, y);
    this.network.handleHover(screenPos, this.renderContext);
  }
  
  /**
   * Handle click interaction
   */
  handleClick(x: f64, y: f64): void {
    const screenPos = new Coordinate2D(x, y);
    const hoveredNode = this.network.handleHover(screenPos, this.renderContext);
    
    if (hoveredNode) {
      this.network.selectNode(hoveredNode);
    }
  }
  
  /**
   * Resize the visualization
   */
  resize(width: f64, height: f64): void {
    this.renderContext.width = width;
    this.renderContext.height = height;
    this.renderContext.offset = new Coordinate2D(width / 2, height / 2);
  }
  
  /**
   * Set camera zoom
   */
  setZoom(scale: f64): void {
    this.renderContext.scale = scale;
  }
  
  /**
   * Set camera rotation
   */
  setRotation(quaternion: Quaternion): void {
    this.renderContext.rotation = quaternion;
  }
}

/**
 * Complete visualization render data
 */
export class VisualizationRenderData {
  network: NetworkRenderData;
  holographicField: Array<RenderData>;
  interferencePattern: Array<RenderData>;
  memoryFragments: Array<FragmentRenderData>;
  quantumOperations: Array<OperationRenderData>;
  
  constructor(
    network: NetworkRenderData,
    holographicField: Array<RenderData>,
    interferencePattern: Array<RenderData>,
    memoryFragments: Array<FragmentRenderData>,
    quantumOperations: Array<OperationRenderData>
  ) {
    this.network = network;
    this.holographicField = holographicField;
    this.interferencePattern = interferencePattern;
    this.memoryFragments = memoryFragments;
    this.quantumOperations = quantumOperations;
  }
}


/**
 * Factory methods for creating visualization elements
 */
export class VisualizationFactory {
  /**
   * Create a node with visualization
   */
  static createNode(
    system: PRNVisualizationSystem,
    nodeId: string,
    x: f64,
    y: f64,
    z: f64,
    gaussianPrime: Prime,
    eisensteinPrime: Prime,
    quaternionicPrime: Prime
  ): void {
    const position = new Coordinate3D(x, y, z);
    const pri = new PrimeResonanceIdentity(
      gaussianPrime,
      eisensteinPrime,
      quaternionicPrime
    );
    
    system.network.addNode(nodeId, position, pri);
  }
  
  /**
   * Create a memory fragment
   */
  static createFragment(
    system: PRNVisualizationSystem,
    content: string,
    x: f64,
    y: f64,
    z: f64,
    primes: Array<Prime>
  ): MemoryFragment {
    const position = new Coordinate3D(x, y, z);
    return system.fragmentManager.createFragment(content, position, primes);
  }
  
  /**
   * Start an entanglement operation
   */
  static startEntanglement(
    system: PRNVisualizationSystem,
    sourceNodeId: string,
    targetNodeId: string,
    strength: f64 = 1.0
  ): void {
    const operation = new EntanglementOperation(
      sourceNodeId,
      targetNodeId,
      strength
    );
    system.operationsManager.startOperation(operation);
  }
  
  /**
   * Start a teleportation operation
   */
  static startTeleportation(
    system: PRNVisualizationSystem,
    sourceNodeId: string,
    targetNodeId: string,
    data: string
  ): void {
    const operation = new TeleportationOperation(
      sourceNodeId,
      targetNodeId,
      data
    );
    system.operationsManager.startOperation(operation);
  }
  
  /**
   * Start a routing operation
   */
  static startRouting(
    system: PRNVisualizationSystem,
    sourceNodeId: string,
    targetNodeId: string,
    path: Array<string>
  ): void {
    const operation = new RoutingOperation(
      sourceNodeId,
      targetNodeId,
      path
    );
    system.operationsManager.startOperation(operation);
  }
}