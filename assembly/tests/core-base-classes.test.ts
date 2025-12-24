import {
  BaseSerializable,
  BaseValidatable,
  BaseLifecycle,
  BaseObservable,
  BaseNetworkMessage,
  BaseMonitorable,
  BaseHealthCheckable,
  BaseSerializableValidatable,
  BaseProtocolMessage,
  BasePlugin,
} from "../core/base-classes";
import { JSONBuilder } from "../core/serialization";
import { NodeID } from "../types";
import { NetworkMessage, NetworkNode, NetworkEvent, NodeStats, HealthStatus, PluginContext } from "../core/base-interfaces";

// Mock concrete implementations for abstract classes
class MockSerializable extends BaseSerializable {
  private _data: string;
  constructor(data: string) {
    super();
    this._data = data;
  }
  protected buildJSON(builder: JSONBuilder): void {
    builder.addStringField("data", this._data);
  }
  toObject(): any {
    return { data: this._data };
  }
}

class MockValidatable extends BaseValidatable {
  private _isValid: bool;
  constructor(isValid: bool) {
    super();
    this._isValid = isValid;
  }
  protected performValidation(): void {
    if (!this._isValid) {
      this.addValidationError("Mock validation error");
    }
  }
}

class MockLifecycle extends BaseLifecycle {
  initializedCount: i32 = 0;
  disposedCount: i32 = 0;
  protected onInitialize(): void {
    this.initializedCount++;
  }
  protected onDispose(): void {
    this.disposedCount++;
  }
}

class MockObservable extends BaseObservable<string> {}

class MockNetworkMessage extends BaseNetworkMessage {
  constructor(type: string, source: NodeID, payload: Uint8Array, destination: NodeID | null = null) {
    super(type, source, payload, destination);
  }
  protected performAdditionalValidation(): void {
    // No additional validation for mock
  }
}

class MockMonitorable extends BaseMonitorable {
  protected initializeMetrics(): void {
    this.recordMetric("initTime", Date.now());
  }
  protected updateMetrics(): void {
    this.incrementMetric("updateCount");
  }
}

class MockHealthCheckable extends BaseHealthCheckable {
  private _isHealthy: bool;
  constructor(isHealthy: bool) {
    super();
    this._isHealthy = isHealthy;
  }
  protected performHealthChecks(checks: Map<string, bool>, details: Map<string, string>): void {
    checks.set("mockCheck", this._isHealthy);
    details.set("mockDetail", "Mock health check detail");
  }
}

class MockSerializableValidatable extends BaseSerializableValidatable {
  private _data: string;
  private _isValid: bool;
  constructor(data: string, isValid: bool) {
    super();
    this._data = data;
    this._isValid = isValid;
  }
  protected buildJSON(builder: JSONBuilder): void {
    builder.addStringField("data", this._data);
  }
  protected performValidation(): void {
    if (!this._isValid) {
      this.addValidationError("Mock serializable validatable error");
    }
  }
  toObject(): any {
    return { data: this._data };
  }
}

class MockProtocolMessage extends BaseProtocolMessage {
  constructor(type: string, source: NodeID, payload: Uint8Array, destination: NodeID | null = null) {
    super(type, source, payload, destination);
  }
  protected performAdditionalValidation(): void {
    // No additional validation for mock
  }
  load(data: Uint8Array): void {
    // Mock implementation
  }
}

class MockPlugin extends BasePlugin {
  constructor(id: string, name: string, version: string, dependencies: string[] = []) {
    super(id, name, version, dependencies);
  }
  register(context: PluginContext): void {
    // Mock implementation
  }
  protected onInitialize(): void {
    // Mock implementation
  }
  protected onStart(): void {
    // Mock implementation
  }
  protected onStop(): void {
    // Mock implementation
  }
}


export function testBaseSerializable(): void {
  const obj = new MockSerializable("test_data");
  const json = obj.toJSON();
  assert(json.includes('"data":"test_data"'), "toJSON should include data");
  // toObject is abstract in BaseSerializable, tested in MockSerializable
  const objData = obj.toObject();
  assert(objData.data == "test_data", "toObject should return correct data");
}

export function testBaseValidatable(): void {
  const validObj = new MockValidatable(true);
  assert(validObj.validate(), "Valid object should validate");
  assert(validObj.getValidationErrors().length == 0, "Valid object should have no errors");

  const invalidObj = new MockValidatable(false);
  assert(!invalidObj.validate(), "Invalid object should not validate");
  assert(invalidObj.getValidationErrors().length == 1, "Invalid object should have errors");
  assert(invalidObj.getValidationErrors()[0] == "Mock validation error", "Error message should be correct");
}

