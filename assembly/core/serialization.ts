/**
 * Centralized serialization utilities for the Prime Resonance Network
 * Provides consistent JSON serialization, escaping, and formatting functions
 */

import { Serializable } from "./interfaces";

/**
 * JSON serialization options
 */
export class SerializationOptions {
  /** Whether to include null values in serialization */
  includeNulls: boolean = false;
  
  /** Whether to pretty-print the JSON output */
  prettyPrint: boolean = false;
  
  /** Indentation string for pretty printing */
  indent: string = "  ";
  
  /** Maximum depth for nested object serialization */
  maxDepth: i32 = 10;
  
  /** Whether to include type information in serialized output */
  includeTypeInfo: boolean = false;
}

/**
 * Centralized JSON escaping function
 * Handles all special characters that need escaping in JSON strings
 */
export function escapeJSON(str: string): string {
  let result = "";
  for (let i = 0; i < str.length; i++) {
    const char = str.charAt(i);
    const code = char.charCodeAt(0);
    switch (code) {
      case 0x22: // '"'
        result += '\\"';
        break;
      case 0x5C: // '\\'
        result += '\\\\';
        break;
      case 0x08: // '\b'
        result += '\\b';
        break;
      case 0x0C: // '\f'
        result += '\\f';
        break;
      case 0x0A: // '\n'
        result += '\\n';
        break;
      case 0x0D: // '\r'
        result += '\\r';
        break;
      case 0x09: // '\t'
        result += '\\t';
        break;
      default:
        // Handle Unicode characters
        if (code < 0x20 || code > 0x7E) {
          result += '\\u' + code.toString(16).padStart(4, '0');
        } else {
          result += char;
        }
    }
  }
  return result;
}

/**
 * Format a number with fixed decimal places
 */
export function toFixed(value: f64, decimals: i32): string {
  const factor = Math.pow(10, decimals);
  return (Math.round(value * factor) / factor).toString();
}

/**
 * Serialize a string value
 */
export function serializeString(value: string): string {
  return '"' + escapeJSON(value) + '"';
}

/**
 * Serialize a number value
 */
export function serializeNumber(value: f64): string {
  if (isNaN(value)) return "null";
  if (!isFinite(value)) return "null";
  return value.toString();
}

/**
 * Serialize a boolean value
 */
export function serializeBoolean(value: bool): string {
  return value ? "true" : "false";
}

/**
 * Serialize an integer value
 */
export function serializeInteger(value: i64): string {
  return value.toString();
}

/**
 * JSON builder for constructing JSON objects incrementally
 */
export class JSONBuilder {
  private parts: Array<string>;
  private isFirst: boolean;
  private options: SerializationOptions;
  private depth: i32;
  private inArray: boolean;
  
  constructor(options: SerializationOptions = new SerializationOptions()) {
    this.parts = new Array<string>();
    this.isFirst = true;
    this.options = options;
    this.depth = 0;
    this.inArray = false;
  }
  
  /**
   * Start a JSON object
   */
  startObject(): JSONBuilder {
    this.parts.push("{");
    this.isFirst = true;
    this.depth++;
    this.inArray = false;
    return this;
  }
  
  /**
   * End a JSON object
   */
  endObject(): JSONBuilder {
    this.depth--;
    if (this.options.prettyPrint && !this.isFirst) {
      this.parts.push("\n" + this.options.indent.repeat(this.depth));
    }
    this.parts.push("}");
    this.isFirst = false;
    return this;
  }
  
  /**
   * Start a JSON array
   */
  startArray(): JSONBuilder {
    this.parts.push("[");
    this.isFirst = true;
    this.depth++;
    this.inArray = true;
    return this;
  }
  
  /**
   * End a JSON array
   */
  endArray(): JSONBuilder {
    this.depth--;
    if (this.options.prettyPrint && !this.isFirst) {
      this.parts.push("\n" + this.options.indent.repeat(this.depth));
    }
    this.parts.push("]");
    this.isFirst = false;
    this.inArray = false;
    return this;
  }
  
  /**
   * Add a string field to the current object
   */
  addStringField(name: string, value: string): JSONBuilder {
    return this.addFieldInternal(name, serializeString(value));
  }
  
  /**
   * Add a number field to the current object
   */
  addNumberField(name: string, value: f64): JSONBuilder {
    return this.addFieldInternal(name, serializeNumber(value));
  }
  
  /**
   * Add an integer field to the current object
   */
  addIntegerField(name: string, value: i64): JSONBuilder {
    return this.addFieldInternal(name, serializeInteger(value));
  }
  
  /**
   * Add a boolean field to the current object
   */
  addBooleanField(name: string, value: bool): JSONBuilder {
    return this.addFieldInternal(name, serializeBoolean(value));
  }
  
  /**
   * Add a null field to the current object
   */
  addNullField(name: string): JSONBuilder {
    return this.addFieldInternal(name, "null");
  }
  
  /**
   * Add a raw JSON field to the current object
   */
  addRawField(name: string, json: string): JSONBuilder {
    return this.addFieldInternal(name, json);
  }
  
  /**
   * Add a string value to the current array
   */
  addStringValue(value: string): JSONBuilder {
    return this.addArrayValueInternal(serializeString(value));
  }
  
  /**
   * Add a number value to the current array
   */
  addNumberValue(value: f64): JSONBuilder {
    return this.addArrayValueInternal(serializeNumber(value));
  }
  
  /**
   * Add an integer value to the current array
   */
  addIntegerValue(value: i64): JSONBuilder {
    return this.addArrayValueInternal(serializeInteger(value));
  }
  
