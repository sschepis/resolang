// assembly/runtime/instructions/types.ts

import { RISAEngine } from '../../runtime';
import { Argument } from '../argument';

export interface IInstructionHandler {
  execute(engine: RISAEngine, args: Argument[]): bool;
}