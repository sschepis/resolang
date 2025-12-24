import { Complex } from './types';

export function createComplex(real: f64, imag: f64): Complex {
  return new Complex(real, imag);
}

export function complexAdd(a: Complex, b: Complex): Complex {
  return a.add(b);
}

export function complexMultiply(a: Complex, b: Complex): Complex {
  return a.multiply(b);
}

export function complexMagnitude(a: Complex): f64 {
  return a.magnitude();
}

export function complexFromPolar(magnitude: f64, phase: f64): Complex {
  return Complex.fromPolar(magnitude, phase);
}

export function getComplexReal(a: Complex): f64 {
  return a.real;
}

export function getComplexImag(a: Complex): f64 {
  return a.imag;
}