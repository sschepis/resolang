/**
 * Quaternion Export Wrappers
 * Provides WebAssembly-compatible exports for quaternion classes
 */

import {
  Quaternion,
  SplitPrimeFactorizer,
  QuaternionicResonanceField,
  TwistDynamics,
  QuaternionicProjector,
  QuaternionPool
} from './quaternion';

import {
  EntangledQuaternionPair,
  QuaternionicSynchronizer,
  QuaternionicAgent,
  transmitQuaternionicMessage
} from './quaternion-entanglement';

// Quaternion constructor and methods
// @ts-ignore
export function createQuaternion(w: f64, x: f64, y: f64, z: f64): Quaternion {
  return new Quaternion(w, x, y, z);
}

export function quaternionMultiply(q1: Quaternion, q2: Quaternion): Quaternion {
  return q1.multiply(q2);
}

export function quaternionConjugate(q: Quaternion): Quaternion {
  return q.conjugate();
}

// @ts-ignore
export function quaternionNorm(q: Quaternion): f64 {
  return q.norm();
}

export function quaternionNormalize(q: Quaternion): Quaternion {
  return q.normalize();
}

export function quaternionToBlochVector(q: Quaternion): Float64Array {
  return q.toBlochVector();
}

export function quaternionExp(q: Quaternion): Quaternion {
  return q.exp();
}

// @ts-ignore
export function quaternionRotate(q: Quaternion, angle: f64): Quaternion {
  return q.rotate(angle);
}

export function quaternionToString(q: Quaternion): string {
  return q.toString();
}

export function quaternionToJSON(q: Quaternion): string {
  return q.toJSON();
}

// SplitPrimeFactorizer methods
export function isSplitPrime(p: u32): boolean {
  return SplitPrimeFactorizer.isSplitPrime(p);
}

export function createQuaternionFromPrime(p: u32): Quaternion | null {
  return SplitPrimeFactorizer.createQuaternion(p);
}

// QuaternionicResonanceField constructor and methods
export function createQuaternionicResonanceField(): QuaternionicResonanceField {
  return new QuaternionicResonanceField();
}

export function addPrimeToResonanceField(field: QuaternionicResonanceField, p: u32): boolean {
  return field.addPrime(p);
}

export function computeResonanceField(field: QuaternionicResonanceField, x: f64, t: f64): Quaternion {
  return field.computeField(x, t);
}

export function optimizeResonanceFieldParameters(field: QuaternionicResonanceField, target: Quaternion, iterations: i32 = 100): void {
  field.optimizeParameters(target, iterations);
}

// TwistDynamics constructor and methods
export function createTwistDynamics(): TwistDynamics {
  return new TwistDynamics();
}

export function computeTwistAngleFromQuaternion(dynamics: TwistDynamics, q: Quaternion): f64 {
  return dynamics.computeTwistAngle(q);
}

export function evolveTwistDynamics(dynamics: TwistDynamics, dt: f64): void {
  dynamics.evolve(dt);
}

export function checkTwistCollapse(dynamics: TwistDynamics, entropy: f64, entropyThreshold: f64, angleThreshold: f64): boolean {
  return dynamics.checkCollapse(entropy, entropyThreshold, angleThreshold);
}

// Renamed to avoid conflict with twist.ts export
export function getDynamicsTwistAngle(dynamics: TwistDynamics): f64 {
  return dynamics.getTwistAngle();
}

export function setTwistAngle(dynamics: TwistDynamics, angle: f64): void {
  dynamics.setTwistAngle(angle);
}

// QuaternionicProjector constructor and methods
export function createQuaternionicProjector(errorCorrection: f64 = 0.01): QuaternionicProjector {
  return new QuaternionicProjector(errorCorrection);
}

export function projectQuaternion(projector: QuaternionicProjector, q: Quaternion): Float64Array {
  return projector.project(q);
}

export function computeQuaternionEigenvalues(projector: QuaternionicProjector, q: Quaternion): Float64Array {
  return projector.computeEigenvalues(q);
}

// QuaternionPool constructor and methods
export function createQuaternionPool(maxSize: i32 = 1000): QuaternionPool {
  return new QuaternionPool(maxSize);
}

