# ResoLang API Reference

This document provides a detailed reference for the ResoLang API.

## Core Architecture

The ResoLang library is built on a modular and extensible architecture. The core components are designed to be robust, performant, and easy to use. This reference will cover the key modules and patterns you'll interact with when building on the Prime Resonance Network.

### Key Modules Overview

*   **Builders (`assembly/core/builders.ts`):** Provides fluent builder classes for constructing complex objects like `NetworkNode`, `PrimeState`, and `ProtocolMessage`. This is the recommended way to create new entities in the network.
*   **Factories (`assembly/core/factory-pattern.ts`):** Implements an Abstract Factory pattern for creating families of related components (e.g., `ProtocolModule`, `StorageModule`). This allows for different implementations (e.g., `Standard`, `Secure`, `Performance`) to be swapped in easily.
*   **Error Handling (`assembly/core/error-handling.ts`, `errors.ts`):** A comprehensive error handling system with custom error types, recovery strategies (like Retry and Circuit Breaker), and detailed error reporting.
*   **Plugin System (`assembly/core/plugin-system.ts`):** Allows for extending the core functionality with custom plugins. The system manages plugin lifecycle, dependencies, and communication.
*   **Event System (`assembly/core/event-system.ts`):** A decoupled event bus for communication between different components of the system.
*   **Serialization (`assembly/core/serialization.ts`):** A custom JSON serialization framework optimized for performance.
*   **Validation (`assembly/core/validation.ts`, `validators.ts`):** A powerful framework for validating data and object states.
*   **Math Library (`assembly/core/math-*.ts`):** An extensive set of mathematical functions for prime number theory, modular arithmetic, and other operations that form the foundation of the Prime Resonance Network.

---

### Builders (`assembly/core/builders.ts`)

The builder classes provide a fluent API for constructing complex objects. This is the preferred method for creating instances of core network entities.

#### `PrimeStateBuilder`

Used to construct `PrimeState` objects, which represent the quantum state of a node.

**Example:**
```typescript
import { primeState } from "./assembly/core/builders";
import { Prime } from "./assembly/types";

const state = primeState()
  .withPrime(new Prime(7), 0.5)
  .withPrime(new Prime(13), 0.8)
  .normalized()
  .build();
```

**Methods:**
- `withPrime(prime: Prime, amplitude: f64, phase: Phase = 0.0): PrimeStateBuilder`
- `withPrimes(primes: Array<Prime>, amplitude: f64 = 1.0): PrimeStateBuilder`
- `withNormalization(factor: f64): PrimeStateBuilder`
- `normalized(): PrimeStateBuilder`
- `build(): PrimeState`

#### `NetworkNodeBuilder`

Used to construct `NetworkNode` objects.

**Example:**
```typescript
import { networkNode } from "./assembly/core/builders";
import { NodeID, Prime } from "./assembly/types";

const node = networkNode()
  .withId(new NodeID("my-node"))
  .withPrimes(new Prime(2), new Prime(3), new Prime(5))
  .withCoherence(0.95)
  .withEntanglement(new NodeID("other-node"), 0.8)
  .build();
```

**Methods:**
- `withId(id: NodeID): NetworkNodeBuilder`
- `withPrimes(p1: Prime, p2: Prime, p3: Prime): NetworkNodeBuilder`
- `withPrimeArray(primes: Array<Prime>): NetworkNodeBuilder`
- `withEntanglement(nodeId: NodeID, strength: EntanglementStrength): NetworkNodeBuilder`
- `withCoherence(coherence: f64): NetworkNodeBuilder`
- `withActiveState(isActive: bool): NetworkNodeBuilder`
- `withQuantumState(state: PrimeState): NetworkNodeBuilder`
- `build(): NetworkNode`

#### `ProtocolMessageBuilder<T>`

A generic builder for creating protocol messages.

**Example:**
```typescript
import { protocolMessage } from "./assembly/core/builders";
import { NodeID } from "./assembly/types";

// Assuming a custom message type 'MyMessage'
const message = protocolMessage<MyMessage>()
  .withType("MY_MESSAGE")
  .withSource(new NodeID("node-a"))
  .withTarget(new NodeID("node-b"))
  .withPayload("data", "hello")
  .build(builder => new MyMessage(builder));
```

