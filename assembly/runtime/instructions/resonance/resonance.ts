// assembly/runtime/instructions/resonance/resonance.ts

import { IInstructionHandler } from "../types";
import { RISAEngine } from "../../../runtime";
import { Argument } from "../../argument";

class ResonanceInstruction implements IInstructionHandler {
  execute(engine: RISAEngine, args: Argument[]): bool {
    if (args.length < 2) {
        return false; // RESONANCE requires a prime and a value.
    }

    const prime = engine.parsePrime(args[0]);
    const value = engine.parseValue(args[1]);

    const primeEngine = engine.getPrimeEngine();
    const currentPhase = primeEngine.getPhase(prime);
    const phaseShift = 2 * Math.PI * Math.log(value) / Math.log(prime as f64);
    primeEngine.setPhase(prime, currentPhase + phaseShift);

    return true;
  }
}

const resonance = new ResonanceInstruction();
export default resonance;