import { RISAEngine, IRISAInstruction } from '../runtime';
import { Argument } from '../runtime/argument';

function testLoadAndExecute(): void {
    const engine = new RISAEngine();
    const instructions: IRISAInstruction[] = [
      new IRISAInstruction("LOAD", [Argument.fromInt(2), Argument.fromFloat(0.5)]),
      new IRISAInstruction("HALT", [])
    ];

    engine.loadProgram(instructions);
    const result = engine.execute();

    assert(result.success);
    assert(result.instructionsExecuted == 2);
}

export function runAllTests(): void {
    testLoadAndExecute();
}