/**
 * Validation utility functions for common validation patterns
 * Consolidates validation logic across the codebase
 */

import { ValidationException } from "./errors";
import { Prime } from "../types";

/**
 * Validates that a value is not null
 */
export function requireNonNull<T>(value: T | null, paramName: string): T {
  if (value === null) {
    throw new ValidationException(`${paramName} cannot be null`);
  }
  return value;
}

/**
 * Validates that a number is positive
 */
export function requirePositive(value: f64, paramName: string): f64 {
  if (value <= 0) {
    throw new ValidationException(`${paramName} must be positive, got ${value}`);
  }
  return value;
}

/**
 * Validates that a number is non-negative
 */
export function requireNonNegative(value: f64, paramName: string): f64 {
  if (value < 0) {
    throw new ValidationException(`${paramName} must be non-negative, got ${value}`);
  }
  return value;
}

/**
 * Validates that an integer is positive
 */
export function requirePositiveInt(value: i32, paramName: string): i32 {
  if (value <= 0) {
    throw new ValidationException(`${paramName} must be a positive integer, got ${value}`);
  }
  return value;
}

/**
 * Validates that an integer is non-negative
 */
export function requireNonNegativeInt(value: i32, paramName: string): i32 {
  if (value < 0) {
    throw new ValidationException(`${paramName} must be a non-negative integer, got ${value}`);
  }
  return value;
}

/**
 * Validates that a value is within a range (inclusive)
 */
export function requireInRange(value: f64, min: f64, max: f64, paramName: string): f64 {
  if (value < min || value > max) {
    throw new ValidationException(`${paramName} must be between ${min} and ${max}, got ${value}`);
  }
  return value;
}

/**
 * Validates that an integer is within a range (inclusive)
 */
export function requireInRangeInt(value: i32, min: i32, max: i32, paramName: string): i32 {
  if (value < min || value > max) {
    throw new ValidationException(`${paramName} must be between ${min} and ${max}, got ${value}`);
  }
  return value;
}

/**
 * Validates that a string is not empty
 */
export function requireNonEmpty(value: string, paramName: string): string {
  if (value.length === 0) {
    throw new ValidationException(`${paramName} cannot be empty`);
  }
  return value;
}

/**
 * Validates that an array is not empty
 */
export function requireNonEmptyArray<T>(value: Array<T>, paramName: string): Array<T> {
  if (value.length === 0) {
    throw new ValidationException(`${paramName} cannot be an empty array`);
  }
  return value;
}

/**
 * Validates that an array has a specific length
 */
export function requireArrayLength<T>(value: Array<T>, expectedLength: i32, paramName: string): Array<T> {
  if (value.length !== expectedLength) {
    throw new ValidationException(`${paramName} must have length ${expectedLength}, got ${value.length}`);
  }
  return value;
}

/**
 * Validates that an array has a minimum length
 */
export function requireMinArrayLength<T>(value: Array<T>, minLength: i32, paramName: string): Array<T> {
  if (value.length < minLength) {
    throw new ValidationException(`${paramName} must have at least ${minLength} elements, got ${value.length}`);
  }
  return value;
}

/**
 * Validates that a value is a valid probability (0-1)
 */
export function requireProbability(value: f64, paramName: string): f64 {
  if (value < 0.0 || value > 1.0) {
    throw new ValidationException(`${paramName} must be a probability between 0 and 1, got ${value}`);
  }
  return value;
}

/**
 * Validates that a value is a valid phase angle (0-2π)
 */
export function requirePhase(value: f64, paramName: string): f64 {
  if (value < 0.0 || value >= 2.0 * Math.PI) {
    throw new ValidationException(`${paramName} must be a phase between 0 and 2π, got ${value}`);
  }
  return value;
}

/**
 * Validates that a value is a valid normalized value (0-1)
 */
export function requireNormalized(value: f64, paramName: string): f64 {
  return requireProbability(value, paramName);
}

/**
 * Validates that a prime number is valid
 */
export function requireValidPrime(value: Prime, paramName: string): Prime {
  if (value < 2) {
    throw new ValidationException(`${paramName} must be a prime number >= 2, got ${value}`);
  }
  return value;
}

/**
 * Validates that all elements in an array are unique
 */
export function requireUniqueElements<T>(value: Array<T>, paramName: string): Array<T> {
  const seen = new Set<T>();
  for (let i = 0; i < value.length; i++) {
    if (seen.has(value[i])) {
      throw new ValidationException(`${paramName} contains duplicate element: ${value[i]}`);
    }
    seen.add(value[i]);
  }
  return value;
}

/**
 * Validates that a Map is not empty
 */
export function requireNonEmptyMap<K, V>(value: Map<K, V>, paramName: string): Map<K, V> {
  if (value.size === 0) {
    throw new ValidationException(`${paramName} cannot be an empty map`);
  }
  return value;
}

/**
 * Validates that a Set is not empty
 */
export function requireNonEmptySet<T>(value: Set<T>, paramName: string): Set<T> {
  if (value.size === 0) {
    throw new ValidationException(`${paramName} cannot be an empty set`);
  }
  return value;
}

