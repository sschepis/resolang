// assembly/runtime/instructions/phase/advphase.ts

import { IInstructionHandler } from "../types";
import { RISAEngine } from "../../../runtime";
import { Argument } from "../../argument";

class AdvphaseInstruction implements IInstructionHandler {
  execute(engine: RISAEngine, args: Argument[]): bool {
    if (args.length < 2) {
        return false; // ADVPHASE requires a prime and a delta-time value.
    }

    const prime = engine.parsePrime(args[0]);
    const deltaTime = engine.parseValue(args[1]);

    const currentPhase = engine.getPrimeEngine().getPhase(prime);
    const newPhase = (currentPhase + deltaTime / prime) % (2 * Math.PI);

    engine.getPrimeEngine().setPhase(prime, newPhase);

    return true;
  }
}

const advphase = new AdvphaseInstruction();
export default advphase;