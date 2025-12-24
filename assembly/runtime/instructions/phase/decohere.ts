// assembly/runtime/instructions/phase/decohere.ts

import { IInstructionHandler } from "../types";
import { RISAEngine } from "../../../runtime";
import { Argument } from "../../argument";

class DecohereInstruction implements IInstructionHandler {
  execute(engine: RISAEngine, args: Argument[]): bool {
    if (args.length < 1) {
        return false; // DECOHERE requires a prime.
    }

    const prime = engine.parsePrime(args[0]);

    engine.getPrimeEngine().setPhase(prime, Math.random() * 2 * Math.PI);

    return true;
  }
}

const decohere = new DecohereInstruction();
export default decohere;