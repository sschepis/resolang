// assembly/runtime/instructions/quantum/measure.ts

import { IInstructionHandler } from "../types";
import { RISAEngine } from "../../../runtime";
import { RegisterType } from "../../state/registerState";
import { Argument } from "../../argument";

class MeasureInstruction implements IInstructionHandler {
  execute(engine: RISAEngine, args: Argument[]): bool {
    if (args.length < 2) {
        return false; // MEASURE requires a prime and a target register.
    }

    const prime = engine.parsePrime(args[0]);
    const targetRegister = args[1].toString();
    
    const primeEngine = engine.getPrimeEngine();
    const amplitude = primeEngine.getAmplitude(prime);
    
    // Quantum measurement - get probability and collapse
    const probability = amplitude * amplitude;
    const measurement = Math.random() < probability ? 1 : 0;
    
    // Store measurement result in register
    engine.getRegisterState().setRegister(targetRegister, measurement, RegisterType.PROBABILITY);
    
    // Collapse the state if measured as 1
    if (measurement == 1) {
        // Set this prime to maximum amplitude, others to zero
        const allPrimes = primeEngine.getActivePrimes();
        for (let i = 0; i < allPrimes.length; i++) {
            const p = allPrimes[i];
            if (p == prime) {
                primeEngine.setAmplitude(p, 1.0);
            } else {
                primeEngine.setAmplitude(p, 0.0);
            }
        }
    }
    
    return true;
  }
}

const measure = new MeasureInstruction();
export default measure;