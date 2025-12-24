import {
  ResonantFragment,
  EntangledNode,
  TeleportationChannel,
  Attractor,
  setCurrentNode,
  currentNode,
  PI,
} from "../resolang";
import { arrayEquals } from "../core/arrays";

// Helper function to create a simple EntangledNode for testing
function createSimpleNode(id: string, coherence: f64 = 0.5): EntangledNode {
  const node = new EntangledNode(id, 2, 3, 5);
  node.coherence = coherence;
  node.phaseRing = [0.1, 0.2, 0.3];
  return node;
}

// Helper function to create a simple ResonantFragment for testing
function createSimpleFragment(entropy: f64 = 0.5): ResonantFragment {
  const coeffs = new Map<u32, f64>();
  coeffs.set(7, 0.5);
  coeffs.set(11, 0.5);
  return new ResonantFragment(coeffs, 1.0, 2.0, entropy);
}

export function testResonantFragmentConstructor(): void {
  const coeffs = new Map<u32, f64>();
  coeffs.set(2, 0.5);
  coeffs.set(3, 0.5);
  const fragment = new ResonantFragment(coeffs, 1.0, 2.0, 0.1);

  assert(fragment.coeffs.has(2), "Fragment should have coefficient for prime 2");
  assert(fragment.coeffs.get(3) == 0.5, "Fragment should have correct coefficient for prime 3");
  assert(fragment.center[0] == 1.0, "Fragment center X should be correct");
  assert(fragment.center[1] == 2.0, "Fragment center Y should be correct");
  assert(fragment.entropy == 0.1, "Fragment entropy should be correct");
}

export function testResonantFragmentEncode(): void {
  const pattern = "test";
  const fragment = ResonantFragment.encode(pattern);

  assert(fragment.coeffs.size > 0, "Encoded fragment should have coefficients");
  assert(fragment.entropy > 0, "Encoded fragment should have positive entropy");
  assert(fragment.center[0] > 0, "Encoded fragment center X should be positive");
  assert(fragment.center[1] > 0, "Encoded fragment center Y should be positive");
}

export function testResonantFragmentToJSON(): void {
  const fragment = createSimpleFragment();
  const json = fragment.toJSON();
  assert(json.includes('"entropy":0.5'), "JSON should contain entropy");
  assert(json.includes('"center":[1.0,2.0]'), "JSON should contain center");
  assert(json.includes('"coeffs":{"7":0.5,"11":0.5}'), "JSON should contain coefficients");
}

export function testResonantFragmentToString(): void {
  const fragment = createSimpleFragment();
  const str = fragment.toString();
  assert(str.includes('"entropy":0.5'), "String should contain entropy");
}

export function testEntangledNodeConstructor(): void {
  const node = new EntangledNode("node1", 2, 3, 5);
  assert(node.id == "node1", "Node ID should be correct");
  assert(node.pri[0] == 2, "Node pri[0] should be correct");
  assert(node.coherence == 0.0, "Initial coherence should be 0.0");
  assert(node.phaseRing.length == 0, "Initial phase ring should be empty");
}

export function testEntangledNodeGenerateNode(): void {
  const node = EntangledNode.generateNode(7, 11, 13);
  assert(node.id.startsWith("Node_"), "Generated node ID should start with 'Node_'");
  assert(node.pri[0] == 7, "Generated node pri[0] should be correct");
  assert(node.coherence > 0.0, "Generated node coherence should be positive");
  assert(node.phaseRing.length == 3, "Generated node phase ring should have 3 elements");
}

export function testEntangledNodeToJSON(): void {
  const node = createSimpleNode("node1", 0.7);
  const json = node.toJSON();
  assert(json.includes('"id":"node1"'), "JSON should contain ID");
  assert(json.includes('"pri":[2,3,5]'), "JSON should contain pri");
  assert(json.includes('"coherence":0.7'), "JSON should contain coherence");
}

export function testEntangledNodeToString(): void {
  const node = createSimpleNode("node1", 0.7);
  const str = node.toString();
  assert(str.includes('"id":"node1"'), "String should contain ID");
}

export function testTeleportationChannelConstructor(): void {
  const sourceNode = createSimpleNode("source");
  const targetNode = createSimpleNode("target");
  const fragment = createSimpleFragment();
  const channel = new TeleportationChannel(sourceNode, targetNode, 0.9, fragment);

  assert(channel.source.id == "source", "Channel source ID should be correct");
  assert(channel.target.id == "target", "Channel target ID should be correct");
  assert(channel.strength == 0.9, "Channel strength should be correct");
  assert(channel.holographicMemory.entropy == 0.5, "Channel memory entropy should be correct");
}

