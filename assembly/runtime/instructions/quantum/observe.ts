// assembly/runtime/instructions/quantum/observe.ts

import { IInstructionHandler } from "../types";
import { RISAEngine } from "../../../runtime";
import { RegisterType } from "../../state/registerState";
import { Argument } from "../../argument";

class ObserveInstruction implements IInstructionHandler {
  execute(engine: RISAEngine, args: Argument[]): bool {
    if (args.length < 1) {
        return false; // OBSERVE requires a prime to observe.
    }

    const primeToObserve = engine.parsePrime(args[0]);
    const primeEngine = engine.getPrimeEngine();
    const registerState = engine.getRegisterState();
    
    const amplitude = primeEngine.getAmplitude(primeToObserve);
    const phase = primeEngine.getPhase(primeToObserve);
    
    // If a register name is provided, store the results
    if (args.length >= 2) {
        const registerBase = args[1].toString();
        registerState.setRegister(`${registerBase}_amp`, amplitude, RegisterType.AMPLITUDE);
        registerState.setRegister(`${registerBase}_phase`, phase, RegisterType.PHASE);
    }
    
    // Perform measurement collapse based on probability
    const probability = amplitude * amplitude;
    if (Math.random() < probability) {
        // Collapse to this prime
        const allPrimes = primeEngine.getActivePrimes();
        if (allPrimes) {
            for (let i = 0; i < allPrimes.length; i++) {
                const prime = allPrimes[i];
                if (prime == primeToObserve) {
                    primeEngine.setAmplitude(prime, 1.0);
                } else {
                    primeEngine.setAmplitude(prime, 0.0);
                }
            }
        }
    }

    return true;
  }
}

const observe = new ObserveInstruction();
export default observe;