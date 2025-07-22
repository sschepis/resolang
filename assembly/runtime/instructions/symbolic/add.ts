// assembly/runtime/instructions/symbolic/add.ts

import { IInstructionHandler } from "../types";
import { RISAEngine } from "../../../runtime";
import { Argument } from "../../argument";

class AddInstruction implements IInstructionHandler {
  execute(engine: RISAEngine, args: Argument[]): bool {
    if (args.length < 2) {
        return false; // ADD requires a prime and a value.
    }

    const prime = engine.parsePrime(args[0]);
    const value = engine.parseValue(args[1]);

    const currentAmplitude = engine.getPrimeEngine().getAmplitude(prime);
    const newAmplitude = Math.max(0, Math.min(1, currentAmplitude + value));

    engine.getPrimeEngine().setAmplitude(prime, newAmplitude);

    return true;
  }
}

const add = new AddInstruction();
export default add;