**Methods:**
- `withType(type: string): ProtocolMessageBuilder<T>`
- `withSource(sourceId: NodeID): ProtocolMessageBuilder<T>`
- `withTarget(targetId: NodeID): ProtocolMessageBuilder<T>`
- `withTimestamp(timestamp: f64 = Date.now()): ProtocolMessageBuilder<T>`
- `withPayload(key: string, value: any): ProtocolMessageBuilder<T>`
- `withMetadata(key: string, value: string): ProtocolMessageBuilder<T>`
- `build(factory: (builder: ProtocolMessageBuilder<T>) => T): T`

#### `NetworkTopologyBuilder`

Used to define the structure of a network.

**Example:**
```typescript
import { networkTopology, networkNode } from "./assembly/core/builders";
import { NodeID, Prime } from "./assembly/types";

const node1 = networkNode().withId(new NodeID("node-1")).withPrimes(new Prime(2), new Prime(3), new Prime(5)).build();
const node2 = networkNode().withId(new NodeID("node-2")).withPrimes(new Prime(7), new Prime(11), new Prime(13)).build();

const topology = networkTopology()
  .withNode(node1)
  .withNode(node2)
  .ring()
  .getNodes();
```

**Methods:**
- `withMaxNodes(max: i32): NetworkTopologyBuilder`
- `withMaxLinks(max: i32): NetworkTopologyBuilder`
- `withNode(node: BaseNetworkNode): NetworkTopologyBuilder`
- `withNodes(nodes: Array<BaseNetworkNode>): NetworkTopologyBuilder`
- `withConnection(sourceId: NodeID, targetId: NodeID, strength: f64 = 1.0): NetworkTopologyBuilder`
- `fullyConnected(strength: f64 = 1.0): NetworkTopologyBuilder`
- `ring(strength: f64 = 1.0): NetworkTopologyBuilder`
- `star(strength: f64 = 1.0): NetworkTopologyBuilder`

#### `QuantumCircuitBuilder`

Used to define a sequence of quantum gates.

**Example:**
```typescript
import { quantumCircuit } from "./assembly/core/builders";

const circuit = quantumCircuit()
  .withQubits(2)
  .hadamard(0)
  .cnot(0, 1)
  .measureAll();
```

**Methods:**
- `withQubits(count: i32): QuantumCircuitBuilder`
- `hadamard(qubit: i32): QuantumCircuitBuilder`
- `pauliX(qubit: i32): QuantumCircuitBuilder`
- `pauliY(qubit: i32): QuantumCircuitBuilder`
- `pauliZ(qubit: i32): QuantumCircuitBuilder`
- `cnot(control: i32, target: i32): QuantumCircuitBuilder`
- `phase(qubit: i32, angle: f64): QuantumCircuitBuilder`
- `measure(qubit: i32): QuantumCircuitBuilder`
- `measureAll(): QuantumCircuitBuilder`

---

### Factory Pattern (`assembly/core/factory-pattern.ts`)

The factory pattern is used to create families of related components. This allows for different implementations (e.g., standard, secure, performance-optimized) to be easily swapped.

#### `ComponentFamily`

An enum that defines the available component families:
- `STANDARD`
- `SECURE`
- `PERFORMANCE`
- `MINIMAL`

#### `ComponentSuiteFactory`

An abstract factory for creating a `ComponentSuite`, which is a collection of all necessary modules (protocol, storage, crypto, transport) for a specific family.

**Example:**
```typescript
import { SecureComponentSuiteFactory } from "./assembly/core/factory-pattern";
import { Map } from "assemblyscript/std/map";

const factory = new SecureComponentSuiteFactory();
const config = new Map<string, string>();
const componentSuite = factory.createSuite(config);

// Now you have a full suite of secure components
const protocol = componentSuite.protocol;
const storage = componentSuite.storage;
```

#### `FactoryRegistry`

A global registry for all component and suite factories. This is the main entry point for creating components.

**Example:**
```typescript
import { factoryRegistry, ComponentFamily } from "./assembly/core/factory-pattern";
import { Map } from "assemblyscript/std/map";

const config = new Map<string, string>();
const suite = factoryRegistry.createSuite(ComponentFamily.PERFORMANCE, config);

if (suite) {
  // ... use the high-performance component suite
}
```

**Key Methods:**
- `registerFactory<T>(type: string, factory: AbstractFactory<T>): void`
- `registerSuiteFactory(factory: ComponentSuiteFactory): void`
- `create<T>(type: string, name: string, config: Map<string, string>): T | null`
- `createSuite(family: ComponentFamily, config: Map<string, string>): ComponentSuite | null`

