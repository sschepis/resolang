// assembly/runtime/instructions/flow/ifcoh.ts

import { IInstructionHandler } from "../types";
import { RISAEngine } from "../../../runtime";
import { Argument } from "../../argument";

class IfcohInstruction implements IInstructionHandler {
  execute(engine: RISAEngine, args: Argument[]): bool {
    if (args.length < 3) {
        return false; // IFCOH requires two primes, an operator, and a threshold value.
    }

    const prime1 = engine.parsePrime(args[0]);
    const prime2 = engine.parsePrime(args[1]);
    const operator = args[2].toString().toUpperCase();
    const threshold = engine.parseValue(args[3]);

    const coherence = engine.getGlobalState().calculatePairwiseCoherence(prime1, prime2);

    let condition = false;
    if (operator == "EQ" || operator == "==") {
        condition = coherence.value == threshold;
    } else if (operator == "NE" || operator == "!=") {
        condition = coherence.value != threshold;
    } else if (operator == "LT" || operator == "<") {
        condition = coherence.value < threshold;
    } else if (operator == "LE" || operator == "<=") {
        condition = coherence.value <= threshold;
    } else if (operator == "GT" || operator == ">") {
        condition = coherence.value > threshold;
    } else if (operator == "GE" || operator == ">=") {
        condition = coherence.value >= threshold;
    } else {
        return false; // Unknown operator
    }

    engine.getStackManager().pushCondition(engine.getContext(), condition);

    if (!condition) {
        engine.skipToElseOrEndIf();
    }

    return true;
  }
}

const ifcoh = new IfcohInstruction();
export default ifcoh;