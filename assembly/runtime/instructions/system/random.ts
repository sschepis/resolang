// assembly/runtime/instructions/system/random.ts

import { IInstructionHandler } from "../types";
import { RISAEngine } from "../../../runtime";
import { Argument } from "../../argument";

class RandomInstruction implements IInstructionHandler {
  execute(engine: RISAEngine, args: Argument[]): bool {
    if (args.length < 1) {
        return false; // RANDOM requires a prime.
    }

    const prime = engine.parsePrime(args[0]);
    const primeEngine = engine.getPrimeEngine();

    primeEngine.setAmplitude(prime, Math.random());
    primeEngine.setPhase(prime, Math.random() * 2 * Math.PI);

    return true;
  }
}

const random = new RandomInstruction();
export default random;