  /**
   * Add a boolean value to the current array
   */
  addBooleanValue(value: bool): JSONBuilder {
    return this.addArrayValueInternal(serializeBoolean(value));
  }
  
  /**
   * Add a null value to the current array
   */
  addNullValue(): JSONBuilder {
    return this.addArrayValueInternal("null");
  }
  
  /**
   * Add a raw JSON value to the current array
   */
  addRawValue(json: string): JSONBuilder {
    return this.addArrayValueInternal(json);
  }
  
  /**
   * Build the final JSON string
   */
  build(): string {
    return this.parts.join("");
  }
  
  private addFieldInternal(name: string, value: string): JSONBuilder {
    if (this.inArray) {
      throw new Error("Cannot add field to array");
    }
    
    if (!this.isFirst) {
      this.parts.push(",");
    }
    
    if (this.options.prettyPrint) {
      this.parts.push("\n" + this.options.indent.repeat(this.depth));
    }
    
    this.parts.push('"' + escapeJSON(name) + '":');
    if (this.options.prettyPrint) this.parts.push(" ");
    this.parts.push(value);
    
    this.isFirst = false;
    return this;
  }
  
  private addArrayValueInternal(value: string): JSONBuilder {
    if (!this.inArray) {
      throw new Error("Not in array context");
    }
    
    if (!this.isFirst) {
      this.parts.push(",");
    }
    
    if (this.options.prettyPrint) {
      this.parts.push("\n" + this.options.indent.repeat(this.depth));
    }
    
    this.parts.push(value);
    this.isFirst = false;
    return this;
  }
}

/**
 * Base class for JSON serializable objects
 * Provides standard implementation of toJSON() method
 */
export abstract class JSONSerializable implements Serializable {
  /**
   * Build the JSON representation using JSONBuilder
   * Subclasses should override this to specify serialization
   */
  protected abstract buildJSON(builder: JSONBuilder): void;
  
  /**
   * Convert to JSON string representation
   */
  toJSON(options: SerializationOptions = new SerializationOptions()): string {
    const builder = new JSONBuilder(options);
    builder.startObject();
    
    if (options.includeTypeInfo) {
      builder.addStringField("__type", this.getTypeName());
    }
    
    this.buildJSON(builder);
    builder.endObject();
    
    return builder.build();
  }
  
  /**
   * Get the type name for this object
   * Subclasses can override to provide custom type names
   */
  protected getTypeName(): string {
    return "JSONSerializable";
  }
  
  /**
   * Default toString implementation uses toJSON
   */
  toString(): string {
    return this.toJSON();
  }
}

/**
 * Simple class to represent a JSON field (key-value pair)
 */
export class JSONField {
  constructor(
    public key: string,
    public value: string
  ) {}
}

/**
 * Utility class for common serialization patterns
 */
export class SerializationUtils {
  /**
   * Create a simple JSON object from key-value pairs
   */
  static createSimpleJSON(fields: Array<JSONField>): string {
    const builder = new JSONBuilder();
    builder.startObject();
    
    for (let i = 0; i < fields.length; i++) {
      const field = fields[i];
      builder.addRawField(field.key, field.value);
    }
    
    builder.endObject();
    return builder.build();
  }
  
  /**
   * Format a floating point number for JSON
   */
  static formatNumber(value: f64, decimals: i32 = 6): string {
    if (isNaN(value)) return "null";
    if (!isFinite(value)) return "null";
    
    // For whole numbers, don't include decimals
    if (value === Math.floor(value)) {
      return value.toString();
    }
    
    return toFixed(value, decimals);
  }
  
  /**
   * Serialize an array of strings
   */
  static serializeStringArray(arr: Array<string>): string {
    const builder = new JSONBuilder();
    builder.startArray();
    
    for (let i = 0; i < arr.length; i++) {
      builder.addStringValue(arr[i]);
    }
    
    builder.endArray();
    return builder.build();
  }
  
  /**
   * Serialize an array of numbers
   */
  static serializeNumberArray(arr: Array<f64>): string {
    const builder = new JSONBuilder();
    builder.startArray();
    
    for (let i = 0; i < arr.length; i++) {
      builder.addNumberValue(arr[i]);
    }
    
    builder.endArray();
    return builder.build();
  }
  
  /**
   * Serialize an array of integers
   */
  static serializeIntegerArray(arr: Array<i32>): string {
    const builder = new JSONBuilder();
    builder.startArray();
    
    for (let i = 0; i < arr.length; i++) {
      builder.addIntegerValue(arr[i]);
    }
    
    builder.endArray();
    return builder.build();
  }
  
  /**
   * Create a JSON error object
   */
  static createErrorJSON(code: string, message: string, details: string | null = null): string {
    const builder = new JSONBuilder();
    builder.startObject();
    builder.addStringField("error", code);
    builder.addStringField("message", message);
    
    if (details !== null) {
      builder.addStringField("details", details);
    }
    
    builder.endObject();
    return builder.build();
  }
}

/**
 * Helper function to serialize a Map to JSON object string
 */
export function serializeMapToJSON<V>(map: Map<string, V>, valueSerializer: (value: V) => string): string {
  const builder = new JSONBuilder();
  builder.startObject();
  
  const keys = map.keys();
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const value = map.get(key);
    if (value !== null) {
      builder.addRawField(key, valueSerializer(value));
    }
  }
  
  builder.endObject();
  return builder.build();
}

/**
 * Helper function to serialize an array of Serializable objects
 */
export function serializeObjectArray<T extends Serializable>(arr: Array<T>): string {
  const builder = new JSONBuilder();
  builder.startArray();
  
  for (let i = 0; i < arr.length; i++) {
    builder.addRawValue(arr[i].toString());
  }
  
  builder.endArray();
  return builder.build();
}