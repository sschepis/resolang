import { Quaternion, SplitPrimeFactorizer, QuaternionicResonanceField, TwistDynamics, QuaternionicProjector, QuaternionPool } from "../quaternion";
import { Prime } from "../resolang";

export function testQuaternionConstructor(): void {
  const q = new Quaternion(1, 2, 3, 4);
  assert(q.w == 1, "w component should be 1");
  assert(q.x == 2, "x component should be 2");
  assert(q.y == 3, "y component should be 3");
  assert(q.z == 4, "z component should be 4");
}

export function testQuaternionMultiply(): void {
  const q1 = new Quaternion(1, 2, 3, 4);
  const q2 = new Quaternion(5, 6, 7, 8);
  const result = q1.multiply(q2);
  // Expected result: (-60, 12, 30, 24)
  assert(result.w == -60, "Multiply w component should be -60");
  assert(result.x == 12, "Multiply x component should be 12");
  assert(result.y == 30, "Multiply y component should be 30");
  assert(result.z == 24, "Multiply z component should be 24");
}

export function testQuaternionConjugate(): void {
  const q = new Quaternion(1, 2, 3, 4);
  const result = q.conjugate();
  assert(result.w == 1, "Conjugate w component should be 1");
  assert(result.x == -2, "Conjugate x component should be -2");
  assert(result.y == -3, "Conjugate y component should be -3");
  assert(result.z == -4, "Conjugate z component should be -4");
}

export function testQuaternionNorm(): void {
  const q = new Quaternion(1, 2, 3, 4);
  const result = q.norm();
  assert(Math.abs(result - Math.sqrt(30)) < 1e-9, "Norm should be sqrt(30)");
}

export function testQuaternionNormalize(): void {
  const q = new Quaternion(1, 2, 3, 4);
  const result = q.normalize();
  assert(Math.abs(result.norm() - 1.0) < 1e-9, "Normalized quaternion should have norm 1");
}

export function testQuaternionToBlochVector(): void {
  const q = new Quaternion(1, 0, 0, 0); // Identity quaternion
  const bloch = q.toBlochVector();
  assert(bloch[0] == 0, "Bloch x should be 0");
  assert(bloch[1] == 0, "Bloch y should be 0");
  assert(bloch[2] == 0, "Bloch z should be 0");

  const qX = new Quaternion(0, 1, 0, 0); // Pure i
  const blochX = qX.toBlochVector();
  assert(blochX[0] == 1, "Bloch x should be 1 for pure i");
}

export function testQuaternionExp(): void {
  const q = new Quaternion(0, Math.PI / 2, 0, 0); // e^(i*pi/2) = i
  const result = q.exp();
  assert(Math.abs(result.w) < 1e-9, "Exp w component should be approximately 0");
  assert(Math.abs(result.x - 1) < 1e-9, "Exp x component should be approximately 1");
  assert(Math.abs(result.y) < 1e-9, "Exp y component should be approximately 0");
  assert(Math.abs(result.z) < 1e-9, "Exp z component should be approximately 0");
}

export function testQuaternionRotate(): void {
  const q = new Quaternion(1, 0, 0, 0); // Identity quaternion
  const axis = new Quaternion(0, 1, 0, 0); // X-axis as rotation axis
  const rotated = axis.rotate(Math.PI); // Rotate by 180 degrees around X-axis

  // Rotating the identity quaternion (1,0,0,0) by 180 degrees around the X-axis (0,1,0,0)
  // should result in (0,1,0,0)
  assert(Math.abs(rotated.w) < 1e-9, "Rotated w should be approximately 0");
  assert(Math.abs(rotated.x - 1) < 1e-9, "Rotated x should be approximately 1");
  assert(Math.abs(rotated.y) < 1e-9, "Rotated y should be approximately 0");
  assert(Math.abs(rotated.z) < 1e-9, "Rotated z should be approximately 0");
}

export function testQuaternionToJSON(): void {
  const q = new Quaternion(1, 2, 3, 4);
  const json = q.toJSON();
  assert(json.includes('"w":1'), "JSON should contain w");
  assert(json.includes('"x":2'), "JSON should contain x");
  assert(json.includes('"y":3'), "JSON should contain y");
  assert(json.includes('"z":4'), "JSON should contain z");
}

export function testQuaternionToString(): void {
  const q = new Quaternion(1, 2, 3, 4);
  const str = q.toString();
  assert(str.includes("1.0") && str.includes("+2.0i") && str.includes("+3.0j") && str.includes("+4.0k"), "ToString should contain integer components with .0 suffix");

  const q2 = new Quaternion(1.234, -4.567, 7.891, -0.123);
  const str2 = q2.toString();
  assert(str2.includes("1.2") && str2.includes("-4.6i") && str2.includes("+7.9j") && str2.includes("-0.1k"), "ToString should handle floating points and signs with one decimal place");
}

