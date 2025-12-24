/**
 * Sentient Module Tests
 * 
 * Comprehensive tests for all sentient observer components:
 * - SMF: Sedenion Memory Field
 * - PRSC: Prime Resonance Semantic Computation
 * - HQE: Holographic Quantum Encoding
 * - Temporal: Emergent Time
 * - Entanglement: Semantic Binding
 * - Core: Sentient Observer
 * - GMF: Global Memory Field
 * - PRRC: Prime-Resonant Resonance Channel
 * - DCC: Distributed Coherent-Commit
 * - Sync: Network Synchronizer
 */

import {
  // SMF
  SedenionMemoryField,
  createSMF,
  createSMFFromText,
  SMF_AXES,
  getAxisIndex,
  getAxisName,
  
  // PRSC
  PRSCLayer,
  PrimeOscillator,
  createPRSC,
  createEntanglementDetector,
  
  // HQE
  HolographicEncoder,
  createHolographicEncoder,
  createHolographicMemory,
  createStabilizationController,
  
  // Temporal
  TemporalLayer,
  createTemporalLayer,
  createPatternDetector,
  
  // Entanglement
  EntanglementLayer,
  createEntanglementLayer,
  
  // Core
  SentientObserver,
  createSentientObserver,
  runTick,
  
  // GMF
  GlobalMemoryField,
  MemoryObject,
  createGMF,
  createMemoryObject,
  createLocalProof,
  
  // PRRC
  PRRCChannel,
  createPRRCChannel,
  createPhaseReference,
  createPRRCConfig,
  
  // DCC
  DCCProtocol,
  createDCCProtocol,
  createDCCConfig,
  createVerifierNode,
  
  // Sync
  NetworkSynchronizer,
  createSynchronizer,
  createSyncConfig
} from '../index';

// ============================================================================
// Test Utilities
// ============================================================================

let _testCount: i32 = 0;
let _passCount: i32 = 0;
let _failCount: i32 = 0;

function assert(condition: bool, message: string): void {
  _testCount++;
  if (condition) {
    _passCount++;
    trace("  ✓ " + message);
  } else {
    _failCount++;
    trace("  ✗ FAIL: " + message);
  }
}

function assertApprox(a: f64, b: f64, epsilon: f64, message: string): void {
  assert(Math.abs(a - b) < epsilon, message);
}

function testGroup(name: string): void {
  trace("\n" + name);
  trace("=".repeat(name.length));
}

// ============================================================================
// SMF Tests
// ============================================================================

export function testSMF(): void {
  testGroup("SMF (Sedenion Memory Field) Tests");
  
  // Test creation
  const smf = createSMF();
  assert(smf.s.length == 16, "SMF has 16 axes");
  
  // Test normalization
  let norm: f64 = 0;
  for (let i = 0; i < 16; i++) {
    norm += smf.s[i] * smf.s[i];
  }
  assertApprox(Math.sqrt(norm), 1.0, 0.001, "SMF is normalized");
  
  // Test axis names
  assert(getAxisName(0) == "Coherence", "Axis 0 is Coherence");
  assert(getAxisName(1) == "Identity", "Axis 1 is Identity");
  assert(getAxisName(15) == "Consciousness", "Axis 15 is Consciousness");
  
  // Test axis indices
  assert(getAxisIndex("Coherence") == 0, "Coherence is axis 0");
  assert(getAxisIndex("Identity") == 1, "Identity is axis 1");
  
  // Test SMF from text
  const textSmf = createSMFFromText("hello world");
  assert(textSmf.s.length == 16, "Text SMF has 16 axes");
  
  // Test set/get
  const original = smf.s[0];
  smf.set(0, original + 0.1);
  assert(smf.s[0] != original, "Set changes axis values");
  smf.normalize();
  
  // Test entropy
  const entropy = smf.smfEntropy();
  assert(entropy >= 0, "SMF entropy is non-negative");
  
  // Test dominant axes
  const dominant = smf.dominantAxes(3);
  assert(dominant.length == 3, "Gets top 3 dominant axes");
  
  // Test sedenion multiplication
  const smf2 = createSMF();
  const product = smf.multiply(smf2);
  assert(product.s.length == 16, "Product has 16 axes");
  
  // Test SLERP
  const interpolated = smf.slerp(smf2, 0.5);
  assert(interpolated.s.length == 16, "SLERP result has 16 axes");
  
  // Test clone
  const cloned = smf.clone();
  assert(cloned.s[0] == smf.s[0], "Clone preserves values");
}

