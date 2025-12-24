import { EntropyFieldData, EntropyFieldSampler, EntropyEvolutionTracker, initializeEntropyViz, getGlobalSampler, getGlobalTracker, exportEntropyData, exportEntropyHistory } from "../entropy-viz";
import { ResonantFragment, EntangledNode } from "../resolang";
import { PrimeState } from "../quantum/prime-state";
import { Quaternion, QuaternionicResonanceField } from "../quaternion";
import { Prime } from "../types";

// Helper functions for creating test data
function createMockResonantFragment(entropy: f64): ResonantFragment {
  // Minimal implementation for testing purposes
  const coeffs = new Map<Prime, f64>();
  return new ResonantFragment(coeffs, 0, 0, entropy);
}

function createMockEntangledNode(id: string, coherence: f64): EntangledNode {
  // Minimal implementation for testing purposes
  const node = new EntangledNode(id, 2, 3, 5);
  node.coherence = coherence;
  return node;
}

export function testEntropyFieldDataConstructor(): void {
  const data = new EntropyFieldData();
  assert(data.timestamp == 0, "Timestamp should be 0");
  assert(data.fragmentEntropies.size == 0, "Fragment entropies map should be empty");
  assert(data.nodeCoherences.size == 0, "Node coherences map should be empty");
  assert(data.primeAmplitudes.size == 0, "Prime amplitudes map should be empty");
  assert(data.quaternionPhases.size == 0, "Quaternion phases map should be empty");
  assert(data.fieldIntensities.length == 0, "Field intensities array should be empty");
}

export function testEntropyFieldSamplerConstructor(): void {
  const sampler = new EntropyFieldSampler();
  assert(sampler.data instanceof EntropyFieldData, "Data should be an EntropyFieldData instance");
  // Cannot directly assert sampleRate and gridSize due to private access
}

export function testEntropyFieldSamplerSampleFragment(): void {
  const sampler = new EntropyFieldSampler();
  const fragment = createMockResonantFragment(0.5);
  sampler.sampleFragment(fragment, "frag1");
  assert(sampler.data.fragmentEntropies.get("frag1") == 0.5, "Fragment entropy should be sampled");
}

export function testEntropyFieldSamplerSampleNode(): void {
  const sampler = new EntropyFieldSampler();
  const node = createMockEntangledNode("node1", 0.8);
  sampler.sampleNode(node);
  assert(sampler.data.nodeCoherences.get("node1") == 0.8, "Node coherence should be sampled");
}

export function testEntropyFieldSamplerSamplePrimeState(): void {
  const sampler = new EntropyFieldSampler();
  const amps = new Map<Prime, f64>();
  amps.set(2, 0.6);
  amps.set(3, 0.8);
  const primeState = PrimeState.fromAmplitudes(amps);
  sampler.samplePrimeState(primeState);
  assert(sampler.data.primeAmplitudes.get(2) == 0.6, "Prime amplitude for 2 should be sampled");
  assert(sampler.data.primeAmplitudes.get(3) == 0.8, "Prime amplitude for 3 should be sampled");
}

export function testEntropyFieldSamplerSampleQuaternion(): void {
  const sampler = new EntropyFieldSampler();
  const q = new Quaternion(1, 0, 0, 0); // w=1, x=0, y=0, z=0
  sampler.sampleQuaternion(q, 7);
  assert(sampler.data.quaternionPhases.get(7) == 0, "Quaternion phase should be sampled");
}

export function testEntropyFieldSamplerSampleField2D(): void {
  const sampler = new EntropyFieldSampler(0.1, 2); // 2x2 grid
  const fieldFn = (x: f64, y: f64): f64 => x + y;
  const samples = sampler.sampleField2D(fieldFn, 0, 1, 0, 1);
  assert(samples.length == 4, "Should have 4 samples for 2x2 grid");
  assert(samples[0] == 0, "Sample 0,0 should be 0");
  assert(samples[1] == 1, "Sample 1,0 should be 1");
  assert(samples[2] == 1, "Sample 0,1 should be 1");
  assert(samples[3] == 2, "Sample 1,1 should be 2");
}

export function testEntropyFieldSamplerExportData(): void {
  const sampler = new EntropyFieldSampler();
  sampler.data.timestamp = 12345;
  sampler.sampleFragment(createMockResonantFragment(0.1), "fragA");
  sampler.sampleNode(createMockEntangledNode("nodeB", 0.9));
  const amps = new Map<Prime, f64>();
  amps.set(17, 0.5);
  sampler.samplePrimeState(PrimeState.fromAmplitudes(amps));
  sampler.sampleQuaternion(new Quaternion(1, 0, 0, 0), 19);

  const json = sampler.exportData();
  assert(json.includes('"timestamp":12345'), "Exported JSON should contain timestamp");
  assert(json.includes('"fragments":{"fragA":0.1}'), "Exported JSON should contain fragment entropies");
  assert(json.includes('"nodes":{"nodeB":0.9}'), "Exported JSON should contain node coherences");
  assert(json.includes('"primes":{"17":1'), "Exported JSON should contain prime amplitudes");
  assert(json.includes('"quaternions":{"19":0'), "Exported JSON should contain quaternion phases");
  assert(json.includes('"field":[]'), "Exported JSON should contain empty field intensities");
}

export function testEntropyFieldSamplerUpdateTime(): void {
  const sampler = new EntropyFieldSampler();
  sampler.updateTime(54321);
  assert(sampler.data.timestamp == 54321, "Timestamp should be updated");
}

