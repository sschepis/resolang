// assembly/runtime/instructions/phase/entangle.ts

import { IInstructionHandler } from "../types";
import { RISAEngine } from "../../../runtime";
import { Argument } from "../../argument";

class EntangleInstruction implements IInstructionHandler {
  execute(engine: RISAEngine, args: Argument[]): bool {
    if (args.length < 2) {
        return false; // ENTANGLE requires two primes.
    }

    const prime1 = engine.parsePrime(args[0]);
    const prime2 = engine.parsePrime(args[1]);

    engine.getPrimeEngine().entangle(prime1, prime2);

    return true;
  }
}

const entangle = new EntangleInstruction();
export default entangle;