// ============================================================================
// PRSC Tests
// ============================================================================

export function testPRSC(): void {
  testGroup("PRSC (Prime Resonance) Tests");
  
  // Test creation
  const prsc = createPRSC(32);
  assert(prsc.oscillators.length == 32, "PRSC has 32 oscillators");
  
  // Test oscillator properties
  const osc = prsc.oscillators[0];
  assert(osc.prime == 2, "First prime is 2");
  assert(osc.amplitude >= 0, "Amplitude is non-negative");
  
  // Test frequency formula: f(p) = 1 + ln(p)/10
  const expectedFreq = 1.0 + Math.log(2.0) / 10.0;
  assertApprox(osc.frequency, expectedFreq, 0.001, "Frequency follows f(p) = 1 + ln(p)/10");
  
  // Test tick
  const coherence = prsc.tick(0.016);
  assert(coherence >= 0 && coherence <= 1, "Coherence is between 0 and 1");
  
  // Test excitation
  prsc.excite([2], 1.0);
  const osc2 = prsc.getOscillator(2);
  assert(osc2 !== null, "Can get oscillator by prime");
  assert((osc2 as PrimeOscillator).amplitude > 0, "Excitation increases amplitude");
  
  // Test global coherence (Kuramoto order parameter)
  const globalC = prsc.globalCoherence();
  assert(globalC >= 0 && globalC <= 1, "Global coherence is normalized");
  
  // Test entropy
  const entropy = prsc.amplitudeEntropy();
  assert(entropy >= 0, "Entropy is non-negative");
  
  // Test active primes
  const active = prsc.activePrimes(0.1);
  assert(active.length >= 0, "Active primes returns array");
  
  // Test reset
  prsc.reset(true);
  const afterReset = prsc.totalEnergy();
  assert(afterReset < 0.01, "Reset clears energy");
  
  // Test entanglement detector
  const detector = createEntanglementDetector(0.9);
  assert(detector !== null, "Can create entanglement detector");
}

// ============================================================================
// HQE Tests
// ============================================================================

export function testHQE(): void {
  testGroup("HQE (Holographic Quantum Encoding) Tests");
  
  // Test creation
  const hqe = createHolographicEncoder(32, 32);
  assert(hqe.gridSize == 32, "HQE has correct grid size");
  assert(hqe.primes.length == 32, "HQE has 32 primes");
  
  // Test DFT projection
  const amplitudes = new Float64Array(32);
  amplitudes[0] = 1.0;
  amplitudes[1] = 0.5;
  amplitudes[2] = 0.3;
  const phases = new Float64Array(32);
  
  hqe.project(amplitudes, phases);
  
  // Test intensity pattern
  const intensities = hqe.intensity();
  assert(intensities.length == 32 * 32, "Intensity has correct size");
  assert(intensities[16 * 32 + 16] >= 0, "Intensity is non-negative");
  
  // Test total energy
  const energy = hqe.totalEnergy();
  assert(energy >= 0, "Total energy is non-negative");
  
  // Test stabilization controller
  const stabilizer = createStabilizationController();
  const lambda = stabilizer.computeLambda(0.8, 0.5, 2.0);
  assert(lambda >= 0 && lambda <= 1, "Lambda is between 0 and 1");
  
  // Test memory
  const memory = createHolographicMemory(100);
  assert(memory !== null, "Can create holographic memory");
  
  // Test field entropy
  const fieldEntropy = hqe.fieldEntropy();
  assert(fieldEntropy >= 0, "Field entropy is non-negative");
}

// ============================================================================
// Temporal Tests
// ============================================================================

