// utils.ts
// This file contains various utility functions used by the ResoLang implementation.

import { Phase } from "./resolang";

/**
 * Calculates a conceptual "entropy rate" for a given phase ring.
 * This is a simplified metric, representing the variance or deviation of phases
 * from an "ideal" progression. A negative value suggests stability/alignment.
 * @param phaseRing The array of phases to analyze.
 * @returns A floating-point number representing the conceptual entropy rate.
 */
export function entropyRate(phaseRing: Array<Phase>): f64 {
  if (phaseRing.length === 0) return 0.0;

  let sumDiffSq: f64 = 0.0;
  // Calculate variance from a simple linear progression as "ideal" phase.
  // This is a conceptual model for "entropy rate" in the context of ResoLang.
  for (let i = 0; i < phaseRing.length; i++) {
    const expectedPhase = (<f64>i + 1.0) * Math.PI / <f64>phaseRing.length; // Simple linear progression
    sumDiffSq += Math.pow(phaseRing[i] - expectedPhase, 2);
  }
  // Return the negative square root of the average squared difference.
  // A negative value implies the phases are relatively stable or aligned.
  return -Math.sqrt(sumDiffSq / <f64>phaseRing.length);
}

/**
 * Simulates the 'align' operation for a phase ring.
 * In ResoLang, this would be a complex phase alignment process.
 * Here, it conceptually aligns phases to a reference (e.g., all zeros).
 * @param phaseRing The array of phases to align.
 * @returns A new array of phases representing the aligned state.
 */
export function align(phaseRing: Array<Phase>): Array<Phase> {
  const aligned = new Array<Phase>(phaseRing.length);
  for (let i = 0; i < phaseRing.length; i++) {
    aligned[i] = 0.0; // Conceptually aligned to a zero reference
  }
  return aligned;
}

/**
 * Generates a conceptual symbol from an array of primes.
 * This is a placeholder for "Symbolic Pattern Construction."
 * @param primes An array of prime numbers.
 * @returns A simple string symbol derived from the primes.
 */
export function generateSymbol(primes: Array<u32>): string {
    let hash: u32 = 0;
    for (let i = 0; i < primes.length; i++) {
        hash = (hash * 31 + primes[i]) % 1000003; // Simple prime-based hash
    }
    // Convert the hash to a simple 3-letter symbol using uppercase letters.
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let symbol = "";
    let tempHash = hash;
    for (let i = 0; i < 3; i++) {
        symbol += chars.charAt(tempHash % chars.length);
        tempHash = <u32>Math.floor(tempHash / <f64>chars.length);
    }
    return symbol;
}

/**
 * Formats a floating-point number to a fixed number of decimal places.
 * This is a replacement for JavaScript's toFixed() method which is not available in AssemblyScript.
 * @param value The number to format
 * @param decimals The number of decimal places (default: 2)
 * @returns A string representation of the number with fixed decimal places
 */
export function toFixed(value: f64, decimals: i32 = 2): string {
    if (decimals < 0) decimals = 0;
    
    // Use math approach instead of string manipulation to avoid complexity
    const multiplier = Math.pow(10, decimals);
    const rounded = Math.round(value * multiplier) / multiplier;
    
    // Convert to string
    let str = rounded.toString();
    
    // Find decimal point
    let dotIndex = str.indexOf(".");
    
    if (dotIndex === -1) {
        // No decimal point, add it
        str += ".";
        dotIndex = str.length - 1;
    }
    
    // Calculate current decimal places
    const currentDecimals = str.length - dotIndex - 1;
    
    // Add or remove decimal places as needed
    if (currentDecimals < decimals) {
        // Add trailing zeros
        for (let i = currentDecimals; i < decimals; i++) {
            str += "0";
        }
    } else if (currentDecimals > decimals) {
        // Truncate (should not happen with proper rounding, but just in case)
        str = str.substring(0, dotIndex + decimals + 1);
    }
    
    return str;
}