#### `FactoryBuilder<T>`

A fluent builder for creating custom factories.

**Example:**
```typescript
import { FactoryBuilder, ValidationResult } from "./assembly/core/factory-pattern";
import { Map } from "assemblyscript/std/map";

// Define a custom component
class MyComponent {
  constructor(public readonly setting: string) {}
}

const myFactory = new FactoryBuilder<MyComponent>()
  .withName("my-component-factory")
  .withRequiredConfig("setting")
  .withCreateFunction((config: Map<string, string>) => {
    return new MyComponent(config.get("setting"));
  })
  .build();

factoryRegistry.registerFactory("custom", myFactory);
```

---

### Error Handling (`assembly/core/error-handling.ts`, `errors.ts`, `error-context.ts`)

The library includes a robust error handling system with custom error types, recovery strategies, and telemetry.

#### `PRNError`

The base class for all custom errors in the library. It extends the standard `Error` class with additional context, including an `ErrorCategory` code, `ErrorSeverity`, and a context map for arbitrary data.

#### Specialized Error Classes

A suite of specialized error classes inherit from `PRNError` for different domains:
- `NetworkException`: For network-related issues like connectivity or peer discovery.
- `ProtocolException`: For errors related to the network protocol, like invalid messages or timeouts.
- `CryptoException`: For cryptographic errors like invalid signatures or key sizes.
- `MathException`: For errors in mathematical computations.
- `ConfigException`: For invalid or missing configuration parameters.
- `StateException`: For operations attempted in an invalid state.
- `ValidationException`: For data validation failures.
- `ResourceException`: For issues like insufficient memory or capacity limits.

**Example: Throwing a specialized error**
```typescript
import { NetworkException } from "./assembly/core/errors";
import { NetworkError } from "./assembly/core/constants";

throw NetworkException.nodeNotFound("node-123");
```

#### `ErrorManager`

A singleton that acts as the central point for error handling. It manages error handlers and recovery strategies.

**Example:**
```typescript
import { ErrorManager, ConsoleErrorHandler, PRNError } from "./assembly/core/error-handling";

const errorManager = ErrorManager.getInstance();
errorManager.registerHandler(new ConsoleErrorHandler());

try {
  // ... some operation that might fail
} catch (e) {
  if (e instanceof PRNError) {
    errorManager.handleError(e);
  }
}
```

#### Recovery Strategies

The system includes several built-in strategies for automatic error recovery.

- **`RetryStrategy`**: Automatically retries operations that fail with transient errors (like network timeouts) using an exponential backoff algorithm.
- **`CircuitBreakerStrategy`**: Prevents cascading failures by "opening a circuit" (temporarily blocking requests) to a service that is consistently failing.
- **`FallbackStrategy`**: Allows for defining fallback actions to gracefully degrade functionality when a primary operation fails.

**Example: Using the `ErrorManager` with recovery**
```typescript
import { ErrorManager, PRNError, ErrorCategory } from "./assembly/core/error-handling";

const errorManager = ErrorManager.getInstance();

// The manager is pre-configured with Retry and CircuitBreaker strategies.
// You can add your own:
// errorManager.registerStrategy(new MyCustomStrategy());

function doRiskyOperation(): void {
  // ...
  const error = new PRNError("Something went wrong", ErrorCategory.NETWORK_TIMEOUT);
  if (errorManager.handleError(error)) {
    console.log("Error was handled and recovered!");
  } else {
    console.log("Error could not be recovered.");
  }
}
```

#### `Result<T, E>`

For functions that can fail, the `Result` type provides a safe way to return either a success value (`Ok`) or an error (`Err`), avoiding the need for try-catch blocks in many cases.

**Example:**
```typescript
import { Result, PRNError } from "./assembly/core/errors";

function mightFail(shouldFail: bool): Result<string, PRNError> {
  if (shouldFail) {
    return Result.err<string, PRNError>(new PRNError("It failed"));
  }
  return Result.ok<string, PRNError>("It worked");
}

const result = mightFail(true);
if (result.isErr()) {
  const error = result.unwrapErr();
  // handle error
} else {
  const value = result.unwrap();
  // use value
}
```

---

### Plugin System (`assembly/core/plugin-system.ts`)

The plugin system allows for extending the functionality of the core library in a modular and decoupled way. It manages the lifecycle of plugins, resolves dependencies, and provides a service locator for inter-plugin communication.