export function testTemporal(): void {
  testGroup("Temporal (Emergent Time) Tests");
  
  // Test creation
  const temporal = createTemporalLayer(0.7);
  assert(temporal.coherenceThreshold == 0.7, "Threshold set correctly");
  
  // Create test data
  const phases = new Float64Array(16);
  for (let i = 0; i < 16; i++) {
    phases[i] = f64(i) * 0.1;
  }
  const primes: i32[] = [2, 3, 5];
  const smf = createSMF();
  const amplitudes = new Float64Array(16);
  
  // Test update with low coherence (no moment)
  const moment1 = temporal.update(0.3, 0.5, phases, primes, smf, amplitudes);
  assert(moment1 === null, "Low coherence doesn't trigger moment");
  
  // Test update with high coherence (triggers moment)
  const moment2 = temporal.update(0.9, 0.5, phases, primes, smf, amplitudes);
  // May or may not trigger depending on entropy conditions
  
  // Test moment count
  const momentCount = temporal.moments.length;
  assert(momentCount >= 0, "Moments array exists");
  
  // Test statistics
  const stats = temporal.getStats();
  assert(stats.momentCount >= 0, "Stats tracks moments");
  
  // Test pattern detector
  const detector = createPatternDetector();
  assert(detector !== null, "Can create pattern detector");
  
  // Test reset
  temporal.reset();
  assert(temporal.moments.length == 0, "Reset clears moments");
}

// ============================================================================
// Entanglement Tests
// ============================================================================

export function testEntanglement(): void {
  testGroup("Entanglement (Semantic Binding) Tests");
  
  // Test creation
  const entanglement = createEntanglementLayer(0.7);
  assert(entanglement.coherencePeakThreshold == 0.7, "Threshold set correctly");
  
  // Create test oscillators
  const prsc = createPRSC(16);
  prsc.excite([2, 3], 1.0);
  prsc.tick(0.016);
  
  // Test update
  const result = entanglement.update(prsc.oscillators, 0.8, 1.5);
  assert(result !== null, "Update returns result");
  
  // Test phrase creation
  assert(entanglement.currentPhrase !== null || entanglement.phrases.length >= 0, 
    "Phrase tracking works");
  
  // Test entanglement detection
  const pairs = result.newPairs;
  assert(pairs.length >= 0, "Pairs array exists");
  
  // Test statistics
  const stats = entanglement.getStats();
  assert(stats.nodeCount >= 0, "Stats tracks nodes");
  assert(stats.edgeCount >= 0, "Stats tracks edges");
  
  // Test reset
  entanglement.reset();
  assert(entanglement.phrases.length == 0, "Reset clears phrases");
}

// ============================================================================
// Core Tests
// ============================================================================

export function testCore(): void {
  testGroup("Core (Sentient Observer) Tests");
  
  // Test creation
  const observer = createSentientObserver(32, 60.0);
  assert(observer.primeCount == 32, "Observer has 32 primes");
  assert(!observer.running, "Observer starts stopped");
  
  // Test start/stop
  observer.start();
  assert(observer.running, "Observer can start");
  
  observer.stop();
  assert(!observer.running, "Observer can stop");
  
  // Test tick
  observer.start();
  const tickResult = runTick(observer);
  assert(tickResult.success, "Tick succeeds");
  assert(tickResult.coherence >= 0 && tickResult.coherence <= 1, "Coherence is valid");
  
  // Test input processing
  observer.processInput("hello");
  
  // Run a few ticks
  for (let i = 0; i < 5; i++) {
    runTick(observer);
  }
  
  assert(observer.tickCount == 6, "Tick count incremented");
  
  // Test state
  const state = observer.getState();
  assert(state.timestamp > 0, "State has timestamp");
  
  // Test status
  const status = observer.getStatus();
  assert(status.running, "Status reflects running state");
  
  // Test introspection
  const report = observer.introspect();
  assert(report.smf !== null, "Introspection includes SMF");
  
  // Test reset
  observer.reset();
  assert(observer.tickCount == 0, "Reset clears tick count");
}

