// assembly/runtime/instructions/index.ts

import { InstructionHandler } from './types';
import breakInstruction from './flow/break';
import call from './flow/call';
import continueInstruction from './flow/continue';
import elseInstruction from './flow/else';
import endif from './flow/endif';

const instructionHandlers = new Map<string, InstructionHandler>();

instructionHandlers.set("BREAK", breakInstruction);
instructionHandlers.set("CALL", call);
instructionHandlers.set("CONTINUE", continueInstruction);
instructionHandlers.set("ELSE", elseInstruction);
instructionHandlers.set("ENDIF", endif);
import endloop from './flow/endloop';
instructionHandlers.set("ENDLOOP", endloop);
import endwhile from './flow/endwhile';
instructionHandlers.set("ENDWHILE", endwhile);
import gotoInstruction from './flow/goto';
instructionHandlers.set("GOTO", gotoInstruction);
import ifInstruction from './flow/if';
instructionHandlers.set("IF", ifInstruction);
import ifcoh from './flow/ifcoh';
instructionHandlers.set("IFCOH", ifcoh);

import load from './symbolic/load';
instructionHandlers.set("LOAD", load);
import add from './symbolic/add';
instructionHandlers.set("ADD", add);
import scale from './symbolic/scale';
instructionHandlers.set("SCALE", scale);
import mix from './symbolic/mix';
instructionHandlers.set("MIX", mix);

import setphase from './phase/setphase';
instructionHandlers.set("SETPHASE", setphase);
import advphase from './phase/advphase';
instructionHandlers.set("ADVPHASE", advphase);
import decohere from './phase/decohere';
instructionHandlers.set("DECOHERE", decohere);
import entangle from './phase/entangle';
instructionHandlers.set("ENTANGLE", entangle);

import collapse from './quantum/collapse';
instructionHandlers.set("COLLAPSE", collapse);
import measure from './quantum/measure';
instructionHandlers.set("MEASURE", measure);
import observe from './quantum/observe';
instructionHandlers.set("OBSERVE", observe);
import reconstruct from './quantum/reconstruct';
instructionHandlers.set("RECONSTRUCT", reconstruct);

import entropy from './resonance/entropy';
instructionHandlers.set("ENTROPY", entropy);
import evolve from './resonance/evolve';
instructionHandlers.set("EVOLVE", evolve);
import factorize from './resonance/factorize';
instructionHandlers.set("FACTORIZE", factorize);
import resonance from './resonance/resonance';
instructionHandlers.set("RESONANCE", resonance);

import coherence from './coherence/coherence';
instructionHandlers.set("COHERENCE", coherence);
import coherenceall from './coherence/coherenceall';
instructionHandlers.set("COHERENCEALL", coherenceall);
import threshold from './coherence/threshold';
instructionHandlers.set("THRESHOLD", threshold);
import waitcoh from './coherence/waitcoh';
instructionHandlers.set("WAITCOH", waitcoh);

import { HoloStore, HoloRetrieve, HoloFragment, HoloReconstruct } from './advanced/holographic';
instructionHandlers.set("HOLO_STORE", HoloStore);
instructionHandlers.set("HOLO_RETRIEVE", HoloRetrieve);
instructionHandlers.set("HOLO_FRAGMENT", HoloFragment);
instructionHandlers.set("HOLO_RECONSTRUCT", HoloReconstruct);

import { BasisCreate, BasisTransform, BasisSyncAll, CrossBasisCoherence } from './advanced/multiBasis';
instructionHandlers.set("BASIS_CREATE", BasisCreate);
instructionHandlers.set("BASIS_TRANSFORM", BasisTransform);
instructionHandlers.set("BASIS_SYNC_ALL", BasisSyncAll);
instructionHandlers.set("CROSS_BASIS_COHERENCE", CrossBasisCoherence);

import { QuatCreate, QuatSend, QuatReceive, QuatPhaseLock } from './advanced/quaternionic';
instructionHandlers.set("QUAT_CREATE", QuatCreate);
instructionHandlers.set("QUAT_SEND", QuatSend);
instructionHandlers.set("QUAT_RECEIVE", QuatReceive);
instructionHandlers.set("QUAT_PHASE_LOCK", QuatPhaseLock);

import { Resonance, Factorize } from './advanced/resonance';
instructionHandlers.set("ADV_RESONANCE", Resonance);
instructionHandlers.set("ADV_FACTORIZE", Factorize);

import halt from './system/halt';
instructionHandlers.set("HALT", halt);
import output from './system/output';
instructionHandlers.set("OUTPUT", output);
import random from './system/random';
instructionHandlers.set("RANDOM", random);
import tick from './system/tick';
instructionHandlers.set("TICK", tick);

export default instructionHandlers;