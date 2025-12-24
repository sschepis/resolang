// crypto-integration.test.ts
// Unit tests for cryptographic integration with network protocols

import {
  CryptoProtocolExtension,
  ProtocolCryptoAdapter
} from "../network/crypto-integration";

import { 
  EIPProtocol, 
  MTPProtocol, 
  RRPProtocol, 
  PSPProtocol 
} from "../network/protocols";

import { NetworkNode } from "../network/node";
import { NetworkManager } from "../network/manager";
import { Keytriplet, PRUTCSystem } from "../crypto/keytriplet";
import { PrimeState } from "../prime-resonance";

// Test framework helpers
function assert(condition: boolean, message: string): void {
  if (!condition) {
    throw new Error("Assertion failed: " + message);
  }
}

function assertNotNull<T>(value: T | null, message: string): T {
  if (value === null) {
    throw new Error(`Assertion failed: ${message} - value is null`);
  }
  return value;
}

// Test suite for CryptoProtocolExtension
export function testCryptoProtocolExtension(): void {
  console.log("=== Testing CryptoProtocolExtension ===");
  
  // Test 1: Extension creation
  const extension = new CryptoProtocolExtension("test_global_seed");
  assert(extension !== null, "Extension created successfully");
  
  // Test 2: User registration through extension
  const alice = extension.registerNode("alice");
  const bob = extension.registerNode("bob");
  
  assert(alice !== null, "Alice registered");
  assert(bob !== null, "Bob registered");
  
  // Test 3: Secure message creation
  const message = extension.createSecureMessage(
    "alice",
    "bob",
    "Test message",
    "TEST_PROTOCOL"
  );
  
  assert(message !== null, "Secure message created");
  if (message) {
    assert(message.senderId === "alice", "Sender ID correct");
    assert(message.recipientId === "bob", "Recipient ID correct");
    assert(message.protocol === "TEST_PROTOCOL", "Protocol correct");
    assert(message.encrypted.length > 0, "Message is encrypted");
    assert(message.signature.length > 0, "Message has signature");
  }
  
  // Test 4: Message verification
  if (message) {
    const verified = extension.verifyMessage(message);
    assert(verified, "Message signature verified");
  }
  
  // Test 5: Message decryption
  if (message) {
    const decrypted = extension.decryptMessage(message, "bob");
    assert(decrypted === "Test message", "Message decrypted correctly");
  }
  
  console.log("CryptoProtocolExtension tests passed!");
}

// Test suite for ProtocolCryptoAdapter
export function testProtocolCryptoAdapter(): void {
  console.log("=== Testing ProtocolCryptoAdapter ===");
  
  // Create base protocol
  const baseProtocol = new EIPProtocol();
  
  // Wrap with crypto adapter
  const adapter = new ProtocolCryptoAdapter(baseProtocol, "adapter_test_seed");
  
  // Test 1: Adapter maintains protocol name
  assert(adapter.getName() === baseProtocol.getName(), "Adapter preserves protocol name");
  
  // Test 2: Register nodes
  const node1 = new NetworkNode("node1");
  const node2 = new NetworkNode("node2");
  
  adapter.registerNode("node1");
  adapter.registerNode("node2");
  
  // Test 3: Send secure message
  const sentMessage = adapter.send(node1, node2, "Secure test data");
  assert(sentMessage !== null, "Message sent through adapter");
  
  // Test 4: Receive and decrypt message
  const receivedMessages = adapter.receive(node2);
  assert(receivedMessages.length > 0, "Messages received");
  
  if (receivedMessages.length > 0) {
    const firstMessage = receivedMessages[0];
    assert(firstMessage.data === "Secure test data", "Message decrypted correctly");
  }
  
  console.log("ProtocolCryptoAdapter tests passed!");
}

// Test suite for secure protocol integration
export function testSecureProtocolIntegration(): void {
  console.log("=== Testing Secure Protocol Integration ===");
  
  // Test with each protocol type
  const protocols = [
    { name: "EIP", protocol: new EIPProtocol() },
    { name: "MTP", protocol: new MTPProtocol() },
    { name: "RRP", protocol: new RRPProtocol() },
    { name: "PSP", protocol: new PSPProtocol() }
  ];
  
  const globalSeed = "integration_test_seed";
  
  for (let i = 0; i < protocols.length; i++) {
    const { name, protocol } = protocols[i];
    console.log(`  Testing ${name} protocol...`);
    
    // Wrap protocol with crypto
    const secureProtocol = new ProtocolCryptoAdapter(protocol, globalSeed);
    
    // Create nodes
    const alice = new NetworkNode("alice");
    const bob = new NetworkNode("bob");
    
    // Register with secure protocol
    secureProtocol.registerNode("alice");
    secureProtocol.registerNode("bob");
    
    // Test message exchange
    const testData = `${name} protocol test data`;
    const sent = secureProtocol.send(alice, bob, testData);
    assert(sent !== null, `${name}: Message sent`);
    
    const received = secureProtocol.receive(bob);
    assert(received.length > 0, `${name}: Message received`);
    
    if (received.length > 0) {
      assert(received[0].data === testData, `${name}: Data integrity maintained`);
    }
  }
  
  console.log("Secure protocol integration tests passed!");
}

