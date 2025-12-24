import {
  RISAEngine,
  IRISAInstruction,
  IExecutionResult,
} from "../runtime";
import { ExtendedExecutionContext } from "../runtime/execution/context";
import { CallStackManager } from "../runtime/execution/stack";
import { ControlFlowManager, ControlFlowType } from "../runtime/execution/controlFlow";
import { GlobalState } from "../runtime/state/globalState";
import { PrimeStateEngine } from "../runtime/state/primeState";
import { RegisterState } from "../runtime/state/registerState";
import { HolographicMemory } from "../runtime/memory/holographic";
import { Argument } from "../runtime/argument";
import { IInstructionHandler } from "../runtime/instructions/types";

// Mock instruction handlers for testing
const mockInstructionHandlers = new Map<string, IInstructionHandler>();

class MockAddHandler implements IInstructionHandler {
  execute(engine: RISAEngine, args: Argument[]): bool {
    const val1 = engine.parseValue(args[0]);
    const val2 = engine.parseValue(args[1]);
    engine.getRegisterState().setRegister("result", val1 + val2);
    return true;
  }
}

class MockHaltHandler implements IInstructionHandler {
  execute(engine: RISAEngine, args: Argument[]): bool {
    engine.getContext().flags.halted = true;
    engine.getContext().flags.running = false; // Set running to false on halt
    return false;
  }
}

class MockJumpHandler implements IInstructionHandler {
  execute(engine: RISAEngine, args: Argument[]): bool {
    const label = args[0].s;
    if (label) {
      const jumpTable = engine.getControlFlowManager().getJumpTable();
      if (jumpTable.has(label)) {
        engine.getContext().instructionPointer = jumpTable.get(label);
        return true;
      }
    }
    engine.getContext().flags.error = true;
    return false;
  }
}

class MockLabelHandler implements IInstructionHandler {
  execute(engine: RISAEngine, args: Argument[]): bool {
    return true; // Labels do nothing during execution
  }
}

class MockLoadHandler implements IInstructionHandler {
  execute(engine: RISAEngine, args: Argument[]): bool {
    const registerName = args[0].s;
    const value = engine.parseValue(args[1]);
    if (registerName) {
      engine.getRegisterState().setRegister(registerName, value);
    }
    return true;
  }
}

mockInstructionHandlers.set("MOCK_ADD", new MockAddHandler());
mockInstructionHandlers.set("HALT", new MockHaltHandler());
mockInstructionHandlers.set("JUMP", new MockJumpHandler());
mockInstructionHandlers.set("LABEL", new MockLabelHandler());
mockInstructionHandlers.set("LOAD", new MockLoadHandler());

// Mock the instructionHandlers import
// @ts-ignore
import instructionHandlers from "../runtime/instructions";
instructionHandlers.clear();
mockInstructionHandlers.keys().forEach(key => {
  instructionHandlers.set(key, mockInstructionHandlers.get(key));
});


export function testRISAEngineConstructor(): void {
  const engine = new RISAEngine();
  assert(engine.getContext() instanceof ExtendedExecutionContext, "Context should be initialized");
  assert(engine.getStackManager() instanceof CallStackManager, "Stack manager should be initialized");
  assert(engine.getControlFlowManager() instanceof ControlFlowManager, "Control flow manager should be initialized");
}

export function testRISAEngineLoadProgramAndReset(): void {
  const engine = new RISAEngine();
  const instructions: IRISAInstruction[] = [
    new IRISAInstruction("MOCK_ADD", [Argument.fromInt(10), Argument.fromInt(20)], 0, ""),
    new IRISAInstruction("HALT", [], 0, ""),
  ];
  engine.loadProgram(instructions);

  assert(engine.getContext().instructionPointer == 0, "Instruction pointer should be reset");
  assert(engine.getContext().flags.running == false, "Running flag should be false after reset");
  assert(engine.getContext().metrics.instructionsExecuted == 0, "Instructions executed should be reset");

  engine.getContext().instructionPointer = 5; // Change IP
  engine.reset();
  assert(engine.getContext().instructionPointer == 0, "Reset should reset context");
}

export function testRISAEngineExecuteSimpleProgram(): void {
  const engine = new RISAEngine();
  const instructions: IRISAInstruction[] = [
    new IRISAInstruction("MOCK_ADD", [Argument.fromInt(10), Argument.fromInt(20)], 0, ""),
    new IRISAInstruction("HALT", [], 0, ""),
  ];
  engine.loadProgram(instructions);
  const result = engine.execute();

  assert(result.success, "Execution should be successful");
  assert(engine.getRegisterState().getRegister("result") == 30, "Result register should be 30");
  assert(result.instructionsExecuted == 2, "Two instructions should be executed");
}

export function testRISAEngineExecuteHalt(): void {
  const engine = new RISAEngine();
  const instructions: IRISAInstruction[] = [
    new IRISAInstruction("HALT", [], 0, ""),
  ];
  engine.loadProgram(instructions);
  const result = engine.execute();

  assert(result.success, "Execution should be successful");
  assert(engine.getContext().flags.halted, "Halt flag should be true");
  assert(result.instructionsExecuted == 1, "One instruction should be executed");
}

