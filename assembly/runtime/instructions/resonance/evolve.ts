// assembly/runtime/instructions/resonance/evolve.ts

import { IInstructionHandler } from "../types";
import { RISAEngine } from "../../../runtime";
import { RegisterType } from "../../state/registerState";
import { Argument } from "../../argument";

class EvolveInstruction implements IInstructionHandler {
  execute(engine: RISAEngine, args: Argument[]): bool {
    if (args.length < 1) {
        return false; // EVOLVE requires a time step parameter.
    }

    const timeStep = engine.parseValue(args[0]);
    
    const primeEngine = engine.getPrimeEngine();
    const globalState = engine.getGlobalState();
    
    // Update global entropy with the time step
    globalState.evolveEntropy(timeStep);
    
    // Get current entropy for the evolution factor
    const currentEntropy = globalState.getEntropy();
    const entropyFactor = Math.exp(-currentEntropy * timeStep);
    
    // Evolve each active prime's amplitude
    const activePrimes = primeEngine.getActivePrimes();
    for (let i = 0; i < activePrimes.length; i++) {
        const prime = activePrimes[i];
        const currentAmplitude = primeEngine.getAmplitude(prime);
        const newAmplitude = currentAmplitude * entropyFactor;
        primeEngine.setAmplitude(prime, newAmplitude);
    }
    
    // Store evolution parameters in registers
    engine.getRegisterState().setRegister('EVOLUTION_RATE', timeStep, RegisterType.GENERAL);
    engine.getRegisterState().setRegister('ENTROPY', currentEntropy, RegisterType.ENTROPY);
    
    return true;
  }
}

const evolve = new EvolveInstruction();
export default evolve;