#### `Plugin` Interface

The core interface that all plugins must implement. It defines the basic lifecycle methods:
- `initialize(): void`
- `start(): void`
- `stop(): void`
- `dispose(): void`

The `BasePlugin` class provides a convenient starting point for creating new plugins.

#### `PluginManager`

A global singleton (`pluginManager`) that manages all registered plugins.

**Key Methods:**
- `register(plugin: Plugin, metadata: PluginMetadata): ValidationResult`: Registers a new plugin.
- `initialize(context: PluginContext): void`: Initializes all registered plugins in the correct dependency order.
- `start(): void`: Starts all plugins.
- `stop(): void`: Stops all plugins.
- `getById(id: string): Plugin | null`: Retrieves a plugin instance by its unique ID.
- `getByCapability(capability: string): Plugin[]`: Retrieves all plugins that provide a specific capability.

**Example: Creating and registering a plugin**
```typescript
import { BasePlugin } from "./assembly/core/base-classes";
import { PluginMetadata } from "./assembly/core/base-interfaces";
import { pluginManager } from "./assembly/core/plugin-system";
import { ValidationResult } from "./assembly/core/validation";

class MyLoggingPlugin extends BasePlugin {
  constructor() {
    super("my-logger", new PluginMetadata("My Logger", "A simple logging plugin", "1.0.0"));
  }

  initialize(): void {
    console.log("Logging plugin initialized!");
  }
}

const metadata = new PluginMetadata(
  "my-logger",
  "A simple logging plugin",
  "1.0.0",
  [], // no dependencies
  ["logging"] // capabilities
);

pluginManager.register(new MyLoggingPlugin(), metadata);

// Later, when the application starts...
// pluginManager.initialize(context);
// pluginManager.start();
```

#### `ServiceLocator`

A global singleton (`serviceLocator`) that implements the Service Locator pattern. This allows plugins to register and discover services provided by other plugins without creating hard dependencies.

**Example:**
```typescript
import { serviceLocator } from "./assembly/core/plugin-system";

// Plugin A provides a service
class MyAwesomeService {
  doSomething(): string { return "done"; }
}
serviceLocator.register("AwesomeService", new MyAwesomeService());


// Plugin B uses the service
const awesomeService = serviceLocator.get<MyAwesomeService>("AwesomeService");
if (awesomeService) {
  awesomeService.doSomething();
}
```

---

### Event System (`assembly/core/event-system.ts`)

The event system provides a decoupled, event-driven architecture for communication between different parts of the library.

#### `Event`

The abstract base class for all events. Key subclasses include:
- `DataEvent<T>`: An event that carries a data payload of a generic type `T`.
- `CancellableEvent`: An event that can be cancelled by a handler to prevent further processing.

#### `EventBus`

A central dispatcher for events. A global instance is available as `globalEventBus`.

**Key Methods:**
- `emit<T extends Event>(event: T): void`: Dispatches an event to all registered listeners.
- `on<T extends Event>(type: string, handler: EventHandler<T>, priority?: EventPriority): void`: Registers an event handler.
- `once<T extends Event>(type: string, handler: EventHandler<T>, priority?: EventPriority): void`: Registers a one-time event handler.
- `off<T extends Event>(type: string, handler: EventHandler<T>): void`: Removes an event handler.

**Example:**
```typescript
import { globalEventBus, DataEvent } from "./assembly/core/event-system";

// Define a custom event
class UserLoggedInEvent extends DataEvent<string> {
  constructor(username: string) {
    super("user.loggedIn", username);
  }
}

// Register a listener
globalEventBus.on<UserLoggedInEvent>("user.loggedIn", (event) => {
  console.log(`User logged in: ${event.data}`);
});

// Emit the event
globalEventBus.emit(new UserLoggedInEvent("Alice"));
```

#### `EventChannel`

Provides a way to create a scoped event emitter that automatically prefixes event types. This is useful for creating domain-specific event channels within plugins or modules.

**Example:**
```typescript
import { createEventChannel } from "./assembly/core/event-system";

const myPluginChannel = createEventChannel("myPlugin");

myPluginChannel.on("someEvent", (event) => {
  // ... handles "myPlugin:someEvent"
});

myPluginChannel.emit(new DataEvent("someEvent", { foo: "bar" }));
```

---

*Further sections will detail the APIs of each of these core modules.*
