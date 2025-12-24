// assembly/runtime/instructions/symbolic/scale.ts

import { IInstructionHandler } from "../types";
import { RISAEngine } from "../../../runtime";
import { Argument } from "../../argument";

class ScaleInstruction implements IInstructionHandler {
  execute(engine: RISAEngine, args: Argument[]): bool {
    if (args.length < 2) {
        return false; // SCALE requires a prime and a factor.
    }

    const prime = engine.parsePrime(args[0]);
    const factor = engine.parseValue(args[1]);

    const currentAmplitude = engine.getPrimeEngine().getAmplitude(prime);
    const newAmplitude = Math.max(0, Math.min(1, currentAmplitude * factor));

    engine.getPrimeEngine().setAmplitude(prime, newAmplitude);

    return true;
  }
}

const scale = new ScaleInstruction();
export default scale;