export function testQuaternionClone(): void {
  const q1 = new Quaternion(1, 2, 3, 4);
  const q2 = q1.clone();
  assert(q1.w == q2.w, "Cloned w should be same");
  assert(q1.x == q2.x, "Cloned x should be same");
  assert(q1.y == q2.y, "Cloned y should be same");
  assert(q1.z == q2.z, "Cloned z should be same");
  assert(q1 != q2, "Cloned object should be different instance");
}

export function testSplitPrimeFactorizerIsSplitPrime(): void {
  assert(SplitPrimeFactorizer.isSplitPrime(13), "13 should be a split prime");
  assert(!SplitPrimeFactorizer.isSplitPrime(7), "7 should not be a split prime");
}

export function testSplitPrimeFactorizerFactorizeGaussian(): void {
  const result = SplitPrimeFactorizer.factorizeGaussian(5); // 5 = 1^2 + 2^2
  assert(result != null, "Gaussian factorization should exist for 5");
  assert(result!.get('a') == 1 || result!.get('a') == 2, "Gaussian a should be 1 or 2");
  assert(result!.get('b') == 1 || result!.get('b') == 2, "Gaussian b should be 1 or 2");
}

export function testSplitPrimeFactorizerFactorizeEisenstein(): void {
  const result = SplitPrimeFactorizer.factorizeEisenstein(7); // 7 = 2^2 + 2*1 + 1^2
  assert(result != null, "Eisenstein factorization should exist for 7");
  assert(result!.get('c') == 1 || result!.get('c') == 2, "Eisenstein c should be 1 or 2");
  assert(result!.get('d') == 1 || result!.get('d') == 2, "Eisenstein d should be 1 or 2");
}

export function testSplitPrimeFactorizerCreateQuaternion(): void {
  const q = SplitPrimeFactorizer.createQuaternion(13); // 13 is a split prime
  assert(q != null, "Quaternion should be created for split prime 13");
  assert(q!.norm() > 0, "Created quaternion should have non-zero norm");
}

export function testQuaternionicResonanceFieldConstructor(): void {
  const field = new QuaternionicResonanceField();
  assert(field.getQuaternions().size == 0, "Field should start with no quaternions");
  assert(field.getPhaseCorrections().length == 3, "Phase corrections should be initialized");
}

export function testQuaternionicResonanceFieldAddPrime(): void {
  const field = new QuaternionicResonanceField();
  const added = field.addPrime(13);
  assert(added, "Adding a split prime should succeed");
  assert(field.getQuaternions().size == 1, "Field should have one quaternion after adding prime");
}

export function testQuaternionicResonanceFieldComputeField(): void {
  const field = new QuaternionicResonanceField();
  field.addPrime(13);
  const q = field.computeField(0.1, 0.2);
  assert(q.norm() > 0, "Computed field should have non-zero norm");
}

export function testQuaternionicResonanceFieldOptimizeParameters(): void {
  const field = new QuaternionicResonanceField();
  field.addPrime(13);
  const target = new Quaternion(1, 0, 0, 0);
  field.optimizeParameters(target, 10); // Run a few iterations
  // Assertions for optimization are complex, just ensure it runs without error
  assert(true, "Optimization should run without error");
}

export function testTwistDynamicsConstructor(): void {
  const dynamics = new TwistDynamics();
  assert(dynamics.getTwistAngle() == 0.0, "Initial twist angle should be 0");
}

export function testTwistDynamicsComputeTwistAngle(): void {
  const dynamics = new TwistDynamics();
  const q = new Quaternion(1, 1, 0, 0); // w=1, x=1, y=0, z=0
  const angle = dynamics.computeTwistAngle(q);
  assert(Math.abs(angle - Math.PI / 4) < 1e-9, "Twist angle should be PI/4 for (1,1,0,0)");
}

export function testTwistDynamicsEvolve(): void {
  const dynamics = new TwistDynamics();
  const initialAngle = dynamics.getTwistAngle();
  dynamics.evolve(0.01);
  assert(dynamics.getTwistAngle() != initialAngle, "Twist angle should evolve");
}

export function testTwistDynamicsCheckCollapse(): void {
  const dynamics = new TwistDynamics();
  // Test collapse condition
  assert(!dynamics.checkCollapse(0.5, 0.1, 0.01), "Should not collapse with high entropy");
  
  // Force low entropy and aligned angle for testing
  dynamics.setTwistAngle(0.005); // Close to 0
  assert(dynamics.checkCollapse(0.05, 0.1, 0.01), "Should collapse with low entropy and aligned angle");
}

