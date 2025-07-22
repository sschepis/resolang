// assembly/runtime/instructions/quantum/collapse.ts

import { IInstructionHandler } from "../types";
import { RISAEngine } from "../../../runtime";
import { Argument } from "../../argument";

class CollapseInstruction implements IInstructionHandler {
  execute(engine: RISAEngine, args: Argument[]): bool {
    const primeEngine = engine.getPrimeEngine();
    const activePrimes = primeEngine.getActivePrimes();
    const amplitudes: f64[] = [];
    for (let i = 0; i < activePrimes.length; i++) {
        amplitudes.push(primeEngine.getAmplitude(activePrimes[i]));
    }
    const totalAmplitude = amplitudes.reduce((sum, amp) => sum + amp * amp, <f64>0);
    const random = Math.random() * totalAmplitude;

    let cumulative: f64 = 0;
    let selectedPrime: i32 = -1;

    for (let i = 0; i < activePrimes.length; i++) {
        const prime = activePrimes[i];
        const probability = amplitudes[i] * amplitudes[i];
        cumulative += probability;
        if (random < cumulative) {
            selectedPrime = prime;
            break;
        }
    }

    if (selectedPrime != -1) {
        for (let i = 0; i < activePrimes.length; i++) {
            const prime = activePrimes[i];
            if (prime == selectedPrime) {
                primeEngine.setAmplitude(prime, 1.0);
            } else {
                primeEngine.setAmplitude(prime, 0.0);
            }
        }
    }

    return true;
  }
}

const collapse = new CollapseInstruction();
export default collapse;