export function allocateQuaternionFromPool(pool: QuaternionPool): Quaternion {
  return pool.allocate();
}

export function deallocateQuaternionToPool(pool: QuaternionPool, q: Quaternion): void {
  pool.deallocate(q);
}

// EntangledQuaternionPair constructor and methods
// @ts-ignore
export function createEntangledQuaternionPair(q1: Quaternion, q2: Quaternion, couplingStrength: f64 = 0.5): EntangledQuaternionPair {
  return new EntangledQuaternionPair(q1, q2, couplingStrength);
}

// @ts-ignore
export function evolveEntangledPair(pair: EntangledQuaternionPair, dt: f64): void {
  pair.evolve(dt);
}

// @ts-ignore
export function computeEntangledPairFidelity(pair: EntangledQuaternionPair, target: EntangledQuaternionPair): f64 {
  return pair.computeFidelity(target);
}

// @ts-ignore
export function optimizeEntanglement(pair: EntangledQuaternionPair, target: EntangledQuaternionPair, iterations: i32 = 100): void {
  pair.optimizeEntanglement(target, iterations);
}

// QuaternionicSynchronizer constructor and methods
export function createQuaternionicSynchronizer(): QuaternionicSynchronizer {
  return new QuaternionicSynchronizer();
}

// @ts-ignore
export function measureQuaternionPhaseDifference(sync: QuaternionicSynchronizer, q1: Quaternion, q2: Quaternion): f64 {
  return sync.measurePhaseDifference(q1, q2);
}

export function synchronizeQuaternions(
  sync: QuaternionicSynchronizer,
  q1: Quaternion,
  q2: Quaternion,
  id1: string,
  id2: string,
  // @ts-ignore
  targetPhaseDiff: f64 = 0.0,
  // @ts-ignore
  tolerance: f64 = 0.01
): boolean {
  return sync.synchronize(q1, q2, id1, id2, targetPhaseDiff, tolerance);
}

export function runAdaptiveSynchronization(
  sync: QuaternionicSynchronizer,
  pair: EntangledQuaternionPair,
  // @ts-ignore
  maxIterations: i32 = 100,
  // @ts-ignore
  dt: f64 = 0.01
): boolean {
  return sync.runAdaptiveSynchronization(pair, maxIterations, dt);
}

// QuaternionicAgent constructor and methods
export function createQuaternionicAgent(q: Quaternion): QuaternionicAgent {
  return new QuaternionicAgent(q);
}

export function encodeQuaternionicMessage(agent: QuaternionicAgent, message: string): void {
  agent.encodeMessage(message);
}

export function decodeQuaternionicMessage(agent: QuaternionicAgent): string {
  return agent.decodeMessage();
}

// @ts-ignore
export function entangleQuaternionicAgents(agent1: QuaternionicAgent, agent2: QuaternionicAgent, targetFidelity: f64 = 0.9): EntangledQuaternionPair {
  return agent1.entangleWith(agent2, targetFidelity);
}

// @ts-ignore
export function applyQuaternionicSymbolicCollapse(agent: QuaternionicAgent, entropyThreshold: f64 = 0.1): boolean {
  return agent.applySymbolicCollapse(entropyThreshold);
}

export function getQuaternionicAgentQuaternion(agent: QuaternionicAgent): Quaternion {
  return agent.getQuaternion();
}

// @ts-ignore
export function getQuaternionicAgentEntanglementFidelity(agent: QuaternionicAgent): f64 {
  return agent.getEntanglementFidelity();
}

// High-level transmission function is already exported from quaternion-entanglement
// No need to re-export here to avoid conflicts

// Helper functions for working with quaternion components
// @ts-ignore
export function getQuaternionW(q: Quaternion): f64 {
  return q.w;
}

// @ts-ignore
export function getQuaternionX(q: Quaternion): f64 {
  return q.x;
}

// @ts-ignore
export function getQuaternionY(q: Quaternion): f64 {
  return q.y;
}

// @ts-ignore
export function getQuaternionZ(q: Quaternion): f64 {
  return q.z;
}

// @ts-ignore
export function setQuaternionComponents(q: Quaternion, w: f64, x: f64, y: f64, z: f64): void {
  q.w = w;
  q.x = x;
  q.y = y;
  q.z = z;
}