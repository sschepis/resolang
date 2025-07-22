// assembly/runtime/instructions/resonance/factorize.ts

import { IInstructionHandler } from "../types";
import { RISAEngine } from "../../../runtime";
import { RegisterType } from "../../state/registerState";
import { Argument } from "../../argument";

class FactorizeInstruction implements IInstructionHandler {
  execute(engine: RISAEngine, args: Argument[]): bool {
    if (args.length < 2) {
        return false; // FACTORIZE requires a number and a result register.
    }

    const number = i32(Math.floor(engine.parseValue(args[0])));
    const resultReg = args[1].toString();

    const factors: i32[] = [];
    let remaining = number;

    for (let i = 2; i * i <= remaining; i++) {
        while (remaining % i == 0) {
            if (engine.isPrime(i)) {
                factors.push(i);
                const currentAmp = engine.getPrimeEngine().getAmplitude(i);
                engine.getPrimeEngine().setAmplitude(i, Math.min(1.0, currentAmp + 0.1));
            }
            remaining /= i;
        }
    }

    if (remaining > 1 && engine.isPrime(remaining)) {
        factors.push(remaining);
        const currentAmp = engine.getPrimeEngine().getAmplitude(remaining);
        engine.getPrimeEngine().setAmplitude(remaining, Math.min(1.0, currentAmp + 0.1));
    }

    engine.getRegisterState().setRegister(resultReg, factors.length, RegisterType.COUNT);

    return true;
  }
}

const factorize = new FactorizeInstruction();
export default factorize;