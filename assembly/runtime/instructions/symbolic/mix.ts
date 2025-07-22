// assembly/runtime/instructions/symbolic/mix.ts

import { IInstructionHandler } from "../types";
import { RISAEngine } from "../../../runtime";
import { Argument } from "../../argument";

class MixInstruction implements IInstructionHandler {
  execute(engine: RISAEngine, args: Argument[]): bool {
    if (args.length < 3) {
        return false; // MIX requires two primes and a ratio.
    }

    const prime1 = engine.parsePrime(args[0]);
    const prime2 = engine.parsePrime(args[1]);
    const ratio = engine.parseValue(args[2]);

    if (ratio < 0 || ratio > 1) {
        return false; // Mix ratio must be between 0 and 1.
    }

    const amp1 = engine.getPrimeEngine().getAmplitude(prime1);
    const amp2 = engine.getPrimeEngine().getAmplitude(prime2);

    const newAmp1 = amp1 * (1 - ratio) + amp2 * ratio;

    engine.getPrimeEngine().setAmplitude(prime1, Math.max(0, Math.min(1, newAmp1)));

    return true;
  }
}

const mix = new MixInstruction();
export default mix;