export function testBaseLifecycle(): void {
  const lifecycle = new MockLifecycle();
  assert(!lifecycle.isInitialized(), "Should not be initialized initially");

  lifecycle.initialize();
  assert(lifecycle.isInitialized(), "Should be initialized after initialize()");
  assert(lifecycle.initializedCount == 1, "onInitialize should be called once");

  lifecycle.dispose();
  assert(!lifecycle.isInitialized(), "Should not be initialized after dispose()");
  assert(lifecycle.disposedCount == 1, "onDispose should be called once");

  // Test error cases
  let threwError = false;
  try {
    lifecycle.initialize(); // Already disposed
  } catch (e) {
    threwError = true;
  }
  assert(threwError, "Should throw error if initialized after disposed");

  threwError = false;
  const uninitialized = new MockLifecycle();
  try {
    uninitialized.dispose(); // Uninitialized
  } catch (e) {
    threwError = true;
  }
  assert(threwError, "Should throw error if disposed when uninitialized");
}

export function testBaseObservable(): void {
  const observable = new MockObservable();
  let receivedData: string | null = null;
  const handler = (data: string): void => { receivedData = data; };

  const unsubscribe = observable.on("testEvent", handler);
  observable.emit("testEvent", "hello");
  assert(receivedData == "hello", "Handler should receive emitted data");

  receivedData = null;
  unsubscribe();
  observable.emit("testEvent", "world");
  assert(receivedData == null, "Handler should not receive data after unsubscribe");

  // Test removeAllListeners
  observable.on("anotherEvent", handler);
  observable.emit("anotherEvent", "data");
  assert(receivedData == "data", "Handler should receive data for another event");
  
  observable.removeAllListeners("anotherEvent");
  receivedData = null;
  observable.emit("anotherEvent", "more data");
  assert(receivedData == null, "Handler should not receive data after removeAllListeners");
}

export function testBaseNetworkMessage(): void {
  const payload = Uint8Array.wrap(String.UTF8.encode("test_payload"));
  const message = new MockNetworkMessage("TEST_TYPE", "source_node", payload, "dest_node");

  assert(message.id.length > 0, "Message ID should be generated");
  assert(message.type == "TEST_TYPE", "Message type should be correct");
  assert(message.source == "source_node", "Message source should be correct");
  assert(message.destination == "dest_node", "Message destination should be correct");
  assert(message.payload == payload, "Message payload should be correct");

  const hash = message.hash();
  assert(hash.length > 0, "Message hash should be generated");

  message.sign(new Uint8Array(0)); // Dummy private key
  assert(message.verify(new Uint8Array(0)), "Message should be verifiable after signing");

  assert(message.validate(), "Message should be valid by default");
}

export function testBaseNetworkNode(): void {
  // BaseNetworkNode is abstract, so we need a mock concrete class
  class ConcreteNetworkNode extends BaseNetworkNode {
    connected: bool = false;
    disconnected: bool = false;
    sentMessages: NetworkMessage[] = [];
    broadcastMessages: NetworkMessage[] = [];
    peers: NodeID[] = ["peer1", "peer2"];

    constructor(nodeId: NodeID, publicKey: Uint8Array) {
      super(nodeId, publicKey);
    }
    connect(): void { this.connected = true; }
    disconnect(): void { this.disconnected = true; }
    send(message: NetworkMessage): void { this.sentMessages.push(message); }
    broadcast(message: NetworkMessage): void { this.broadcastMessages.push(message); }
    getPeers(): NodeID[] { return this.peers; }
    getStats(): NodeStats { return super.getStats(); } // Call base implementation
    initialize(): void { super.initialize(); }
    dispose(): void { super.dispose(); }
  }

  const node = new ConcreteNetworkNode("node1", new Uint8Array(0));
  node.initialize();
  assert(node.connected, "Node should connect on initialize");
  
  node.dispose();
  assert(node.disconnected, "Node should disconnect on dispose");

  const stats = node.getStats();
  assert(stats.messagesReceived == 0, "Initial messages received should be 0");
  assert(stats.messagesSent == 0, "Initial messages sent should be 0");
  assert(stats.connectedPeers == 2, "Initial peers connected should be 2");
}

export function testBaseMonitorable(): void {
  const monitorable = new MockMonitorable();
  monitorable.setMonitoringEnabled(true);
  
  let metrics = monitorable.getMetrics();
  assert(metrics.has("initTime"), "Metrics should have initTime");
  assert(metrics.get("updateCount") == 0, "Update count should be 0 initially");

  monitorable.getMetrics(); // Call to update metrics
  metrics = monitorable.getMetrics();
  assert(metrics.get("updateCount") == 2, "Update count should increment"); // Called twice (initial + one update)

  monitorable.resetMetrics();
  metrics = monitorable.getMetrics();
  assert(metrics.get("updateCount") == 0, "Update count should be reset");

  monitorable.setMonitoringEnabled(false);
  metrics = monitorable.getMetrics();
  assert(metrics.size == 0, "Metrics should be empty when monitoring disabled");
}