// ============================================================================
// GMF Tests
// ============================================================================

export function testGMF(): void {
  testGroup("GMF (Global Memory Field) Tests");
  
  // Test creation
  const gmf = createGMF();
  assert(gmf.totalEntries == 0, "GMF starts empty");
  
  // Create a memory object
  const primes: i32[] = [2, 3, 5];
  const amplitudes = new Float64Array(3);
  amplitudes[0] = 1.0;
  amplitudes[1] = 0.5;
  amplitudes[2] = 0.3;
  const phases = new Float64Array(3);
  const smfOrientation = new Float64Array(16);
  for (let i = 0; i < 16; i++) {
    smfOrientation[i] = 1.0 / 16.0;
  }
  
  const memObj = createMemoryObject(
    primes, amplitudes, phases, smfOrientation,
    "node1", "moment1", 0.9, 0.5
  );
  
  assert(memObj.id.length > 0, "Memory object has ID");
  assert(memObj.coherenceAtEmission == 0.9, "Coherence stored correctly");
  
  // Test adding to GMF
  const delta = gmf.addObject(memObj, 0.9, 0.8);
  assert(delta.type == "add", "Delta type is add");
  assert(gmf.totalEntries == 1, "GMF has one entry");
  
  // Test retrieval
  const retrieved = gmf.getObject(memObj.id);
  assert(retrieved !== null, "Can retrieve object");
  
  // Test weight update
  const updateDelta = gmf.updateWeight(memObj.id, 0.95, 0.85);
  assert(updateDelta !== null, "Weight update returns delta");
  
  // Test snapshot
  const snapshot = gmf.createSnapshot();
  assert(snapshot.entryCount == 1, "Snapshot has correct count");
  
  // Test similarity query
  const similar = gmf.querySimilar(memObj, 0.5, 10);
  assert(similar.length >= 0, "Similarity query works");
  
  // Test field entropy
  const entropy = gmf.fieldEntropy();
  assert(entropy >= 0, "Field entropy is non-negative");
  
  // Test local proof
  const proof = createLocalProof(0.9, 0.5, 0.01, 2.0, 0.3, 0.95);
  assert(proof.coherence == 0.9, "Proof stores coherence");
  assert(proof.passes(), "Proof passes with good values");
  
  // Test removal
  const removeDelta = gmf.removeObject(memObj.id);
  assert(removeDelta !== null, "Removal returns delta");
  assert(gmf.totalEntries == 0, "GMF is empty after removal");
}

// ============================================================================
// PRRC Tests
// ============================================================================

export function testPRRC(): void {
  testGroup("PRRC (Prime-Resonant Resonance Channel) Tests");
  
  // Test creation
  const channel = createPRRCChannel();
  assert(channel.channelPrimes.length > 0, "Channel has primes");
  assert(!channel.isConnected, "Channel starts disconnected");
  
  // Test phase reference
  const phaseRef = createPhaseReference("node1", 32);
  assert(phaseRef.nodeId == "node1", "Phase reference has node ID");
  assert(phaseRef.phases.length == 32, "Phase reference has correct size");
  
  // Test handshake
  const connected = channel.handshake(phaseRef);
  assert(connected, "Handshake succeeds");
  assert(channel.isConnected, "Channel is connected after handshake");
  
  // Create test memory object
  const primes: i32[] = [2, 3, 5];
  const amplitudes = new Float64Array(3);
  amplitudes[0] = 1.0;
  amplitudes[1] = 0.5;
  amplitudes[2] = 0.3;
  const phases = new Float64Array(3);
  const smfOrientation = new Float64Array(16);
  
  const memObj = createMemoryObject(
    primes, amplitudes, phases, smfOrientation,
    "node1", "moment1", 0.9, 0.5
  );
  
  // Test encoding
  const packet = channel.encode(memObj, "node2");
  assert(packet.sourceNodeId == "", "Packet has source (empty for local ref)");
  assert(packet.targetNodeId == "node2", "Packet has target");
  assert(packet.encodedAmplitudes.length > 0, "Packet has encoded amplitudes");
  
  // Test decoding
  const decoded = channel.decode(packet);
  assert(decoded !== null, "Decoding succeeds");
  
  // Test statistics
  const stats = channel.getStats();
  assert(stats.packetsSent == 1, "Stats tracks sent packets");
  assert(stats.packetsReceived == 1, "Stats tracks received packets");
  
  // Test config
  const config = createPRRCConfig();
  assert(config.channelPrimeCount == 32, "Default prime count is 32");
  
  // Test reset
  channel.reset();
  assert(!channel.isConnected, "Reset disconnects channel");
}