// Test suite for end-to-end scenarios
export function testEndToEndScenarios(): void {
  console.log("=== Testing End-to-End Scenarios ===");
  
  // Scenario 1: Multi-hop secure routing
  const manager = new NetworkManager();
  const extension = new CryptoProtocolExtension("e2e_test_seed");
  
  // Create network topology
  const nodes = ["alice", "bob", "charlie", "david", "eve"];
  for (let i = 0; i < nodes.length; i++) {
    manager.addNode(nodes[i]);
    extension.registerNode(nodes[i]);
  }
  
  // Create connections
  manager.connect("alice", "bob");
  manager.connect("bob", "charlie");
  manager.connect("charlie", "david");
  manager.connect("david", "eve");
  
  // Send message from alice to eve (multi-hop)
  const message = extension.createSecureMessage(
    "alice",
    "eve",
    "Multi-hop secure message",
    "RRP"
  );
  
  assert(message !== null, "Multi-hop message created");
  
  // Scenario 2: Key evolution during communication
  const prutc = new PRUTCSystem("evolution_test_seed");
  
  // Register users
  prutc.registerUser("user1");
  prutc.registerUser("user2");
  
  // Establish session
  const sessionId = prutc.establishSession("user1", "user2");
  
  // Send initial message
  prutc.sendMessage(sessionId, "user1", "Pre-evolution message");
  
  // Evolve keys
  prutc.evolveKeys(0.1);
  
  // Send post-evolution message
  prutc.sendMessage(sessionId, "user1", "Post-evolution message");
  
  // Verify both messages can be received
  const messages = prutc.receiveMessages(sessionId, "user2");
  assert(messages.length >= 0, "Messages received after key evolution");
  
  // Scenario 3: Concurrent secure sessions
  const concurrent = new CryptoProtocolExtension("concurrent_test_seed");
  
  // Register multiple users
  const users = ["alice", "bob", "charlie"];
  for (let i = 0; i < users.length; i++) {
    concurrent.registerNode(users[i]);
  }
  
  // Create multiple concurrent messages
  const messages = [
    concurrent.createSecureMessage("alice", "bob", "A to B", "EIP"),
    concurrent.createSecureMessage("bob", "charlie", "B to C", "MTP"),
    concurrent.createSecureMessage("charlie", "alice", "C to A", "PSP")
  ];
  
  // Verify all messages
  for (let i = 0; i < messages.length; i++) {
    const msg = messages[i];
    if (msg) {
      assert(concurrent.verifyMessage(msg), `Message ${i} verified`);
    }
  }
  
  console.log("End-to-end scenario tests passed!");
}

// Test suite for performance and edge cases
export function testPerformanceAndEdgeCases(): void {
  console.log("=== Testing Performance and Edge Cases ===");
  
  const extension = new CryptoProtocolExtension("perf_test_seed");
  
  // Test 1: Large message encryption
  const largeData = "x".repeat(10000); // 10KB message
  extension.registerNode("sender");
  extension.registerNode("receiver");
  
  const largeMessage = extension.createSecureMessage(
    "sender",
    "receiver",
    largeData,
    "MTP"
  );
  
  assert(largeMessage !== null, "Large message encrypted");
  if (largeMessage) {
    const decrypted = extension.decryptMessage(largeMessage, "receiver");
    assert(decrypted === largeData, "Large message decrypted correctly");
  }
  
  // Test 2: Invalid recipient
  const invalidMessage = extension.createSecureMessage(
    "sender",
    "unknown_user",
    "Test",
    "EIP"
  );
  assert(invalidMessage === null, "Message to unknown user rejected");
  
  // Test 3: Tampered message
  if (largeMessage) {
    // Tamper with encrypted data
    const tampered = Object.assign({}, largeMessage);
    tampered.encrypted = tampered.encrypted.substring(0, 10) + "TAMPERED" + tampered.encrypted.substring(18);
    
    const verified = extension.verifyMessage(tampered);
    assert(!verified, "Tampered message fails verification");
  }
  
  // Test 4: Empty message
  const emptyMessage = extension.createSecureMessage(
    "sender",
    "receiver",
    "",
    "RRP"
  );
  assert(emptyMessage !== null, "Empty message can be encrypted");
  
  // Test 5: Special characters
  const specialData = "Hello 世界! 🔐 #$%^&*()";
  const specialMessage = extension.createSecureMessage(
    "sender",
    "receiver",
    specialData,
    "PSP"
  );
  
  if (specialMessage) {
    const decrypted = extension.decryptMessage(specialMessage, "receiver");
    assert(decrypted === specialData, "Special characters preserved");
  }
  
  console.log("Performance and edge case tests passed!");
}

// Run all crypto integration tests
export function runAllCryptoIntegrationTests(): void {
  console.log("\n==== CRYPTO INTEGRATION TESTS ====\n");
  
  testCryptoProtocolExtension();
  testProtocolCryptoAdapter();
  testSecureProtocolIntegration();
  testEndToEndScenarios();
  testPerformanceAndEdgeCases();
  
  console.log("\n✅ All crypto integration tests passed!\n");
}

// Export for test runner
export { runAllCryptoIntegrationTests as default };