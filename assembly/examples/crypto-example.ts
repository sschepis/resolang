// crypto-example.ts
// Example usage of the Prime-Resonant Keytriplet cryptographic system

import { Keytriplet, PRUTCSystem } from "../crypto/keytriplet";

/**
 * Example: Basic Keytriplet Generation and Evolution
 */
export function exampleKeytripletGeneration(): void {
  console.log("=== Keytriplet Generation Example ===");
  
  // Global seed (shared across the network)
  const globalSeed = "PRIME_RESONANCE_NETWORK_2025";
  
  // Generate keytriplets for two users
  const alice = Keytriplet.generate(globalSeed, "alice@prn.network");
  const bob = Keytriplet.generate(globalSeed, "bob@prn.network");
  
  console.log("Alice's classical public key: " + alice.classicalPublicKey);
  console.log("Bob's classical public key: " + bob.classicalPublicKey);
  
  // Evolve keys over time (simulating 1 hour)
  const deltaT = 3600.0; // seconds
  alice.evolve(deltaT);
  bob.evolve(deltaT);
  
  console.log("Keys evolved for 1 hour");
}

/**
 * Example: Secure Communication using PR-UTC
 */
export function exampleSecureCommunication(): void {
  console.log("\n=== Secure Communication Example ===");
  
  // Initialize PR-UTC system with global seed
  const globalSeed = "PRIME_RESONANCE_NETWORK_2025";
  const prutc = new PRUTCSystem(globalSeed);
  
  // Register users
  const aliceId = "alice@prn.network";
  const bobId = "bob@prn.network";
  
  const aliceKey = prutc.registerUser(aliceId);
  const bobKey = prutc.registerUser(bobId);
  
  console.log("Users registered in PR-UTC system");
  
  // Establish secure session
  const sessionId = prutc.establishSession(aliceId, bobId);
  console.log("Secure session established: " + sessionId);
  
  // Alice sends a message to Bob
  const message = "Hello Bob, this is a quantum-secure message!";
  prutc.sendMessage(sessionId, aliceId, message);
  console.log("Alice sent: " + message);
  
  // Bob receives messages
  const bobMessages = prutc.receiveMessages(sessionId, bobId);
  if (bobMessages.length > 0) {
    console.log("Bob received: " + bobMessages[0]);
  } else {
    console.log("Bob: No messages yet (may need more evolution time)");
  }
}

/**
 * Example: Multi-Message Session
 */
export function exampleMultiMessageSession(): void {
  console.log("\n=== Multi-Message Session Example ===");
  
  const globalSeed = "PRIME_RESONANCE_NETWORK_2025";
  const prutc = new PRUTCSystem(globalSeed);
  
  // Register users
  const aliceId = "alice@prn.network";
  const bobId = "bob@prn.network";
  
  prutc.registerUser(aliceId);
  prutc.registerUser(bobId);
  
  // Establish session
  const sessionId = prutc.establishSession(aliceId, bobId);
  
  // Send multiple messages
  const messages = [
    "First quantum message",
    "Second secure transmission",
    "Third encoded data"
  ];
  
  for (let i = 0; i < messages.length; i++) {
    prutc.sendMessage(sessionId, aliceId, messages[i]);
    console.log("Alice sent: " + messages[i]);
  }
  
  // Bob receives all messages
  const received = prutc.receiveMessages(sessionId, bobId);
  console.log("Bob received " + received.length.toString() + " messages");
  
  for (let i = 0; i < received.length; i++) {
    console.log("  Message " + (i + 1).toString() + ": " + received[i]);
  }
}

/**
 * Example: Key Evolution and Maintenance
 */
export function exampleKeyMaintenance(): void {
  console.log("\n=== Key Evolution and Maintenance Example ===");
  
  const globalSeed = "PRIME_RESONANCE_NETWORK_2025";
  const prutc = new PRUTCSystem(globalSeed);
  
  // Register users
  const aliceId = "alice@prn.network";
  const bobId = "bob@prn.network";
  
  const aliceKey = prutc.registerUser(aliceId);
  const bobKey = prutc.registerUser(bobId);
  
  // Show initial key states
  const aliceInitial = aliceKey.getResonanceKey();
  const bobInitial = bobKey.getResonanceKey();
  
  console.log("Initial key entropy - Alice: " + aliceInitial.entropy().toString());
  console.log("Initial key entropy - Bob: " + bobInitial.entropy().toString());
  
  // Evolve all keys in the system
  const evolutionTime = 3600.0; // 1 hour
  prutc.evolveKeys(evolutionTime);
  
  // Check evolved states
  const aliceEvolved = aliceKey.getResonanceKey();
  const bobEvolved = bobKey.getResonanceKey();
  
  console.log("\nAfter 1 hour evolution:");
  console.log("Evolved key entropy - Alice: " + aliceEvolved.entropy().toString());
  console.log("Evolved key entropy - Bob: " + bobEvolved.entropy().toString());
}

