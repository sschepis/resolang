// ResoLang DSL - Domain-specific language for resonance programming
// This module provides the TypeScript interpreter for ResoLang programs

export * from './types.js';
export * from './lexer.js';
export * from './economy.js';
export * from './contracts.js';
export * from './math.js';
export * from './gas.js';
export * from './validator.js';
export * from './prime-math.js';
export { execute, validate, ResoLangInterpreter, generatePrimes, isPrime, factorize, computeResonance } from './interpreter.js';
export { registerResoLangLanguage, RESOLANG_LANGUAGE_ID } from './monaco.js';

// Pattern exports
export { SEPHIROTIC_TOPOLOGY, RESONATOR_SOURCE } from './patterns/resonator.js';