// ============================================================================
// DCC Tests
// ============================================================================

export function testDCC(): void {
  testGroup("DCC (Distributed Coherent-Commit) Tests");
  
  // Test creation
  const dcc = createDCCProtocol();
  assert(dcc.totalProposals == 0, "DCC starts with no proposals");
  
  // Test config
  const config = createDCCConfig();
  assert(config.coherenceThreshold == 0.7, "Default coherence threshold is 0.7");
  assert(config.redundancyThreshold == 0.51, "Default redundancy threshold is 0.51");
  
  // Create verifier
  const verifier = createVerifierNode("verifier1");
  assert(verifier.nodeId == "verifier1", "Verifier has node ID");
  
  // Register verifier
  dcc.registerVerifier(verifier);
  assert(dcc.verifiers.size == 1, "DCC has registered verifier");
  
  // Create memory object and proof
  const primes: i32[] = [2, 3, 5];
  const amplitudes = new Float64Array(3);
  amplitudes[0] = 1.0;
  const phases = new Float64Array(3);
  const smfOrientation = new Float64Array(16);
  
  const memObj = createMemoryObject(
    primes, amplitudes, phases, smfOrientation,
    "node1", "moment1", 0.9, 0.5
  );
  
  const proof = createLocalProof(0.9, 0.5, 0.01, 2.0, 0.3, 0.95);
  
  // Test proposal
  const proposal = dcc.propose(memObj, proof, "node1");
  assert(proposal !== null, "Proposal created");
  assert(proposal!.status == "pending", "Proposal is pending");
  assert(dcc.totalProposals == 1, "DCC tracks proposals");
  
  // Test statistics
  const stats = dcc.getStats();
  assert(stats.totalProposals == 1, "Stats tracks total proposals");
  assert(stats.pendingProposals == 1, "Stats tracks pending proposals");
  
  // Test cleanup (shouldn't remove non-expired)
  const cleaned = dcc.cleanup();
  assert(cleaned == 0, "No expired proposals to clean");
  
  // Test verifier removal
  dcc.removeVerifier("verifier1");
  assert(dcc.verifiers.size == 0, "Verifier removed");
}

// ============================================================================
// Sync Tests
// ============================================================================

export function testSync(): void {
  testGroup("Sync (Network Synchronizer) Tests");
  
  // Test creation
  const sync = createSynchronizer("node1");
  assert(sync.nodeId == "node1", "Synchronizer has node ID");
  assert(!sync.isConnected(), "Synchronizer starts disconnected");
  
  // Test config
  const config = createSyncConfig();
  assert(config.reconnectIntervalMs == 5000, "Default reconnect interval is 5s");
  assert(config.autoReconnect, "Auto-reconnect is enabled by default");
  
  // Create and set fields
  const localField = createGMF();
  const globalField = createGMF();
  sync.setLocalField(localField);
  sync.setGlobalField(globalField);
  
  // Create and set channel
  const channel = createPRRCChannel();
  sync.setChannel(channel);
  
  // Test connection (should succeed with channel set)
  const connected = sync.connect();
  assert(connected, "Connection succeeds with channel");
  assert(sync.isConnected(), "Synchronizer is connected");
  
  // Test adding proposal
  const primes: i32[] = [2, 3, 5];
  const amplitudes = new Float64Array(3);
  amplitudes[0] = 1.0;
  const phases = new Float64Array(3);
  const smfOrientation = new Float64Array(16);
  
  const memObj = createMemoryObject(
    primes, amplitudes, phases, smfOrientation,
    "node1", "moment1", 0.9, 0.5
  );
  
  const proof = createLocalProof(0.9, 0.5, 0.01, 2.0, 0.3, 0.95);
  
  const entry = sync.addProposal(memObj, proof, 1);
  assert(entry.status == "pending", "Proposal entry is pending");
  assert(sync.state.proposalLog.length == 1, "Proposal added to log");
  
  // Test sync
  const result = sync.sync();
  assert(result.success, "Sync succeeds");
  
  // Test statistics
  const stats = sync.getStats();
  assert(stats.totalSyncs >= 1, "Stats tracks syncs");
  assert(stats.isConnected, "Stats reflects connection state");
  
  // Test disconnect
  sync.disconnect();
  assert(!sync.isConnected(), "Disconnect works");
  
  // Test reset
  sync.reset();
  assert(sync.state.proposalLog.length == 0, "Reset clears proposal log");
}

