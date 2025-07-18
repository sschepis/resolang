/**
 * Centralized Validation Framework for the Prime Resonance Network
 * 
 * This module provides:
 * - Reusable validators for common validation scenarios
 * - Composable validation rules
 * - Validation context and error collection
 * - Type-safe validation builders
 */

import { ValidationError, ErrorCategory } from './error-handling';

// ============================================================================
// Core Validation Types
// ============================================================================

/**
 * Validation result
 */
export class ValidationResult {
  constructor(
    public readonly valid: bool,
    public readonly errors: ValidationError[] = []
  ) {}
  
  /**
   * Create a valid result
   */
  static valid(): ValidationResult {
    return new ValidationResult(true);
  }
  
  /**
   * Create an invalid result with error message
   */
  static invalid(message: string, field: string | null = null): ValidationResult {
    const error = new ValidationError(message);
    if (field) {
      error.addContext("field", field);
    }
    return new ValidationResult(false, [error]);
  }
  
  /**
   * Combine with another validation result
   */
  combine(other: ValidationResult): ValidationResult {
    if (this.valid && other.valid) {
      return new ValidationResult(true);
    }
    
    const allErrors = this.errors.concat(other.errors);
    return new ValidationResult(false, allErrors);
  }
  
  /**
   * Get error messages
   */
  getErrorMessages(): string[] {
    const messages: string[] = [];
    for (let i = 0; i < this.errors.length; i++) {
      messages.push(this.errors[i].message);
    }
    return messages;
  }
}

/**
 * Validator function type
 */
export type ValidatorFn<T> = (value: T, context: ValidationContext) => ValidationResult;

/**
 * Validation context for passing state between validators
 */
export class ValidationContext {
  private data: Map<string, any> = new Map();
  
  set(key: string, value: any): void {
    this.data.set(key, value);
  }
  
  get<T>(key: string): T | null {
    return this.data.get(key) as T | null;
  }
  
  has(key: string): bool {
    return this.data.has(key);
  }
}

// ============================================================================
// Base Validator Classes
// ============================================================================

/**
 * Abstract base validator
 */
export abstract class Validator<T> {
  protected fieldName: string | null = null;
  
  /**
   * Set the field name for error messages
   */
  forField(name: string): Validator<T> {
    this.fieldName = name;
    return this;
  }
  
  /**
   * Validate a value
   */
  validate(value: T, context: ValidationContext = new ValidationContext()): ValidationResult {
    return this.doValidate(value, context);
  }
  
  /**
   * Abstract validation method
   */
  protected abstract doValidate(value: T, context: ValidationContext): ValidationResult;
  
  /**
   * Create a validation error
   */
  protected error(message: string, value: T | null = null): ValidationResult {
    const error = new ValidationError(
      message,
      this.fieldName,
      value ? this.toString(value) : null
    );
    return new ValidationResult(false, [error]);
  }
  
  /**
   * Success result
   */
  protected success(): ValidationResult {
    return new ValidationResult(true);
  }
  
  /**
   * Convert value to string for error messages
   */
  protected toString(value: T): string {
    // Handle different types
    if (value === null) return "null";
    if (value === undefined) return "undefined";
    if (typeof value === "string") return value;
    if (typeof value === "number") return value.toString();
    if (typeof value === "boolean") return value ? "true" : "false";
    return "[object]";
  }
}

/**
 * Composite validator that combines multiple validators
 */
export class CompositeValidator<T> extends Validator<T> {
  private validators: Validator<T>[] = [];
  private mode: string = 'all';
  
  constructor(validators: Validator<T>[] = []) {
    super();
    this.validators = validators;
  }
  
  /**
   * Add a validator
   */
  add(validator: Validator<T>): CompositeValidator<T> {
    this.validators.push(validator);
    return this;
  }
  
  /**
   * Set validation mode (all must pass or any can pass)
   */
  setMode(mode: string): CompositeValidator<T> {
    this.mode = mode;
    return this;
  }
  
  protected doValidate(value: T, context: ValidationContext): ValidationResult {
    if (this.validators.length === 0) {
      return this.success();
    }
    
    if (this.mode === 'all') {
      return this.validateAll(value, context);
    } else {
      return this.validateAny(value, context);
    }
  }
  
  private validateAll(value: T, context: ValidationContext): ValidationResult {
    let result = this.success();
    
    for (let i = 0; i < this.validators.length; i++) {
      const validator = this.validators[i];
      if (this.fieldName) validator.forField(this.fieldName);
      
      const validationResult = validator.validate(value, context);
      result = result.combine(validationResult);
    }
    
    return result;
  }
  