export function testEntropyEvolutionTrackerConstructor(): void {
  const tracker = new EntropyEvolutionTracker();
  assert(tracker.getHistory().length == 0, "History should be empty");
  // Cannot directly assert maxHistory and sampler due to private access
}

export function testEntropyEvolutionTrackerRecordState(): void {
  const tracker = new EntropyEvolutionTracker(2); // Max history 2
  const fragments = new Map<string, ResonantFragment>();
  fragments.set("frag1", createMockResonantFragment(0.1));
  const nodes = new Map<string, EntangledNode>();
  nodes.set("node1", createMockEntangledNode("node1", 0.5));
  const primeStates = [PrimeState.fromAmplitudes(new Map<Prime, f64>())];

  tracker.recordState(fragments, nodes, primeStates);
  assert(tracker.getHistory().length == 1, "History should have 1 entry");

  tracker.recordState(fragments, nodes, primeStates);
  assert(tracker.getHistory().length == 2, "History should have 2 entries");

  tracker.recordState(fragments, nodes, primeStates);
  assert(tracker.getHistory().length == 2, "History should still have 2 entries (oldest removed)");
}

export function testEntropyEvolutionTrackerGetEntropyGradient(): void {
  const tracker = new EntropyEvolutionTracker();
  const fieldFn = (x: f64, y: f64): f64 => x * x + y * y; // f(x,y) = x^2 + y^2
  const gradient = tracker.getEntropyGradient(1, 2, fieldFn); // grad(f) = (2x, 2y) = (2, 4)
  assert(Math.abs(gradient[0] - 2) < 0.001, "Gradient x should be approx 2");
  assert(Math.abs(gradient[1] - 4) < 0.001, "Gradient y should be approx 4");
}

export function testEntropyEvolutionTrackerFindCriticalPoints(): void {
  const tracker = new EntropyEvolutionTracker();
  const fieldFn = (x: f64, y: f64): f64 => (x - 0.5) * (x - 0.5) + (y - 0.5) * (y - 0.5); // Minimum at (0.5, 0.5)
  const criticalPoints = tracker.findCriticalPoints(fieldFn, 0, 1, 0, 1, 10);
  assert(criticalPoints.length > 0, "Should find at least one critical point");
  // More specific assertions would require knowing the exact output of findCriticalPoints
}

export function testEntropyEvolutionTrackerExportHistory(): void {
  const tracker = new EntropyEvolutionTracker(1);
  const fragments = new Map<string, ResonantFragment>();
  fragments.set("frag1", createMockResonantFragment(0.1));
  const nodes = new Map<string, EntangledNode>();
  nodes.set("node1", createMockEntangledNode("node1", 0.5));
  const primeStates = [PrimeState.fromAmplitudes(new Map<Prime, f64>())];
  tracker.recordState(fragments, nodes, primeStates);

  const json = tracker.exportHistory();
  assert(json.includes('{"index":0}'), "Exported history should contain index");
}

export function testGlobalFunctions(): void {
  initializeEntropyViz();
  const sampler = getGlobalSampler();
  const tracker = getGlobalTracker();

  assert(sampler instanceof EntropyFieldSampler, "Global sampler should be initialized");
  assert(tracker instanceof EntropyEvolutionTracker, "Global tracker should be initialized");

  // Test export functions
  const exportedSamplerData = exportEntropyData();
  assert(exportedSamplerData.includes('"timestamp":0'), "Exported sampler data should contain timestamp");

  const exportedTrackerHistory = exportEntropyHistory();
  assert(exportedTrackerHistory.includes('[]'), "Exported tracker history should be empty initially");
}

export function runAllEntropyVizTests(): void {
  console.log("Running entropy visualization tests...");

  testEntropyFieldDataConstructor();
  console.log("✓ testEntropyFieldDataConstructor passed");

  testEntropyFieldSamplerConstructor();
  console.log("✓ testEntropyFieldSamplerConstructor passed");

  testEntropyFieldSamplerSampleFragment();
  console.log("✓ testEntropyFieldSamplerSampleFragment passed");

  testEntropyFieldSamplerSampleNode();
  console.log("✓ testEntropyFieldSamplerSampleNode passed");

  testEntropyFieldSamplerSamplePrimeState();
  console.log("✓ testEntropyFieldSamplerSamplePrimeState passed");

  testEntropyFieldSamplerSampleQuaternion();
  console.log("✓ testEntropyFieldSamplerSampleQuaternion passed");

  testEntropyFieldSamplerSampleField2D();
  console.log("✓ testEntropyFieldSamplerSampleField2D passed");

  testEntropyFieldSamplerExportData();
  console.log("✓ testEntropyFieldSamplerExportData passed");

  testEntropyFieldSamplerUpdateTime();
  console.log("✓ testEntropyFieldSamplerUpdateTime passed");

  testEntropyEvolutionTrackerConstructor();
  console.log("✓ testEntropyEvolutionTrackerConstructor passed");

  testEntropyEvolutionTrackerRecordState();
  console.log("✓ testEntropyEvolutionTrackerRecordState passed");

  testEntropyEvolutionTrackerGetEntropyGradient();
  console.log("✓ testEntropyEvolutionTrackerGetEntropyGradient passed");

  testEntropyEvolutionTrackerFindCriticalPoints();
  console.log("✓ testEntropyEvolutionTrackerFindCriticalPoints passed");

  testEntropyEvolutionTrackerExportHistory();
  console.log("✓ testEntropyEvolutionTrackerExportHistory passed");

  testGlobalFunctions();
  console.log("✓ testGlobalFunctions passed");

  console.log("\nAll entropy visualization tests passed! ✨");
}