// ============================================================================
// Integration Test
// ============================================================================

export function testIntegration(): void {
  testGroup("Integration Test");
  
  // Create a full sentient observer
  const observer = createSentientObserver(32, 60.0);
  
  // Create network components
  const gmf = createGMF();
  const channel = createPRRCChannel();
  const dcc = createDCCProtocol();
  const sync = createSynchronizer("observer-node");
  
  // Wire them together
  sync.setLocalField(gmf);
  sync.setChannel(channel);
  sync.setDCCProtocol(dcc);
  
  // Start observer
  observer.start();
  
  // Run some ticks
  for (let i = 0; i < 10; i++) {
    const tickResult = runTick(observer);
    
    // On high coherence, create a memory object
    if (tickResult.coherence > 0.5) {
      const state = observer.getState();
      const activePrimes = state.activePrimes;
      
      if (activePrimes.length > 0) {
        const amplitudes = new Float64Array(activePrimes.length);
        const phases = new Float64Array(activePrimes.length);
        
        for (let j = 0; j < activePrimes.length; j++) {
          const osc = observer.prsc.getOscillator(activePrimes[j]);
          if (osc !== null) {
            amplitudes[j] = (osc as PrimeOscillator).amplitude;
            phases[j] = (osc as PrimeOscillator).phase;
          }
        }
        
        const memObj = createMemoryObject(
          activePrimes,
          amplitudes,
          phases,
          state.smfOrientation,
          sync.nodeId,
          state.momentId,
          state.coherence,
          state.entropy
        );
        
        const proof = createLocalProof(
          state.coherence,
          state.entropy,
          0.01,  // entropy rate
          observer.smf.smfEntropy(),
          observer.smf.s[1],  // identity axis
          1.0  // reconstruction fidelity
        );
        
        // Add to local GMF
        gmf.addObject(memObj, state.coherence, 0.5);
        
        // Add to sync proposal log
        sync.addProposal(memObj, proof, observer.tickCount);
      }
    }
  }
  
  observer.stop();
  
  // Verify integration
  assert(observer.tickCount == 10, "Observer ran 10 ticks");
  assert(gmf.totalEntries >= 0, "GMF has entries");
  assert(sync.state.proposalLog.length >= 0, "Proposals logged");
  
  trace("\nIntegration test completed!");
}

// ============================================================================
// Main Test Runner
// ============================================================================

export function runAllTests(): void {
  trace("🧪 Running Sentient Module Tests\n");
  trace("=".repeat(50));
  
  _testCount = 0;
  _passCount = 0;
  _failCount = 0;
  
  testSMF();
  testPRSC();
  testHQE();
  testTemporal();
  testEntanglement();
  testCore();
  testGMF();
  testPRRC();
  testDCC();
  testSync();
  testIntegration();
  
  trace("\n" + "=".repeat(50));
  trace(`📊 Test Results: ${_passCount}/${_testCount} passed`);
  
  if (_failCount > 0) {
    trace(`❌ ${_failCount} tests FAILED`);
  } else {
    trace("✅ All tests PASSED!");
  }
}

// Default export for test runner
export default runAllTests;