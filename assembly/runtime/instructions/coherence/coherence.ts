// assembly/runtime/instructions/coherence/coherence.ts

import { IInstructionHandler } from "../types";
import { RISAEngine } from "../../../runtime";
import { RegisterType } from "../../state/registerState";
import { Argument } from "../../argument";

class CoherenceInstruction implements IInstructionHandler {
  execute(engine: RISAEngine, args: Argument[]): bool {
    if (args.length < 3) {
        return false; // COHERENCE requires two primes and a target register.
    }

    const prime1 = engine.parsePrime(args[0]);
    const prime2 = engine.parsePrime(args[1]);
    const targetRegister = args[2].toString();
    
    const globalState = engine.getGlobalState();
    
    // Calculate pairwise coherence between the two primes
    const coherenceResult = globalState.calculatePairwiseCoherence(prime1, prime2);
    
    // Store the coherence value in the target register
    engine.getRegisterState().setRegister(targetRegister, coherenceResult.value, RegisterType.COHERENCE);
    
    // Also store timestamp for debugging
    engine.getRegisterState().setRegister('COHERENCE_TIMESTAMP', coherenceResult.timestamp, RegisterType.GENERAL);
    
    return true;
  }
}

const coherence = new CoherenceInstruction();
export default coherence;