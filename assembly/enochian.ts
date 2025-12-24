/**
 * Enochian Language Implementation
 * 
 * Maps the 3x7 Enochian grid to Prime-Twist operators.
 * Handles parsing, validation, and prime mapping.
 */

// @ts-ignore
import { PI } from './core/math';
import { getTwistAngle } from './twist';

// Enochian Primes
// @ts-ignore
const ENOCHIAN_PRIMES: StaticArray<i32> = [7, 11, 13, 17, 19, 23, 29];

export class EnochianLetter {
  constructor(
    public letter: string,
    // @ts-ignore
    public prime: i32,
    // @ts-ignore
    public mode: i32, // 1=alpha, 2=mu, 3=omega
    public name: string
  ) {}
}

export class EnochianParseResult {
  constructor(
    // @ts-ignore
    public primes: i32[],
    // @ts-ignore
    public modes: i32[],
    // @ts-ignore
    public totalTwist: f64,
    public isClosurePossible: boolean
  ) {}
}

// 3x7 Grid mapping
// Since AssemblyScript doesn't support complex object literals well, we'll use a lookup function
export function getLetterData(char: string): EnochianLetter | null {
  // Prime 7
  if (char == 'A') return new EnochianLetter('A', 7, 1, 'Un');
  if (char == 'B') return new EnochianLetter('B', 7, 2, 'Pa');
  if (char == 'C' || char == 'K') return new EnochianLetter('C', 7, 3, 'Veh');
  
  // Prime 11
  if (char == 'D') return new EnochianLetter('D', 11, 1, 'Gal');
  if (char == 'E') return new EnochianLetter('E', 11, 2, 'Graph');
  if (char == 'F') return new EnochianLetter('F', 11, 3, 'Or');
  
  // Prime 13
  if (char == 'G') return new EnochianLetter('G', 13, 1, 'Ged');
  if (char == 'H') return new EnochianLetter('H', 13, 2, 'Na');
  if (char == 'I' || char == 'Y') return new EnochianLetter('I', 13, 3, 'Gon');
  
  // Prime 17
  if (char == 'L') return new EnochianLetter('L', 17, 1, 'Ur');
  if (char == 'M') return new EnochianLetter('M', 17, 2, 'Tal');
  if (char == 'N') return new EnochianLetter('N', 17, 3, 'Drux');
  
  // Prime 19
  if (char == 'O') return new EnochianLetter('O', 19, 1, 'Med');
  if (char == 'P') return new EnochianLetter('P', 19, 2, 'Mals');
  if (char == 'Q') return new EnochianLetter('Q', 19, 3, 'Ger');
  
  // Prime 23
  if (char == 'R') return new EnochianLetter('R', 23, 1, 'Don');
  if (char == 'S') return new EnochianLetter('S', 23, 2, 'Fam');
  if (char == 'T') return new EnochianLetter('T', 23, 3, 'Gisg');
  
  // Prime 29
  if (char == 'U' || char == 'V') return new EnochianLetter('U', 29, 1, 'Van');
  if (char == 'X') return new EnochianLetter('X', 29, 2, 'Pal');
  if (char == 'Z') return new EnochianLetter('Z', 29, 3, 'Ceph');
  
  return null;
}

export function parseEnochian(text: string): EnochianParseResult {
  // @ts-ignore
  const primes = new Array<i32>();
  // @ts-ignore
  const modes = new Array<i32>();
  // @ts-ignore
  let totalTwist: f64 = 0.0;
  
  for (let i = 0; i < text.length; i++) {
    const char = text.charAt(i).toUpperCase();
    const data = getLetterData(char);
    
    if (data) {
      primes.push(data.prime);
      modes.push(data.mode);
      totalTwist += getTwistAngle(data.prime);
    }
  }
  
  const twoPi = 2.0 * PI;
  const twistMod = totalTwist % twoPi;
  const isClosurePossible = twistMod < 0.1 || (twoPi - twistMod) < 0.1;
  
  return new EnochianParseResult(primes, modes, totalTwist, isClosurePossible);
}

// @ts-ignore
export function getPreferredLetter(prime: i32, mode: i32): string {
  // Reduce to nearest Enochian prime if needed
  let targetPrime = prime;
  let found = false;
  
  for (let i = 0; i < 7; i++) {
    // @ts-ignore
    if (ENOCHIAN_PRIMES[i] == prime) {
      found = true;
      break;
    }
  }
  
  if (!found) {
    let minDiff = 1000;
    for (let i = 0; i < 7; i++) {
      // @ts-ignore
      const p = ENOCHIAN_PRIMES[i];
      const diff = Math.abs((prime % 30) - (p % 30));
      if (diff < minDiff) {
        // @ts-ignore
        minDiff = i32(diff);
        targetPrime = p;
      }
    }
  }
  
  // Map back to letter
  if (targetPrime == 7) return mode == 1 ? 'A' : mode == 2 ? 'B' : 'C';
  if (targetPrime == 11) return mode == 1 ? 'D' : mode == 2 ? 'E' : 'F';
  if (targetPrime == 13) return mode == 1 ? 'G' : mode == 2 ? 'H' : 'I';
  if (targetPrime == 17) return mode == 1 ? 'L' : mode == 2 ? 'M' : 'N';
  if (targetPrime == 19) return mode == 1 ? 'O' : mode == 2 ? 'P' : 'Q';
  if (targetPrime == 23) return mode == 1 ? 'R' : mode == 2 ? 'S' : 'T';
  if (targetPrime == 29) return mode == 1 ? 'U' : mode == 2 ? 'X' : 'Z';
  
  return '?';
}

// @ts-ignore
export function primesToEnochian(primes: i32[], preferredMode: i32 = 1): string {
  let result = '';
  for (let i = 0; i < primes.length; i++) {
    result += getPreferredLetter(primes[i], preferredMode);
  }
  return result;
}