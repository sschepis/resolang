// assembly/core/tuples.ts

/**
 * A generic class to represent a 2-tuple (a pair of values).
 */
export class Tuple<T, U> {
  constructor(public _0: T, public _1: U) {}
}

/**
 * A generic class to represent a 3-tuple (a triplet of values).
 */
export class Triple<T, U, V> {
  constructor(public _0: T, public _1: U, public _2: V) {}
}