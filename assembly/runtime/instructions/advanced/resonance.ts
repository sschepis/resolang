// assembly/runtime/instructions/advanced/resonance.ts

import { IInstructionHandler } from "../types";
import { RISAEngine } from "../../../runtime";
import { RegisterType } from "../../state/registerState";
import { Argument } from "../../argument";

class ResonanceInstruction implements IInstructionHandler {
  execute(engine: RISAEngine, args: Argument[]): bool {
    if (args.length < 3) return false;
    const pVar = args[0].toString();
    const nVar = args[1].toString();
    const resultVar = args[2].toString();

    const p = engine.getRegisterState().getRegister(pVar);
    const n = engine.getRegisterState().getRegister(nVar);
    
    const result = engine.getPrimeEngine().applyResonanceOperator(i32(n), i32(p));
    // Storing complex numbers in registers is not yet supported.
    // This is a placeholder.

    return true;
  }
}
const Resonance = new ResonanceInstruction();

class FactorizeInstruction implements IInstructionHandler {
  execute(engine: RISAEngine, args: Argument[]): bool {
    if (args.length < 2) return false;
    const nVar = args[0].toString();
    const resultVar = args[1].toString();

    const n = engine.getRegisterState().getRegister(nVar);
    const result = engine.getPrimeEngine().createNumberState(i32(n));
    // Storing maps in registers is not yet supported.
    // This is a placeholder.

    return true;
  }
}
const Factorize = new FactorizeInstruction();

export { Resonance, Factorize };