  private validateAny(value: T, context: ValidationContext): ValidationResult {
    const errors: ValidationError[] = [];
    
    for (let i = 0; i < this.validators.length; i++) {
      const validator = this.validators[i];
      if (this.fieldName) validator.forField(this.fieldName);
      
      const result = validator.validate(value, context);
      if (result.valid) {
        return this.success();
      }
      // Add errors manually since AssemblyScript doesn't support spread
      for (let j = 0; j < result.errors.length; j++) {
        errors.push(result.errors[j]);
      }
    }
    
    return new ValidationResult(false, errors);
  }
}

// ============================================================================
// Common Validators
// ============================================================================

/**
 * Required validator
 */
export class RequiredValidator<T> extends Validator<T | null> {
  protected doValidate(value: T | null, context: ValidationContext): ValidationResult {
    if (value === null || value === undefined) {
      return this.error("Value is required");
    }
    
    // Check for empty strings
    if (typeof value === "string" && (value as string).length === 0) {
      return this.error("Value cannot be empty");
    }
    
    return this.success();
  }
}

/**
 * String length validator
 */
export class StringLengthValidator extends Validator<string> {
  constructor(
    private minLength: i32 = 0,
    private maxLength: i32 = i32.MAX_VALUE
  ) {
    super();
  }
  
  protected doValidate(value: string, context: ValidationContext): ValidationResult {
    const length = value.length;
    
    if (length < this.minLength) {
      return this.error(`Length must be at least ${this.minLength} characters`, value);
    }
    
    if (length > this.maxLength) {
      return this.error(`Length must not exceed ${this.maxLength} characters`, value);
    }
    
    return this.success();
  }
}

/**
 * Pattern validator for strings
 */
export class PatternValidator extends Validator<string> {
  constructor(
    private pattern: string,
    private errorMessage: string = "Value does not match required pattern"
  ) {
    super();
  }
  
  protected doValidate(value: string, context: ValidationContext): ValidationResult {
    // Simple pattern matching for AssemblyScript
    // In a real implementation, this would use regex
    if (!this.simpleMatch(value, this.pattern)) {
      return this.error(this.errorMessage, value);
    }
    
    return this.success();
  }
  
  private simpleMatch(value: string, pattern: string): bool {
    // Simplified pattern matching
    // Supports * for any characters and ? for single character
    let vi = 0, pi = 0;
    
    while (vi < value.length && pi < pattern.length) {
      if (pattern.charAt(pi) === '*') {
        // Match any number of characters
        pi++;
        if (pi >= pattern.length) return true;
        
        // Find next matching character
        while (vi < value.length && value.charAt(vi) !== pattern.charAt(pi)) {
          vi++;
        }
      } else if (pattern.charAt(pi) === '?' || pattern.charAt(pi) === value.charAt(vi)) {
        vi++;
        pi++;
      } else {
        return false;
      }
    }
    
    return vi === value.length && pi === pattern.length;
  }
}

/**
 * Number range validator
 */
export class RangeValidator extends Validator<f64> {
  constructor(
    private min: f64 = -f64.MAX_VALUE,
    private max: f64 = f64.MAX_VALUE,
    private inclusive: bool = true
  ) {
    super();
  }
  
  protected doValidate(value: f64, context: ValidationContext): ValidationResult {
    if (this.inclusive) {
      if (value < this.min || value > this.max) {
        return this.error(`Value must be between ${this.min} and ${this.max} (inclusive)`, value);
      }
    } else {
      if (value <= this.min || value >= this.max) {
        return this.error(`Value must be between ${this.min} and ${this.max} (exclusive)`, value);
      }
    }
    
    return this.success();
  }
}

/**
 * Array length validator
 */
export class ArrayLengthValidator<T> extends Validator<T[]> {
  constructor(
    private minLength: i32 = 0,
    private maxLength: i32 = i32.MAX_VALUE
  ) {
    super();
  }
  
  protected doValidate(value: T[], context: ValidationContext): ValidationResult {
    const length = value.length;
    
    if (length < this.minLength) {
      return this.error(`Array must have at least ${this.minLength} elements`);
    }
    
    if (length > this.maxLength) {
      return this.error(`Array must not exceed ${this.maxLength} elements`);
    }
    
    return this.success();
  }
}