export function testTeleportationChannelToJSON(): void {
  const sourceNode = createSimpleNode("source");
  const targetNode = createSimpleNode("target");
  const fragment = createSimpleFragment();
  const channel = new TeleportationChannel(sourceNode, targetNode, 0.9, fragment);
  const json = channel.toJSON();
  assert(json.includes('"source":'), "JSON should contain source node");
  assert(json.includes('"target":'), "JSON should contain target node");
  assert(json.includes('"strength":0.9'), "JSON should contain strength");
  assert(json.includes('"holographicMemory":'), "JSON should contain holographic memory");
}

export function testTeleportationChannelToString(): void {
  const sourceNode = createSimpleNode("source");
  const targetNode = createSimpleNode("target");
  const fragment = createSimpleFragment();
  const channel = new TeleportationChannel(sourceNode, targetNode, 0.9, fragment);
  const str = channel.toString();
  assert(str.includes('"strength":0.9'), "String should contain strength");
}

export function testSetCurrentNode(): void {
  const node = createSimpleNode("current");
  setCurrentNode(node);
  assert(currentNode != null, "currentNode should not be null after setting");
  assert(currentNode!.id == "current", "currentNode ID should be correct");

  setCurrentNode(null);
  assert(currentNode == null, "currentNode should be null after setting to null");
}

export function testAttractorConstructor(): void {
  const primes = new Array<u32>();
  primes.push(2);
  primes.push(3);
  primes.push(5);
  const phases = [0.1, 0.2, 0.3];
  const attractor = new Attractor("UNITY", primes, phases, 0.8);
  assert(attractor.symbol == "UNITY", "Attractor symbol should be correct");
  assert(attractor.primes.length == 3, "Attractor primes length should be correct");
  assert(attractor.targetPhase.length == 3, "Attractor targetPhase length should be correct");
  assert(attractor.coherence == 0.8, "Attractor coherence should be correct");
}

export function testAttractorCreate(): void {
  const attractor = Attractor.create("Harmony", 0.9);
  assert(attractor.symbol == "Harmony", "Created attractor symbol should be correct");
  assert(attractor.primes.length > 0, "Created attractor should have primes");
  assert(attractor.targetPhase.length > 0, "Created attractor should have target phases");
  assert(attractor.coherence == 0.9, "Created attractor coherence should be correct");
}

export function testAttractorToJSON(): void {
  const primes = new Array<u32>();
  primes.push(2);
  primes.push(3);
  primes.push(5);
  const phases = [0.1, 0.2, 0.3];
  const attractor = new Attractor("UNITY", primes, phases, 0.8);
  const json = attractor.toJSON();
  assert(json.includes('"symbol":"UNITY"'), "JSON should contain symbol");
  assert(json.includes('"coherence":0.8'), "JSON should contain coherence");
  assert(json.includes('"primes":[2,3,5]'), "JSON should contain primes");
  assert(json.includes('"targetPhase":[0.1,0.2,0.3]'), "JSON should contain targetPhase");
}

export function testAttractorToString(): void {
  const primes = new Array<u32>();
  primes.push(2);
  primes.push(3);
  primes.push(5);
  const phases = [0.1, 0.2, 0.3];
  const attractor = new Attractor("UNITY", primes, phases, 0.8);
  const str = attractor.toString();
  assert(str.includes('"symbol":"UNITY"'), "String should contain symbol");
}

export function runAllResoLangTests(): void {
  console.log("Running ResoLang tests...");

  testResonantFragmentConstructor();
  console.log("✓ testResonantFragmentConstructor passed");

  testResonantFragmentEncode();
  console.log("✓ testResonantFragmentEncode passed");

  testResonantFragmentToJSON();
  console.log("✓ testResonantFragmentToJSON passed");

  testResonantFragmentToString();
  console.log("✓ testResonantFragmentToString passed");

  testEntangledNodeConstructor();
  console.log("✓ testEntangledNodeConstructor passed");

  testEntangledNodeGenerateNode();
  console.log("✓ testEntangledNodeGenerateNode passed");

  testEntangledNodeToJSON();
  console.log("✓ testEntangledNodeToJSON passed");

  testEntangledNodeToString();
  console.log("✓ testEntangledNodeToString passed");

  testTeleportationChannelConstructor();
  console.log("✓ testTeleportationChannelConstructor passed");

  testTeleportationChannelToJSON();
  console.log("✓ testTeleportationChannelToJSON passed");

  testTeleportationChannelToString();
  console.log("✓ testTeleportationChannelToString passed");

  testSetCurrentNode();
  console.log("✓ testSetCurrentNode passed");

  testAttractorConstructor();
  console.log("✓ testAttractorConstructor passed");

  testAttractorCreate();
  console.log("✓ testAttractorCreate passed");

  testAttractorToJSON();
  console.log("✓ testAttractorToJSON passed");

  testAttractorToString();
  console.log("✓ testAttractorToString passed");

  console.log("\nAll ResoLang tests passed! ✨");
}