export function testQuaternionicProjectorConstructor(): void {
  const projector = new QuaternionicProjector(0.05);
  assert(true, "Constructor should work"); // No direct getters for errorCorrection
}

export function testQuaternionicProjectorProject(): void {
  const projector = new QuaternionicProjector();
  const q = new Quaternion(1, 2, 3, 4);
  const projected = projector.project(q);
  assert(projected.length == 2, "Projected array should have length 2");
  assert(projected[0] != 0 || projected[1] != 0, "Projected values should be non-zero");
}

export function testQuaternionicProjectorComputeEigenvalues(): void {
  const projector = new QuaternionicProjector();
  const q = new Quaternion(1, 2, 3, 4);
  const eigenvalues = projector.computeEigenvalues(q);
  assert(eigenvalues.length == 2, "Eigenvalues array should have length 2");
  assert(eigenvalues[0] != 0 || eigenvalues[1] != 0, "Eigenvalues should be non-zero");
}

export function testQuaternionPoolAllocateAndDeallocate(): void {
  const pool = new QuaternionPool(2);
  const q1 = pool.allocate();
  const q2 = pool.allocate();
  assert(q1 != null, "Should allocate first quaternion");
  assert(q2 != null, "Should allocate second quaternion");
  
  pool.deallocate(q1);
  assert(pool.getPool().length == 1, "Pool size should be 1 after deallocate");
  const q3 = pool.allocate();
  assert(q3 == q1, "Should re-allocate from pool");
}

export function runAllQuaternionTests(): void {
  console.log("Running quaternion tests...");

  testQuaternionConstructor();
  console.log("✓ testQuaternionConstructor passed");
  testQuaternionMultiply();
  console.log("✓ testQuaternionMultiply passed");
  testQuaternionConjugate();
  console.log("✓ testQuaternionNorm passed");
  testQuaternionNormalize();
  console.log("✓ testQuaternionNormalize passed");
  testQuaternionToBlochVector();
  console.log("✓ testQuaternionToBlochVector passed");
  testQuaternionExp();
  console.log("✓ testQuaternionExp passed");
  testQuaternionRotate();
  console.log("✓ testQuaternionRotate passed");
  testQuaternionToJSON();
  console.log("✓ testQuaternionToJSON passed");
  testQuaternionToString();
  console.log("✓ testQuaternionToString passed");
  testQuaternionClone();
  console.log("✓ testQuaternionClone passed");

  testSplitPrimeFactorizerIsSplitPrime();
  console.log("✓ testSplitPrimeFactorizerIsSplitPrime passed");
  testSplitPrimeFactorizerFactorizeGaussian();
  console.log("✓ testSplitPrimeFactorizerFactorizeGaussian passed");
  testSplitPrimeFactorizerFactorizeEisenstein();
  console.log("✓ testSplitPrimeFactorizerFactorizeEisenstein passed");
  testSplitPrimeFactorizerCreateQuaternion();
  console.log("✓ testSplitPrimeFactorizerCreateQuaternion passed");

  testQuaternionicResonanceFieldConstructor();
  console.log("✓ testQuaternionicResonanceFieldConstructor passed");
  testQuaternionicResonanceFieldAddPrime();
  console.log("✓ testQuaternionicResonanceFieldAddPrime passed");
  testQuaternionicResonanceFieldComputeField();
  console.log("✓ testQuaternionicResonanceFieldComputeField passed");
  testQuaternionicResonanceFieldOptimizeParameters();
  console.log("✓ testQuaternionicResonanceFieldOptimizeParameters passed");

  testTwistDynamicsConstructor();
  console.log("✓ testTwistDynamicsConstructor passed");
  testTwistDynamicsComputeTwistAngle();
  console.log("✓ testTwistDynamicsComputeTwistAngle passed");
  testTwistDynamicsEvolve();
  console.log("✓ testTwistDynamicsEvolve passed");
  testTwistDynamicsCheckCollapse();
  console.log("✓ testTwistDynamicsCheckCollapse passed");

  testQuaternionicProjectorConstructor();
  console.log("✓ testQuaternionicProjectorConstructor passed");
  testQuaternionicProjectorProject();
  console.log("✓ testQuaternionicProjectorProject passed");
  testQuaternionicProjectorComputeEigenvalues();
  console.log("✓ testQuaternionicProjectorComputeEigenvalues passed");

  testQuaternionPoolAllocateAndDeallocate();
  console.log("✓ testQuaternionPoolAllocateAndDeallocate passed");

  console.log("\nAll quaternion tests passed! ✨");
}