/**
 * Array element validator
 */
export class ArrayElementValidator<T> extends Validator<T[]> {
  constructor(
    private elementValidator: Validator<T>
  ) {
    super();
  }
  
  protected doValidate(value: T[], context: ValidationContext): ValidationResult {
    let result = this.success();
    
    for (let i = 0; i < value.length; i++) {
      const elementResult = this.elementValidator
        .forField(`${this.fieldName || 'array'}[${i}]`)
        .validate(value[i], context);
      
      result = result.combine(elementResult);
    }
    
    return result;
  }
}

/**
 * Custom validator
 */
export class CustomValidator<T> extends Validator<T> {
  constructor(
    private validatorFn: ValidatorFn<T>
  ) {
    super();
  }
  
  protected doValidate(value: T, context: ValidationContext): ValidationResult {
    return this.validatorFn(value, context);
  }
}

// ============================================================================
// Specialized Validators
// ============================================================================

/**
 * Email validator
 */
export class EmailValidator extends Validator<string> {
  protected doValidate(value: string, context: ValidationContext): ValidationResult {
    // Simple email validation
    const atIndex = value.indexOf('@');
    if (atIndex < 1) {
      return this.error("Invalid email format", value);
    }
    
    const dotIndex = value.lastIndexOf('.');
    if (dotIndex < atIndex + 2 || dotIndex >= value.length - 1) {
      return this.error("Invalid email format", value);
    }
    
    return this.success();
  }
}

/**
 * URL validator
 */
export class URLValidator extends Validator<string> {
  protected doValidate(value: string, context: ValidationContext): ValidationResult {
    // Simple URL validation
    if (!value.startsWith("http://") && !value.startsWith("https://")) {
      return this.error("URL must start with http:// or https://", value);
    }
    
    const protocolEnd = value.indexOf("://");
    if (protocolEnd < 0 || value.length <= protocolEnd + 3) {
      return this.error("Invalid URL format", value);
    }
    
    return this.success();
  }
}

/**
 * Hex string validator
 */
export class HexValidator extends Validator<string> {
  constructor(
    private expectedLength: i32 = -1
  ) {
    super();
  }
  
  protected doValidate(value: string, context: ValidationContext): ValidationResult {
    if (this.expectedLength > 0 && value.length !== this.expectedLength) {
      return this.error(`Hex string must be exactly ${this.expectedLength} characters`, value);
    }
    
    for (let i = 0; i < value.length; i++) {
      const char = value.charCodeAt(i);
      const isDigit = char >= 48 && char <= 57; // 0-9
      const isLowerHex = char >= 97 && char <= 102; // a-f
      const isUpperHex = char >= 65 && char <= 70; // A-F
      
      if (!isDigit && !isLowerHex && !isUpperHex) {
        return this.error("Invalid hex character at position " + i.toString(), value);
      }
    }
    
    return this.success();
  }
}

/**
 * Node ID validator
 */
export class NodeIDValidator extends Validator<string> {
  protected doValidate(value: string, context: ValidationContext): ValidationResult {
    // Validate node ID format (e.g., hex string of specific length)
    const hexValidator = new HexValidator(64); // 32 bytes = 64 hex chars
    return hexValidator.forField(this.fieldName || "nodeId").validate(value, context);
  }
}

// ============================================================================
// Validation Builder
// ============================================================================

/**
 * Fluent validation builder
 */
export class ValidationBuilder<T> {
  private validators: Validator<T>[] = [];
  private fieldName: string | null = null;
  
  /**
   * Set field name
   */
  forField(name: string): ValidationBuilder<T> {
    this.fieldName = name;
    return this;
  }
  
  /**
   * Add required validation
   */
  required(): ValidationBuilder<T> {
    this.validators.push(new RequiredValidator<T>());
    return this;
  }
  
  /**
   * Add custom validation
   */
  custom(fn: ValidatorFn<T>): ValidationBuilder<T> {
    this.validators.push(new CustomValidator<T>(fn));
    return this;
  }
  
  /**
   * Add a validator
   */
  addValidator(validator: Validator<T>): ValidationBuilder<T> {
    this.validators.push(validator);
    return this;
  }
  
  /**
   * Build the composite validator
   */
  build(): Validator<T> {
    const composite = new CompositeValidator<T>(this.validators);
    if (this.fieldName) {
      composite.forField(this.fieldName);
    }
    return composite;
  }
  