export function testBaseHealthCheckable(): void {
  const healthy = new MockHealthCheckable(true);
  const statusHealthy = healthy.checkHealth();
  assert(statusHealthy.healthy, "Healthy object should be healthy");
  assert(statusHealthy.message == "All health checks passed", "Healthy message should be correct");
  assert(statusHealthy.details.has("mockDetail"), "Healthy details should contain mock detail");

  const unhealthy = new MockHealthCheckable(false);
  const statusUnhealthy = unhealthy.checkHealth();
  assert(!statusUnhealthy.healthy, "Unhealthy object should not be healthy");
  assert(statusUnhealthy.message == "One or more health checks failed", "Unhealthy message should be correct");
}

export function testBaseSerializableValidatable(): void {
  const obj = new MockSerializableValidatable("test", true);
  assert(obj.validate(), "Valid object should validate");
  assert(obj.getValidationErrors().length == 0, "Valid object should have no errors");
  const json = obj.toJSON();
  assert(json.includes('"data":"test"'), "toJSON should include data");

  const invalidObj = new MockSerializableValidatable("test", false);
  assert(!invalidObj.validate(), "Invalid object should not validate");
  assert(invalidObj.getValidationErrors().length == 1, "Invalid object should have errors");
}

export function testBaseProtocolMessage(): void {
  const payload = Uint8Array.wrap(String.UTF8.encode("protocol_payload"));
  const message = new MockProtocolMessage("PROTOCOL_TYPE", "sender", payload, "receiver");

  assert(message.getStorageKey().includes("message:PROTOCOL_TYPE:"), "Storage key should be correct");
  
  const savedData = message.save();
  assert(savedData.byteLength > 0, "Saved data should not be empty");

  // Test monitorable delegation
  message.setMonitoringEnabled(true);
  let metrics = message.getMetrics();
  assert(metrics.has("created"), "Metrics should have created timestamp");
  assert(metrics.get("accessCount") == 0, "Access count should be 0 initially");
  message.getMetrics();
  metrics = message.getMetrics();
  assert(metrics.get("accessCount") == 2, "Access count should increment");
}

export function testBasePlugin(): void {
  const plugin = new MockPlugin("plugin-id", "Test Plugin", "1.0.0", ["dep1"]);
  assert(plugin.id == "plugin-id", "Plugin ID should be correct");
  assert(plugin.name == "Test Plugin", "Plugin name should be correct");
  assert(plugin.version == "1.0.0", "Plugin version should be correct");
  assert(plugin.dependencies.length == 1, "Plugin dependencies should be correct");

  // Test lifecycle
  assert(!plugin.isInitialized(), "Plugin should not be initialized initially");
  
  // Mock context
  const mockContext: PluginContext = {
    registerService(name: string, service: any): void {},
    getService(name: string): any | null { return null; },
    on(event: string, handler: (data: any) => void): () => void { return () => {}; },
    emit(event: string, data: any): void {},
  };
  plugin.setContext(mockContext);

  plugin.initialize();
  assert(plugin.isInitialized(), "Plugin should be initialized");

  plugin.start();
  assert(plugin.isStarted(), "Plugin should be started");

  plugin.stop();
  assert(!plugin.isStarted(), "Plugin should be stopped");

  plugin.dispose();
  assert(plugin.isDisposed(), "Plugin should be disposed");
}


export function runAllBaseClassesTests(): void {
  console.log("Running base classes tests...");

  testBaseSerializable();
  console.log("✓ testBaseSerializable passed");

  testBaseValidatable();
  console.log("✓ testBaseValidatable passed");

  testBaseLifecycle();
  console.log("✓ testBaseLifecycle passed");

  testBaseObservable();
  console.log("✓ testBaseObservable passed");

  testBaseNetworkMessage();
  console.log("✓ testBaseNetworkMessage passed");

  testBaseNetworkNode();
  console.log("✓ testBaseNetworkNode passed");

  testBaseMonitorable();
  console.log("✓ testBaseMonitorable passed");

  testBaseHealthCheckable();
  console.log("✓ testBaseHealthCheckable passed");

  testBaseSerializableValidatable();
  console.log("✓ testBaseSerializableValidatable passed");

  testBaseProtocolMessage();
  console.log("✓ testBaseProtocolMessage passed");

  testBasePlugin();
  console.log("✓ testBasePlugin passed");

  console.log("\nAll base classes tests passed! ✨");
}