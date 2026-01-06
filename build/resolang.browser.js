// Browser-compatible wrapper for resolang WASM
// This module provides lazy initialization to avoid top-level await issues

let wasmModule = null;
let initPromise = null;

/**
 * Initialize the WASM module. Must be called before using any exports.
 * @param {string|URL} [wasmUrl] - Optional URL to the WASM file. Defaults to resolang.wasm in the same directory.
 * @returns {Promise<object>} The initialized module exports
 */
export async function init(wasmUrl) {
  if (wasmModule) {
    return wasmModule;
  }
  
  if (initPromise) {
    return initPromise;
  }
  
  initPromise = (async () => {
    // Determine the WASM URL
    const url = wasmUrl || new URL('resolang.wasm', import.meta.url);
    
    // Load and compile the WASM module
    const wasmBuffer = await fetch(url).then(r => r.arrayBuffer());
    const compiled = await WebAssembly.compile(wasmBuffer);
    
    // Instantiate with the same adaptedImports as the original
    const adaptedImports = {
      env: Object.assign(Object.create(globalThis), {
        abort(message, fileName, lineNumber, columnNumber) {
          message = __liftString(message >>> 0);
          fileName = __liftString(fileName >>> 0);
          lineNumber = lineNumber >>> 0;
          columnNumber = columnNumber >>> 0;
          throw Error(`${message} in ${fileName}:${lineNumber}:${columnNumber}`);
        },
        seed() {
          return Date.now() * Math.random();
        },
        "Date.now"() {
          return Date.now();
        },
        "console.log"(text) {
          text = __liftString(text >>> 0);
          console.log(text);
        },
      }),
    };
    
    const { exports } = await WebAssembly.instantiate(compiled, adaptedImports);
    const memory = exports.memory;
    
    // Helper functions from the original bindings
    function __liftString(pointer) {
      if (!pointer) return null;
      const end = pointer + new Uint32Array(memory.buffer)[(pointer - 4) >>> 2] >>> 1;
      const memoryU16 = new Uint16Array(memory.buffer);
      let start = pointer >>> 1;
      let string = "";
      while (end - start > 1024) {
        string += String.fromCharCode(...memoryU16.subarray(start, start += 1024));
      }
      return string + String.fromCharCode(...memoryU16.subarray(start, end));
    }
    
    function __lowerString(value) {
      if (value == null) return 0;
      const length = value.length,
            pointer = exports.__new(length << 1, 2) >>> 0,
            memoryU16 = new Uint16Array(memory.buffer);
      for (let i = 0; i < length; ++i) {
        memoryU16[(pointer >>> 1) + i] = value.charCodeAt(i);
      }
      return pointer;
    }
    
    function __liftArray(liftElement, align, pointer) {
      if (!pointer) return null;
      const dataStart = __getU32(pointer + 4);
      const length = __dataview.getInt32(pointer + 12, true);
      const values = new Array(length);
      for (let i = 0; i < length; ++i) {
        values[i] = liftElement(dataStart + (i << align));
      }
      return values;
    }
    
    function __lowerArray(lowerElement, id, align, values) {
      if (values == null) return 0;
      const length = values.length,
            buffer = exports.__pin(exports.__new(length << align, 1)) >>> 0,
            header = exports.__new(16, id) >>> 0;
      __setU32(header + 0, buffer);
      __dataview.setInt32(header + 4, buffer, true);
      __dataview.setInt32(header + 8, length << align, true);
      __dataview.setInt32(header + 12, length, true);
      for (let i = 0; i < length; ++i) {
        lowerElement(buffer + (i << align), values[i]);
      }
      exports.__unpin(buffer);
      return header;
    }
    
    function __liftTypedArray(constructor, pointer) {
      if (!pointer) return null;
      return new constructor(
        memory.buffer,
        __getU32(pointer + 4),
        __dataview.getInt32(pointer + 8, true) / constructor.BYTES_PER_ELEMENT
      ).slice();
    }
    
    function __lowerTypedArray(constructor, id, align, values) {
      if (values == null) return 0;
      const length = values.length,
            buffer = exports.__pin(exports.__new(length << align, 1)) >>> 0,
            header = exports.__new(12, id) >>> 0;
      __setU32(header + 0, buffer);
      __dataview.setInt32(header + 4, buffer, true);
      __dataview.setInt32(header + 8, length << align, true);
      new constructor(memory.buffer, buffer, length).set(values);
      exports.__unpin(buffer);
      return header;
    }
    
    let __dataview = new DataView(memory.buffer);
    function __getI32(pointer) {
      try { return __dataview.getInt32(pointer, true); }
      catch { __dataview = new DataView(memory.buffer); return __dataview.getInt32(pointer, true); }
    }
    function __getU32(pointer) {
      try { return __dataview.getUint32(pointer, true); }
      catch { __dataview = new DataView(memory.buffer); return __dataview.getUint32(pointer, true); }
    }
    function __getF64(pointer) {
      try { return __dataview.getFloat64(pointer, true); }
      catch { __dataview = new DataView(memory.buffer); return __dataview.getFloat64(pointer, true); }
    }
    function __setU32(pointer, value) {
      try { __dataview.setUint32(pointer, value, true); }
      catch { __dataview = new DataView(memory.buffer); __dataview.setUint32(pointer, value, true); }
    }
    function __setF64(pointer, value) {
      try { __dataview.setFloat64(pointer, value, true); }
      catch { __dataview = new DataView(memory.buffer); __dataview.setFloat64(pointer, value, true); }
    }
    
    const refcounts = new Map();
    function __retain(pointer) {
      if (pointer) {
        const count = refcounts.get(pointer);
        if (count) refcounts.set(pointer, count + 1);
        else refcounts.set(pointer, 1);
      }
      return pointer;
    }
    function __release(pointer) {
      if (pointer) {
        const count = refcounts.get(pointer);
        if (count === 1) {
          refcounts.delete(pointer);
          exports.__unpin(pointer);
        }
        else if (count) refcounts.set(pointer, count - 1);
      }
    }
    
    const registry = new FinalizationRegistry(__release);
    function __liftInternref(pointer) {
      if (!pointer) return null;
      const ref = new Object();
      registry.register(ref, exports.__pin(pointer));
      return ref;
    }
    function __lowerInternref(ref) {
      if (ref == null) return 0;
      return exports.__pin(ref) >>> 0;
    }
    function __notnull() {
      throw TypeError("value must not be null");
    }
    
    // Create adapted exports for the most commonly used functions
    wasmModule = {
      // Memory and internals
      memory,
      __pin: exports.__pin,
      __unpin: exports.__unpin,
      __new: exports.__new,
      
      // Discrete Observer functions
      createDiscreteObserverState: (primes, config) => {
        const primesArr = __lowerArray(__setU32, 33, 2, primes) || __notnull();
        const configPtr = config ? __lowerInternref(config) : 0;
        exports.__setArgumentsLength(arguments.length);
        return __liftInternref(exports.createDiscreteObserverState(primesArr, configPtr) >>> 0);
      },
      
      discreteStep: (state, driveInput, plasticity) => {
        const statePtr = __retain(__lowerInternref(state) || __notnull());
        const drivePtr = driveInput ? __lowerTypedArray(Float64Array, 185, 3, driveInput) : 0;
        const plasticityVal = plasticity ? 1 : 0;
        try {
          exports.__setArgumentsLength(arguments.length);
          return __liftInternref(exports.discreteStep(statePtr, drivePtr, plasticityVal) >>> 0);
        } finally {
          __release(statePtr);
        }
      },
      
      getPhases: (state) => {
        const statePtr = __lowerInternref(state) || __notnull();
        return __liftTypedArray(Int32Array, exports.getPhases(statePtr) >>> 0);
      },
      
      getAmplitudes: (state) => {
        const statePtr = __lowerInternref(state) || __notnull();
        return __liftTypedArray(Float64Array, exports.getAmplitudes(statePtr) >>> 0);
      },
      
      getSMF: (state) => {
        const statePtr = __lowerInternref(state) || __notnull();
        return __liftTypedArray(Int32Array, exports.getSMF(statePtr) >>> 0);
      },
      
      getWeights: (state) => {
        const statePtr = __lowerInternref(state) || __notnull();
        return __liftTypedArray(Int32Array, exports.getWeights(statePtr) >>> 0);
      },
      
      getStateMetrics: (state) => {
        const statePtr = __lowerInternref(state) || __notnull();
        return __liftTypedArray(Float64Array, exports.getStateMetrics(statePtr) >>> 0);
      },
      
      boostIndex: (state, index) => {
        const statePtr = __lowerInternref(state) || __notnull();
        exports.boostIndex(statePtr, index);
      },
      
      boostPrime: (state, prime) => {
        const statePtr = __lowerInternref(state) || __notnull();
        exports.boostPrime(statePtr, prime);
      },
      
      dampenAll: (state) => {
        const statePtr = __lowerInternref(state) || __notnull();
        exports.dampenAll(statePtr);
      },
      
      applyHebbianLearning: (state, activeIndices) => {
        const statePtr = __retain(__lowerInternref(state) || __notnull());
        const indicesPtr = __lowerTypedArray(Int32Array, 200, 2, activeIndices) || __notnull();
        try {
          return exports.applyHebbianLearning(statePtr, indicesPtr) != 0;
        } finally {
          __release(statePtr);
        }
      },
      
      updateSMF: (state, activeIndices) => {
        const statePtr = __retain(__lowerInternref(state) || __notnull());
        const indicesPtr = __lowerTypedArray(Int32Array, 200, 2, activeIndices) || __notnull();
        try {
          exports.updateSMF(statePtr, indicesPtr);
        } finally {
          __release(statePtr);
        }
      },
      
      computeHistogramCoherence: (state) => {
        const statePtr = __lowerInternref(state) || __notnull();
        return exports.computeHistogramCoherence(statePtr);
      },
      
      computeSmfEntropy: (state) => {
        const statePtr = __lowerInternref(state) || __notnull();
        return exports.computeSmfEntropy(statePtr);
      },
      
      isLockedUp: (state) => {
        const statePtr = __lowerInternref(state) || __notnull();
        return exports.isLockedUp(statePtr) != 0;
      },
      
      // Quaternion functions
      createQuaternion: (w, x, y, z) => {
        return __liftInternref(exports.createQuaternion(w, x, y, z) >>> 0);
      },
      
      quaternionMultiply: (q1, q2) => {
        const q1Ptr = __retain(__lowerInternref(q1) || __notnull());
        const q2Ptr = __lowerInternref(q2) || __notnull();
        try {
          return __liftInternref(exports.quaternionMultiply(q1Ptr, q2Ptr) >>> 0);
        } finally {
          __release(q1Ptr);
        }
      },
      
      quaternionNormalize: (q) => {
        const qPtr = __lowerInternref(q) || __notnull();
        return __liftInternref(exports.quaternionNormalize(qPtr) >>> 0);
      },
      
      getQuaternionW: (q) => {
        const qPtr = __lowerInternref(q) || __notnull();
        return exports.getQuaternionW(qPtr);
      },
      
      getQuaternionX: (q) => {
        const qPtr = __lowerInternref(q) || __notnull();
        return exports.getQuaternionX(qPtr);
      },
      
      getQuaternionY: (q) => {
        const qPtr = __lowerInternref(q) || __notnull();
        return exports.getQuaternionY(qPtr);
      },
      
      getQuaternionZ: (q) => {
        const qPtr = __lowerInternref(q) || __notnull();
        return exports.getQuaternionZ(qPtr);
      },
      
      // Pipeline functions
      createDiscretePipeline: () => {
        return __liftInternref(exports.createDiscretePipeline() >>> 0);
      },
      
      createFastDiscretePipeline: () => {
        return __liftInternref(exports.createFastDiscretePipeline() >>> 0);
      },
      
      // Config getters
      get DISCRETE_CONFIG() {
        return __liftInternref(exports.DISCRETE_CONFIG.value >>> 0);
      },
      
      get DEFAULT_PRIMES() {
        return __liftArray(__getI32, 2, exports.DEFAULT_PRIMES.value >>> 0);
      },
      
      get ENOCHIAN_PRIMES() {
        return __liftArray(__getI32, 2, exports.ENOCHIAN_PRIMES.value >>> 0);
      },
      
      // SMF functions
      createSMFFromValues: (values) => {
        const valuesPtr = __lowerTypedArray(Float64Array, 185, 3, values) || __notnull();
        return __liftInternref(exports.createSMFFromValues(valuesPtr) >>> 0);
      },
      
      createSMFFromText: (text) => {
        const textPtr = __lowerString(text) || __notnull();
        return __liftInternref(exports.createSMFFromText(textPtr) >>> 0);
      },
      
      // Math functions
      generatePrimes: (n) => {
        return __liftArray(pointer => __getU32(pointer) >>> 0, 2, exports.generatePrimes(n) >>> 0);
      },
      
      isPrimeOptimized: (n) => {
        return exports.isPrimeOptimized(BigInt(n)) != 0;
      },
      
      // String utilities  
      escapeJSON: (str) => {
        const strPtr = __lowerString(str) || __notnull();
        return __liftString(exports.escapeJSON(strPtr) >>> 0);
      },
      
      // State functions
      getSentientState: () => {
        return __liftString(exports.getSentientState() >>> 0);
      },
      
      discreteObserverGetState: () => {
        return __liftString(exports.discreteObserverGetState() >>> 0);
      },
      
      // Raw exports for advanced usage
      __exports: exports,
      __helpers: {
        __liftString,
        __lowerString,
        __liftArray,
        __lowerArray,
        __liftTypedArray,
        __lowerTypedArray,
        __liftInternref,
        __lowerInternref,
        __retain,
        __release,
        __getI32,
        __getU32,
        __getF64,
        __setU32,
        __setF64,
      }
    };
    
    return wasmModule;
  })();
  
  return initPromise;
}

/**
 * Check if the module is initialized
 * @returns {boolean}
 */
export function isInitialized() {
  return wasmModule !== null;
}

/**
 * Get the module exports. Throws if not initialized.
 * @returns {object}
 */
export function getModule() {
  if (!wasmModule) {
    throw new Error('resolang not initialized. Call init() first.');
  }
  return wasmModule;
}

// Default export is the init function
export default init;