  /**
   * Validate a value directly
   */
  validate(value: T, context: ValidationContext = new ValidationContext()): ValidationResult {
    return this.build().validate(value, context);
  }
}

/**
 * String validation builder
 */
export class StringValidationBuilder extends ValidationBuilder<string> {
  /**
   * Add length validation
   */
  length(min: i32, max: i32 = i32.MAX_VALUE): StringValidationBuilder {
    this.addValidator(new StringLengthValidator(min, max));
    return this;
  }
  
  /**
   * Add pattern validation
   */
  pattern(pattern: string, errorMessage: string = "Invalid format"): StringValidationBuilder {
    this.addValidator(new PatternValidator(pattern, errorMessage));
    return this;
  }
  
  /**
   * Add email validation
   */
  email(): StringValidationBuilder {
    this.addValidator(new EmailValidator());
    return this;
  }
  
  /**
   * Add URL validation
   */
  url(): StringValidationBuilder {
    this.addValidator(new URLValidator());
    return this;
  }
  
  /**
   * Add hex validation
   */
  hex(length: i32 = -1): StringValidationBuilder {
    this.addValidator(new HexValidator(length));
    return this;
  }
}

/**
 * Number validation builder
 */
export class NumberValidationBuilder extends ValidationBuilder<f64> {
  /**
   * Add range validation
   */
  range(min: f64, max: f64, inclusive: bool = true): NumberValidationBuilder {
    this.addValidator(new RangeValidator(min, max, inclusive));
    return this;
  }
  
  /**
   * Add minimum validation
   */
  min(value: f64, inclusive: bool = true): NumberValidationBuilder {
    this.addValidator(new RangeValidator(value, f64.MAX_VALUE, inclusive));
    return this;
  }
  
  /**
   * Add maximum validation
   */
  max(value: f64, inclusive: bool = true): NumberValidationBuilder {
    this.addValidator(new RangeValidator(-f64.MAX_VALUE, value, inclusive));
    return this;
  }
  
  /**
   * Add positive validation
   */
  positive(): NumberValidationBuilder {
    return this.min(0, false);
  }
  
  /**
   * Add negative validation
   */
  negative(): NumberValidationBuilder {
    return this.max(0, false);
  }
}

// ============================================================================
// Validation Utilities
// ============================================================================

/**
 * Create a string validator
 */
export function validateString(): StringValidationBuilder {
  return new StringValidationBuilder();
}

/**
 * Create a number validator
 */
export function validateNumber(): NumberValidationBuilder {
  return new NumberValidationBuilder();
}

/**
 * Create a generic validator
 */
export function validate<T>(): ValidationBuilder<T> {
  return new ValidationBuilder<T>();
}

/**
 * Validate an object against a schema
 */
export class ObjectValidator {
  private schema: Map<string, Validator<string>> = new Map();
  
  /**
   * Add field validation
   */
  field(name: string, validator: Validator<any>): ObjectValidator {
    this.schema.set(name, validator.forField(name));
    return this;
  }
  
  /**
   * Validate an object
   */
  validate(obj: Map<string, any>, context: ValidationContext = new ValidationContext()): ValidationResult {
    let result = new ValidationResult(true);
    
    const keys = this.schema.keys();
    for (let i = 0; i < keys.length; i++) {
      const fieldName = keys[i];
      const validator = this.schema.get(fieldName)!;
      const value = obj.get(fieldName);
      
      const fieldResult = validator.validate(value, context);
      result = result.combine(fieldResult);
    }
    
    return result;
  }
}

/**
 * Create an object validator
 */
export function validateObject(): ObjectValidator {
  return new ObjectValidator();
}

// ============================================================================
// Validation Decorators (Future Enhancement)
// ============================================================================

/**
 * Validation metadata for future decorator support
 */
export class ValidationMetadata {
  private static metadata: Map<string, Map<string, Validator<i32>>> = new Map();
  
  static addValidator(className: string, propertyName: string, validator: Validator<any>): void {
    if (!this.metadata.has(className)) {
      this.metadata.set(className, new Map());
    }
    
    const classMetadata = this.metadata.get(className)!;
    classMetadata.set(propertyName, validator);
  }
  
  static getValidators(className: string): Map<string, Validator<any>> | null {
    return this.metadata.get(className);
  }
}

/**
 * Example of how decorators would work when AssemblyScript supports them:
 * 
 * @Validate(validateString().required().email())
 * email: string;
 * 
 * @Validate(validateNumber().range(0, 100))
 * percentage: f64;
 */