export function testRISAEngineStep(): void {
  const engine = new RISAEngine();
  const instructions: IRISAInstruction[] = [
    new IRISAInstruction("MOCK_ADD", [Argument.fromInt(5), Argument.fromInt(5)], 0, ""),
    new IRISAInstruction("HALT", [], 0, ""),
  ];
  engine.loadProgram(instructions);

  engine.getContext().flags.running = true;
  engine.step();
  assert(engine.getRegisterState().getRegister("result") == 10, "First step should execute MOCK_ADD");
  assert(engine.getContext().instructionPointer == 1, "Instruction pointer should advance");

  engine.step();
  assert(engine.getContext().flags.halted, "Second step should execute HALT");
  assert(engine.getContext().flags.running == false, "Running flag should be false");
}

export function testRISAEngineParseValue(): void {
  const engine = new RISAEngine();
  engine.getRegisterState().setRegister("myVar", 123.45);

  assert(engine.parseValue(Argument.fromInt(10)) == 10, "Parse int argument");
  assert(engine.parseValue(Argument.fromFloat(10.5)) == 10.5, "Parse float argument");
  assert(engine.parseValue(Argument.fromString("myVar")) == 123.45, "Parse string register argument");
  assert(engine.parseValue(Argument.fromString("78.9")) == 78.9, "Parse string float argument");
  assert(engine.parseValue(Argument.fromString("invalid")) == 0, "Parse invalid string argument");
}

export function testRISAEngineParsePrime(): void {
  const engine = new RISAEngine();
  assert(engine.parsePrime(Argument.fromInt(7)) == 7, "Parse valid prime");
  assert(engine.parsePrime(Argument.fromString("13")) == 13, "Parse valid prime from string");
  assert(engine.parsePrime(Argument.fromInt(4)) == 0, "Parse non-prime should return 0");
  assert(engine.parsePrime(Argument.fromInt(1)) == 0, "Parse 1 should return 0");
  assert(engine.parsePrime(Argument.fromString("invalid")) == 0, "Parse invalid string should return 0");
}

export function testRISAEngineIsPrime(): void {
  const engine = new RISAEngine(); // isPrime is a method of RISAEngine
  assert(engine.isPrime(2), "2 should be prime");
  assert(engine.isPrime(3), "3 should be prime");
  assert(engine.isPrime(5), "5 should be prime");
  assert(engine.isPrime(7), "7 should be prime");
  assert(engine.isPrime(11), "11 should be prime");
  assert(engine.isPrime(13), "13 should be prime");
  assert(!engine.isPrime(1), "1 should not be prime");
  assert(!engine.isPrime(4), "4 should not be prime");
  assert(!engine.isPrime(9), "9 should not be prime");
  assert(!engine.isPrime(10), "10 should not be prime");
}

export function testRISAEngineGetters(): void {
  const engine = new RISAEngine();
  assert(engine.getGlobalState() instanceof GlobalState, "Should return GlobalState");
  assert(engine.getPrimeEngine() instanceof PrimeStateEngine, "Should return PrimeStateEngine");
  assert(engine.getRegisterState() instanceof RegisterState, "Should return RegisterState");
  assert(engine.getMemory() instanceof HolographicMemory, "Should return HolographicMemory");
}

export function testRISAEngineJumpInstruction(): void {
  const engine = new RISAEngine();
  const instructions: IRISAInstruction[] = [
    new IRISAInstruction("MOCK_ADD", [Argument.fromInt(1), Argument.fromInt(1)], 0, ""), // IP 0
    new IRISAInstruction("JUMP", [Argument.fromString("target_label")], 0, ""),       // IP 1
    new IRISAInstruction("MOCK_ADD", [Argument.fromInt(100), Argument.fromInt(100)], 0, ""), // This should be skipped
    new IRISAInstruction("LABEL", [Argument.fromString("target_label")], 0, ""),      // IP 3
    new IRISAInstruction("MOCK_ADD", [Argument.fromInt(2), Argument.fromInt(2)], 0, ""), // IP 4
    new IRISAInstruction("HALT", [], 0, ""),                                   // IP 5
  ];
  engine.loadProgram(instructions);
  engine.execute();

  assert(engine.getRegisterState().getRegister("result") == 4, "Jump should execute correct instructions");
  assert(engine.getContext().instructionPointer == 5, "Instruction pointer should be at HALT");
}

export function runAllRuntimeTests(): void {
  console.log("Running runtime tests...");

  testRISAEngineConstructor();
  console.log("✓ testRISAEngineConstructor passed");

  testRISAEngineLoadProgramAndReset();
  console.log("✓ testRISAEngineLoadProgramAndReset passed");

  testRISAEngineExecuteSimpleProgram();
  console.log("✓ testRISAEngineExecuteSimpleProgram passed");

  testRISAEngineExecuteHalt();
  console.log("✓ testRISAEngineExecuteHalt passed");

  testRISAEngineStep();
  console.log("✓ testRISAEngineStep passed");

  testRISAEngineParseValue();
  console.log("✓ testRISAEngineParseValue passed");

  testRISAEngineParsePrime();
  console.log("✓ testRISAEngineParsePrime passed");

  testRISAEngineIsPrime();
  console.log("✓ testRISAEngineIsPrime passed");

  testRISAEngineGetters();
  console.log("✓ testRISAEngineGetters passed");

  testRISAEngineJumpInstruction();
  console.log("✓ testRISAEngineJumpInstruction passed");

  console.log("\nAll runtime tests passed! ✨");
}