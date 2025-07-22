// assembly/runtime/state/registerState.ts
// Register state management for RISA runtime

/**
 * Register types in RISA
 */
export enum RegisterType {
  GENERAL,
  COHERENCE,
  AMPLITUDE,
  PHASE,
  ENTROPY,
  PROBABILITY,
  SUCCESS,
  RESONANCE,
  COUNT,
  RANDOM
}

/**
 * Register value interface
 */
export class IRegisterValue {
  constructor(
    public type: RegisterType,
    public value: f64,
    public name: string,
    public lastModified: f64
  ) {}
}

/**
 * Register state interface
 */
export interface IRegisterState {
  /**
   * Set register value
   */
  setRegister(name: string, value: f64, type: RegisterType): void;

  /**
   * Get register value
   */
  getRegister(name: string): f64;

  /**
   * Get register info
   */
  getRegisterInfo(name: string): IRegisterValue | null;

  /**
   * Check if register exists
   */
  hasRegister(name: string): bool;

  /**
   * List all registers
   */
  listRegisters(): Map<string, IRegisterValue>;

  /**
   * Clear all registers
   */
  clearRegisters(): void;

  /**
   * Clear specific register
   */
  clearRegister(name: string): void;

  /**
   * Get registers by type
   */
  getRegistersByType(type: RegisterType): Map<string, IRegisterValue>;

  /**
   * Clone the register state
   */
  clone(): IRegisterState;
}

/**
 * Register state implementation
 */
export class RegisterState implements IRegisterState {
  private registers: Map<string, IRegisterValue> = new Map();

  setRegister(name: string, value: f64, type: RegisterType = RegisterType.GENERAL): void {
    const reg = new IRegisterValue(
      type,
      value,
      name,
      Date.now() as f64
    );
    this.registers.set(name, reg);
  }

  getRegister(name: string): f64 {
    const register = this.registers.get(name);
    return register ? register.value : 0.0;
  }

  getRegisterInfo(name: string): IRegisterValue | null {
    return this.registers.get(name);
  }

  hasRegister(name: string): bool {
    return this.registers.has(name);
  }

  listRegisters(): Map<string, IRegisterValue> {
    return this.registers;
  }

  clearRegisters(): void {
    this.registers.clear();
  }

  clearRegister(name: string): void {
    this.registers.delete(name);
  }

  getRegistersByType(type: RegisterType): Map<string, IRegisterValue> {
    const result = new Map<string, IRegisterValue>();
    const keys = this.registers.keys();
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const value = this.registers.get(key);
      if (value.type === type) {
        result.set(key, value);
      }
    }
    return result;
  }

  clone(): IRegisterState {
    const cloned = new RegisterState();
    const keys = this.registers.keys();
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const value = this.registers.get(key);
      // Create a new IRegisterValue object for the clone
      const clonedValue = new IRegisterValue(value.type, value.value, value.name, value.lastModified);
      cloned.registers.set(key, clonedValue);
    }
    return cloned;
  }
}