/**
 * Example: Bidirectional Communication
 */
export function exampleBidirectionalComm(): void {
  console.log("\n=== Bidirectional Communication Example ===");
  
  const globalSeed = "PRIME_RESONANCE_NETWORK_2025";
  const prutc = new PRUTCSystem(globalSeed);
  
  // Register users
  const aliceId = "alice@prn.network";
  const bobId = "bob@prn.network";
  
  prutc.registerUser(aliceId);
  prutc.registerUser(bobId);
  
  // Establish session
  const sessionId = prutc.establishSession(aliceId, bobId);
  
  // Alice sends to Bob
  prutc.sendMessage(sessionId, aliceId, "Hello Bob!");
  
  // Bob receives and responds
  const bobReceived = prutc.receiveMessages(sessionId, bobId);
  if (bobReceived.length > 0) {
    console.log("Bob received: " + bobReceived[0]);
    
    // Bob sends response
    prutc.sendMessage(sessionId, bobId, "Hello Alice! Message received.");
    
    // Alice receives response
    const aliceReceived = prutc.receiveMessages(sessionId, aliceId);
    if (aliceReceived.length > 0) {
      console.log("Alice received: " + aliceReceived[0]);
    }
  }
}

/**
 * Example: Multiple Concurrent Sessions
 */
export function exampleConcurrentSessions(): void {
  console.log("\n=== Concurrent Sessions Example ===");
  
  const globalSeed = "PRIME_RESONANCE_NETWORK_2025";
  const prutc = new PRUTCSystem(globalSeed);
  
  // Register multiple users
  const users = ["alice", "bob", "charlie", "diana"];
  const userIds = new Map<string, string>();
  
  for (let i = 0; i < users.length; i++) {
    const userId = users[i] + "@prn.network";
    userIds.set(users[i], userId);
    prutc.registerUser(userId);
  }
  
  // Create multiple sessions
  const sessions = new Map<string, string>();
  
  // Alice <-> Bob
  sessions.set("alice-bob", prutc.establishSession(
    userIds.get("alice")!,
    userIds.get("bob")!
  ));
  
  // Alice <-> Charlie
  sessions.set("alice-charlie", prutc.establishSession(
    userIds.get("alice")!,
    userIds.get("charlie")!
  ));
  
  // Bob <-> Diana
  sessions.set("bob-diana", prutc.establishSession(
    userIds.get("bob")!,
    userIds.get("diana")!
  ));
  
  console.log("Created " + sessions.size.toString() + " concurrent sessions");
  
  // Send messages through different sessions
  prutc.sendMessage(
    sessions.get("alice-bob")!,
    userIds.get("alice")!,
    "Private message to Bob"
  );
  
  prutc.sendMessage(
    sessions.get("alice-charlie")!,
    userIds.get("alice")!,
    "Private message to Charlie"
  );
  
  prutc.sendMessage(
    sessions.get("bob-diana")!,
    userIds.get("bob")!,
    "Bob's message to Diana"
  );
  
  // Each user receives their messages
  const bobMessages = prutc.receiveMessages(
    sessions.get("alice-bob")!,
    userIds.get("bob")!
  );
  
  const charlieMessages = prutc.receiveMessages(
    sessions.get("alice-charlie")!,
    userIds.get("charlie")!
  );
  
  const dianaMessages = prutc.receiveMessages(
    sessions.get("bob-diana")!,
    userIds.get("diana")!
  );
  
  console.log("Bob received " + bobMessages.length.toString() + " messages");
  console.log("Charlie received " + charlieMessages.length.toString() + " messages");
  console.log("Diana received " + dianaMessages.length.toString() + " messages");
}

/**
 * Example: Error Handling
 */
export function exampleErrorHandling(): void {
  console.log("\n=== Error Handling Example ===");
  
  const globalSeed = "PRIME_RESONANCE_NETWORK_2025";
  const prutc = new PRUTCSystem(globalSeed);
  
  // Try to establish session with non-existent users
  try {
    prutc.establishSession("unknown1@prn.network", "unknown2@prn.network");
  } catch (e) {
    console.log("Expected error: Users not registered");
  }
  
  // Try to send message to non-existent session
  try {
    prutc.sendMessage("invalid-session-id", "alice@prn.network", "Test");
  } catch (e) {
    console.log("Expected error: Session not found");
  }
  
  // Register user and try valid operation
  const aliceId = "alice@prn.network";
  const bobId = "bob@prn.network";
  
  prutc.registerUser(aliceId);
  prutc.registerUser(bobId);
  
  const sessionId = prutc.establishSession(aliceId, bobId);
  console.log("Valid session created: " + sessionId);
}

/**
 * Run all examples
 */
export function runAllExamples(): void {
  exampleKeytripletGeneration();
  exampleSecureCommunication();
  exampleMultiMessageSession();
  exampleKeyMaintenance();
  exampleBidirectionalComm();
  exampleConcurrentSessions();
  exampleErrorHandling();
}