/**
 * Validates that a buffer has a specific size
 */
export function requireBufferSize(value: Uint8Array, expectedSize: i32, paramName: string): Uint8Array {
  if (value.length !== expectedSize) {
    throw new ValidationException(`${paramName} must have size ${expectedSize}, got ${value.length}`);
  }
  return value;
}

/**
 * Validates that a buffer has a minimum size
 */
export function requireMinBufferSize(value: Uint8Array, minSize: i32, paramName: string): Uint8Array {
  if (value.length < minSize) {
    throw new ValidationException(`${paramName} must have at least ${minSize} bytes, got ${value.length}`);
  }
  return value;
}

/**
 * Validates that two values are equal
 */
export function requireEqual<T>(actual: T, expected: T, message: string): T {
  if (actual !== expected) {
    throw new ValidationException(`${message}: expected ${expected}, got ${actual}`);
  }
  return actual;
}

/**
 * Validates that two values are not equal
 */
export function requireNotEqual<T>(actual: T, notExpected: T, message: string): T {
  if (actual === notExpected) {
    throw new ValidationException(`${message}: value must not be ${notExpected}`);
  }
  return actual;
}

/**
 * Validates that a condition is true
 */
export function requireTrue(condition: bool, message: string): void {
  if (!condition) {
    throw new ValidationException(message);
  }
}

/**
 * Validates that a condition is false
 */
export function requireFalse(condition: bool, message: string): void {
  if (condition) {
    throw new ValidationException(message);
  }
}

/**
 * Validates that a string matches a pattern (simple contains check)
 */
export function requireContains(value: string, substring: string, paramName: string): string {
  if (!value.includes(substring)) {
    throw new ValidationException(`${paramName} must contain "${substring}"`);
  }
  return value;
}

/**
 * Validates that a string starts with a prefix
 */
export function requireStartsWith(value: string, prefix: string, paramName: string): string {
  if (!value.startsWith(prefix)) {
    throw new ValidationException(`${paramName} must start with "${prefix}"`);
  }
  return value;
}

/**
 * Validates that a string ends with a suffix
 */
export function requireEndsWith(value: string, suffix: string, paramName: string): string {
  if (!value.endsWith(suffix)) {
    throw new ValidationException(`${paramName} must end with "${suffix}"`);
  }
  return value;
}

/**
 * Validates that a value is one of the allowed values
 */
export function requireOneOf<T>(value: T, allowedValues: Array<T>, paramName: string): T {
  for (let i = 0; i < allowedValues.length; i++) {
    if (value === allowedValues[i]) {
      return value;
    }
  }
  throw new ValidationException(`${paramName} must be one of: ${allowedValues.join(", ")}, got ${value}`);
}

/**
 * Validates that a value is not one of the forbidden values
 */
export function requireNotOneOf<T>(value: T, forbiddenValues: Array<T>, paramName: string): T {
  for (let i = 0; i < forbiddenValues.length; i++) {
    if (value === forbiddenValues[i]) {
      throw new ValidationException(`${paramName} must not be ${value}`);
    }
  }
  return value;
}

/**
 * Validates that a value passes a custom predicate
 */
export function requirePredicate<T>(value: T, predicate: (v: T) => bool, paramName: string, message: string): T {
  if (!predicate(value)) {
    throw new ValidationException(`${paramName}: ${message}`);
  }
  return value;
}

/**
 * Validates multiple conditions and returns all validation errors
 */
export class ValidationBuilder {
  private errors: Array<string>;
  
  constructor() {
    this.errors = new Array<string>();
  }
  
  /**
   * Adds a validation check
   */
  check(condition: bool, message: string): ValidationBuilder {
    if (!condition) {
      this.errors.push(message);
    }
    return this;
  }
  
  /**
   * Adds a validation for non-null
   */
  checkNonNull<T>(value: T | null, paramName: string): ValidationBuilder {
    if (value === null) {
      this.errors.push(`${paramName} cannot be null`);
    }
    return this;
  }
  
  /**
   * Adds a validation for positive number
   */
  checkPositive(value: f64, paramName: string): ValidationBuilder {
    if (value <= 0) {
      this.errors.push(`${paramName} must be positive, got ${value}`);
    }
    return this;
  }
  
  /**
   * Adds a validation for range
   */
  checkInRange(value: f64, min: f64, max: f64, paramName: string): ValidationBuilder {
    if (value < min || value > max) {
      this.errors.push(`${paramName} must be between ${min} and ${max}, got ${value}`);
    }
    return this;
  }
  
  /**
   * Returns true if all validations passed
   */
  isValid(): bool {
    return this.errors.length === 0;
  }
  
  /**
   * Gets all validation errors
   */
  getErrors(): Array<string> {
    return this.errors;
  }
  
  /**
   * Throws if any validation failed
   */
  validate(): void {
    if (this.errors.length > 0) {
      throw new ValidationException(`Validation failed:\n${this.errors.join("\n")}`);
    }
  }
}

/**
 * Creates a new validation builder
 */
export function validate(): ValidationBuilder {
  return new ValidationBuilder();
}