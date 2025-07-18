async function instantiate(module, imports = {}) {
  const adaptedImports = {
    env: Object.assign(Object.create(globalThis), imports.env || {}, {
      abort(message, fileName, lineNumber, columnNumber) {
        // ~lib/builtins/abort(~lib/string/String | null?, ~lib/string/String | null?, u32?, u32?) => void
        message = __liftString(message >>> 0);
        fileName = __liftString(fileName >>> 0);
        lineNumber = lineNumber >>> 0;
        columnNumber = columnNumber >>> 0;
        (() => {
          // @external.js
          throw Error(`${message} in ${fileName}:${lineNumber}:${columnNumber}`);
        })();
      },
      seed() {
        // ~lib/builtins/seed() => f64
        return (() => {
          // @external.js
          return Date.now() * Math.random();
        })();
      },
      "console.log"(text) {
        // ~lib/bindings/dom/console.log(~lib/string/String) => void
        text = __liftString(text >>> 0);
        console.log(text);
      },
      "Date.now"() {
        // ~lib/bindings/dom/Date.now() => f64
        return Date.now();
      },
    }),
  };
  const { exports } = await WebAssembly.instantiate(module, adaptedImports);
  const memory = exports.memory || imports.env.memory;
  const adaptedExports = Object.setPrototypeOf({
    currentNode: {
      // assembly/resonlang/currentNode: assembly/resonlang/EntangledNode | null
      valueOf() { return this.value; },
      get value() {
        return __liftInternref(exports.currentNode.value >>> 0);
      },
      set value(value) {
        exports.currentNode.value = __lowerInternref(value);
      }
    },
    setCurrentNode(node) {
      // assembly/resonlang/setCurrentNode(assembly/resonlang/EntangledNode) => void
      node = __lowerInternref(node) || __notnull();
      exports.setCurrentNode(node);
    },
    ProtocolType: (values => (
      // assembly/types/ProtocolType
      values[values.EIP = exports["ProtocolType.EIP"].valueOf()] = "EIP",
      values[values.MTP = exports["ProtocolType.MTP"].valueOf()] = "MTP",
      values[values.RRP = exports["ProtocolType.RRP"].valueOf()] = "RRP",
      values[values.PSP = exports["ProtocolType.PSP"].valueOf()] = "PSP",
      values
    ))({}),
    NetworkError: (values => (
      // assembly/types/NetworkError
      values[values.NODE_NOT_FOUND = exports["NetworkError.NODE_NOT_FOUND"].valueOf()] = "NODE_NOT_FOUND",
      values[values.NODE_ALREADY_EXISTS = exports["NetworkError.NODE_ALREADY_EXISTS"].valueOf()] = "NODE_ALREADY_EXISTS",
      values[values.ENTANGLEMENT_FAILED = exports["NetworkError.ENTANGLEMENT_FAILED"].valueOf()] = "ENTANGLEMENT_FAILED",
      values[values.LOW_COHERENCE = exports["NetworkError.LOW_COHERENCE"].valueOf()] = "LOW_COHERENCE",
      values[values.NOT_ENTANGLED = exports["NetworkError.NOT_ENTANGLED"].valueOf()] = "NOT_ENTANGLED",
      values[values.MEMORY_FULL = exports["NetworkError.MEMORY_FULL"].valueOf()] = "MEMORY_FULL",
      values[values.NETWORK_UNSTABLE = exports["NetworkError.NETWORK_UNSTABLE"].valueOf()] = "NETWORK_UNSTABLE",
      values[values.INVALID_PRIME = exports["NetworkError.INVALID_PRIME"].valueOf()] = "INVALID_PRIME",
      values[values.SYNCHRONIZATION_FAILED = exports["NetworkError.SYNCHRONIZATION_FAILED"].valueOf()] = "SYNCHRONIZATION_FAILED",
      values
    ))({}),
    ProtocolError: (values => (
      // assembly/types/ProtocolError
      values[values.TIMEOUT = exports["ProtocolError.TIMEOUT"].valueOf()] = "TIMEOUT",
      values[values.INVALID_MESSAGE = exports["ProtocolError.INVALID_MESSAGE"].valueOf()] = "INVALID_MESSAGE",
      values[values.NOT_ENTANGLED = exports["ProtocolError.NOT_ENTANGLED"].valueOf()] = "NOT_ENTANGLED",
      values[values.LOW_COHERENCE = exports["ProtocolError.LOW_COHERENCE"].valueOf()] = "LOW_COHERENCE",
      values[values.ROUTE_NOT_FOUND = exports["ProtocolError.ROUTE_NOT_FOUND"].valueOf()] = "ROUTE_NOT_FOUND",
      values[values.SYNC_FAILED = exports["ProtocolError.SYNC_FAILED"].valueOf()] = "SYNC_FAILED",
      values[values.FIDELITY_TOO_LOW = exports["ProtocolError.FIDELITY_TOO_LOW"].valueOf()] = "FIDELITY_TOO_LOW",
      values[values.MESSAGE_TOO_LARGE = exports["ProtocolError.MESSAGE_TOO_LARGE"].valueOf()] = "MESSAGE_TOO_LARGE",
      values[values.SIGNATURE_INVALID = exports["ProtocolError.SIGNATURE_INVALID"].valueOf()] = "SIGNATURE_INVALID",
      values
    ))({}),
    tensor(fragmentA, fragmentB) {
      // assembly/operators/tensor(assembly/resonlang/ResonantFragment, assembly/resonlang/ResonantFragment) => assembly/resonlang/ResonantFragment
      fragmentA = __retain(__lowerInternref(fragmentA) || __notnull());
      fragmentB = __lowerInternref(fragmentB) || __notnull();
      try {
        return __liftInternref(exports.tensor(fragmentA, fragmentB) >>> 0);
      } finally {
        __release(fragmentA);
      }
    },
    collapse(fragment) {
      // assembly/operators/collapse(assembly/resonlang/ResonantFragment) => assembly/resonlang/ResonantFragment
      fragment = __lowerInternref(fragment) || __notnull();
      return __liftInternref(exports.collapse(fragment) >>> 0);
    },
    rotatePhase(node, phaseShift) {
      // assembly/operators/rotatePhase(assembly/resonlang/EntangledNode, f64) => void
      node = __lowerInternref(node) || __notnull();
      exports.rotatePhase(node, phaseShift);
    },
    linkEntanglement(nodeA, nodeB) {
      // assembly/operators/linkEntanglement(assembly/resonlang/EntangledNode, assembly/resonlang/EntangledNode) => void
      nodeA = __retain(__lowerInternref(nodeA) || __notnull());
      nodeB = __lowerInternref(nodeB) || __notnull();
      try {
        exports.linkEntanglement(nodeA, nodeB);
      } finally {
        __release(nodeA);
      }
    },
    route(source, target, viaNodes) {
      // assembly/operators/route(assembly/resonlang/EntangledNode, assembly/resonlang/EntangledNode, ~lib/array/Array<assembly/resonlang/EntangledNode>) => bool
      source = __retain(__lowerInternref(source) || __notnull());
      target = __retain(__lowerInternref(target) || __notnull());
      viaNodes = __lowerArray((pointer, value) => { __setU32(pointer, __lowerInternref(value) || __notnull()); }, 123, 2, viaNodes) || __notnull();
      try {
        return exports.route(source, target, viaNodes) != 0;
      } finally {
        __release(source);
        __release(target);
      }
    },
    coherence(node) {
      // assembly/operators/coherence(assembly/resonlang/EntangledNode) => f64
      node = __lowerInternref(node) || __notnull();
      return exports.coherence(node);
    },
    entropy(fragment) {
      // assembly/operators/entropy(assembly/resonlang/ResonantFragment) => f64
      fragment = __lowerInternref(fragment) || __notnull();
      return exports.entropy(fragment);
    },
    stabilize(node) {
      // assembly/functionalBlocks/stabilize(assembly/resonlang/EntangledNode) => bool
      node = __lowerInternref(node) || __notnull();
      return exports.stabilize(node) != 0;
    },
    teleport(mem, to) {
      // assembly/functionalBlocks/teleport(assembly/resonlang/ResonantFragment, assembly/resonlang/EntangledNode) => bool
      mem = __retain(__lowerInternref(mem) || __notnull());
      to = __lowerInternref(to) || __notnull();
      try {
        return exports.teleport(mem, to) != 0;
      } finally {
        __release(mem);
      }
    },
    entangled(nodeA, nodeB) {
      // assembly/functionalBlocks/entangled(assembly/resonlang/EntangledNode, assembly/resonlang/EntangledNode) => bool
      nodeA = __retain(__lowerInternref(nodeA) || __notnull());
      nodeB = __lowerInternref(nodeB) || __notnull();
      try {
        return exports.entangled(nodeA, nodeB) != 0;
      } finally {
        __release(nodeA);
      }
    },
    observe(remote) {
      // assembly/functionalBlocks/observe(assembly/resonlang/EntangledNode) => ~lib/array/Array<f64>
      remote = __lowerInternref(remote) || __notnull();
      return __liftArray(__getF64, 3, exports.observe(remote) >>> 0);
    },
    primeOperator(state) {
      // assembly/prime-resonance/primeOperator(assembly/prime-resonance/PrimeState) => ~lib/map/Map<i32,f64>
      state = __lowerInternref(state) || __notnull();
      return __liftInternref(exports.primeOperator(state) >>> 0);
    },
    factorizationOperator(n) {
      // assembly/prime-resonance/factorizationOperator(u32) => assembly/prime-resonance/PrimeState
      return __liftInternref(exports.factorizationOperator(n) >>> 0);
    },
    coherenceOperator(state, n) {
      // assembly/prime-resonance/coherenceOperator(assembly/prime-resonance/PrimeState, u32) => f64
      state = __lowerInternref(state) || __notnull();
      return exports.coherenceOperator(state, n);
    },
    primeSpectrum(state) {
      // assembly/prime-resonance/primeSpectrum(assembly/prime-resonance/PrimeState) => ~lib/map/Map<i32,f64>
      state = __lowerInternref(state) || __notnull();
      return __liftInternref(exports.primeSpectrum(state) >>> 0);
    },
    symbolicCollapse(initialStates, coefficients, maxIterations, entropyThreshold) {
      // assembly/prime-resonance/symbolicCollapse(~lib/array/Array<assembly/prime-resonance/PrimeState>, ~lib/array/Array<f64>, i32?, f64?) => assembly/prime-resonance/PrimeState
      initialStates = __retain(__lowerArray((pointer, value) => { __setU32(pointer, __lowerInternref(value) || __notnull()); }, 130, 2, initialStates) || __notnull());
      coefficients = __lowerArray(__setF64, 7, 3, coefficients) || __notnull();
      try {
        exports.__setArgumentsLength(arguments.length);
        return __liftInternref(exports.symbolicCollapse(initialStates, coefficients, maxIterations, entropyThreshold) >>> 0);
      } finally {
        __release(initialStates);
      }
    },
    transmitQuaternionicMessage(sender, receiver, message, synchronizer) {
      // assembly/quaternion-entanglement/transmitQuaternionicMessage(assembly/quaternion-entanglement/QuaternionicAgent, assembly/quaternion-entanglement/QuaternionicAgent, ~lib/string/String, assembly/quaternion-entanglement/QuaternionicSynchronizer) => bool
      sender = __retain(__lowerInternref(sender) || __notnull());
      receiver = __retain(__lowerInternref(receiver) || __notnull());
      message = __retain(__lowerString(message) || __notnull());
      synchronizer = __lowerInternref(synchronizer) || __notnull();
      try {
        return exports.transmitQuaternionicMessage(sender, receiver, message, synchronizer) != 0;
      } finally {
        __release(sender);
        __release(receiver);
        __release(message);
      }
    },
    superpose(states) {
      // assembly/quantum-ops-impl/superpose(~lib/array/Array<assembly/prime-resonance/PrimeState>) => assembly/prime-resonance/PrimeState
      states = __lowerArray((pointer, value) => { __setU32(pointer, __lowerInternref(value) || __notnull()); }, 130, 2, states) || __notnull();
      return __liftInternref(exports.superpose(states) >>> 0);
    },
    measure(state) {
      // assembly/quantum-ops-impl/measure(assembly/prime-resonance/PrimeState) => u32
      state = __lowerInternref(state) || __notnull();
      return exports.measure(state) >>> 0;
    },
    collapse(state, prime) {
      // assembly/quantum-ops-impl/collapse(assembly/prime-resonance/PrimeState, u32) => assembly/prime-resonance/PrimeState
      state = __lowerInternref(state) || __notnull();
      return __liftInternref(exports.collapse(state, prime) >>> 0);
    },
    entropyRate(phaseRing) {
      // assembly/utils/entropyRate(~lib/array/Array<f64>) => f64
      phaseRing = __lowerArray(__setF64, 7, 3, phaseRing) || __notnull();
      return exports.entropyRate(phaseRing);
    },
    align(phaseRing) {
      // assembly/utils/align(~lib/array/Array<f64>) => ~lib/array/Array<f64>
      phaseRing = __lowerArray(__setF64, 7, 3, phaseRing) || __notnull();
      return __liftArray(__getF64, 3, exports.align(phaseRing) >>> 0);
    },
    generateSymbol(primes) {
      // assembly/utils/generateSymbol(~lib/array/Array<u32>) => ~lib/string/String
      primes = __lowerArray(__setU32, 14, 2, primes) || __notnull();
      return __liftString(exports.generateSymbol(primes) >>> 0);
    },
    toFixed(value, decimals) {
      // assembly/utils/toFixed(f64, i32?) => ~lib/string/String
      exports.__setArgumentsLength(arguments.length);
      return __liftString(exports.toFixed(value, decimals) >>> 0);
    },
    getGlobalSampler() {
      // assembly/entropy-viz/getGlobalSampler() => assembly/entropy-viz/EntropyFieldSampler
      return __liftInternref(exports.getGlobalSampler() >>> 0);
    },
    getGlobalTracker() {
      // assembly/entropy-viz/getGlobalTracker() => assembly/entropy-viz/EntropyEvolutionTracker
      return __liftInternref(exports.getGlobalTracker() >>> 0);
    },
    exportEntropyData() {
      // assembly/entropy-viz/exportEntropyData() => ~lib/string/String
      return __liftString(exports.exportEntropyData() >>> 0);
    },
    exportEntropyHistory() {
      // assembly/entropy-viz/exportEntropyHistory() => ~lib/string/String
      return __liftString(exports.exportEntropyHistory() >>> 0);
    },
    escapeJSON(str) {
      // assembly/core/serialization/escapeJSON(~lib/string/String) => ~lib/string/String
      str = __lowerString(str) || __notnull();
      return __liftString(exports.escapeJSON(str) >>> 0);
    },
    toFixed(value, decimals) {
      // assembly/core/serialization/toFixed(f64, i32) => ~lib/string/String
      return __liftString(exports.toFixed(value, decimals) >>> 0);
    },
    serializeString(value) {
      // assembly/core/serialization/serializeString(~lib/string/String) => ~lib/string/String
      value = __lowerString(value) || __notnull();
      return __liftString(exports.serializeString(value) >>> 0);
    },
    serializeNumber(value) {
      // assembly/core/serialization/serializeNumber(f64) => ~lib/string/String
      return __liftString(exports.serializeNumber(value) >>> 0);
    },
    serializeBoolean(value) {
      // assembly/core/serialization/serializeBoolean(bool) => ~lib/string/String
      value = value ? 1 : 0;
      return __liftString(exports.serializeBoolean(value) >>> 0);
    },
    serializeInteger(value) {
      // assembly/core/serialization/serializeInteger(i64) => ~lib/string/String
      value = value || 0n;
      return __liftString(exports.serializeInteger(value) >>> 0);
    },
    validateString() {
      // assembly/core/validation/validateString() => assembly/core/validation/StringValidationBuilder
      return __liftInternref(exports.validateString() >>> 0);
    },
    validateNumber() {
      // assembly/core/validation/validateNumber() => assembly/core/validation/NumberValidationBuilder
      return __liftInternref(exports.validateNumber() >>> 0);
    },
    validateObject() {
      // assembly/core/validation/validateObject() => assembly/core/validation/ObjectValidator
      return __liftInternref(exports.validateObject() >>> 0);
    },
    modExpOptimized(base, exp, mod) {
      // assembly/core/math-optimized/modExpOptimized(u64, u64, u64) => u64
      base = base || 0n;
      exp = exp || 0n;
      mod = mod || 0n;
      return BigInt.asUintN(64, exports.modExpOptimized(base, exp, mod));
    },
    modInverseOptimized(a, m) {
      // assembly/core/math-optimized/modInverseOptimized(u64, u64) => u64
      a = a || 0n;
      m = m || 0n;
      return BigInt.asUintN(64, exports.modInverseOptimized(a, m));
    },
    simdArrayMul(a, b, result) {
      // assembly/core/math-optimized/simdArrayMul(~lib/typedarray/Float64Array, ~lib/typedarray/Float64Array, ~lib/typedarray/Float64Array) => void
      a = __retain(__lowerTypedArray(Float64Array, 135, 3, a) || __notnull());
      b = __retain(__lowerTypedArray(Float64Array, 135, 3, b) || __notnull());
      result = __lowerTypedArray(Float64Array, 135, 3, result) || __notnull();
      try {
        exports.simdArrayMul(a, b, result);
      } finally {
        __release(a);
        __release(b);
      }
    },
    simdArrayAdd(a, b, result) {
      // assembly/core/math-optimized/simdArrayAdd(~lib/typedarray/Float64Array, ~lib/typedarray/Float64Array, ~lib/typedarray/Float64Array) => void
      a = __retain(__lowerTypedArray(Float64Array, 135, 3, a) || __notnull());
      b = __retain(__lowerTypedArray(Float64Array, 135, 3, b) || __notnull());
      result = __lowerTypedArray(Float64Array, 135, 3, result) || __notnull();
      try {
        exports.simdArrayAdd(a, b, result);
      } finally {
        __release(a);
        __release(b);
      }
    },
    simdDotProduct(a, b) {
      // assembly/core/math-optimized/simdDotProduct(~lib/typedarray/Float64Array, ~lib/typedarray/Float64Array) => f64
      a = __retain(__lowerTypedArray(Float64Array, 135, 3, a) || __notnull());
      b = __lowerTypedArray(Float64Array, 135, 3, b) || __notnull();
      try {
        return exports.simdDotProduct(a, b);
      } finally {
        __release(a);
      }
    },
    getPrimeCacheStats() {
      // assembly/core/math-optimized/getPrimeCacheStats() => ~lib/string/String
      return __liftString(exports.getPrimeCacheStats() >>> 0);
    },
    getMathPerformanceReport() {
      // assembly/core/math-optimized/getMathPerformanceReport() => ~lib/string/String
      return __liftString(exports.getMathPerformanceReport() >>> 0);
    },
    validateMathOperations() {
      // assembly/core/math-optimized/validateMathOperations() => bool
      return exports.validateMathOperations() != 0;
    },
    benchmarkMathOperations() {
      // assembly/core/math-optimized/benchmarkMathOperations() => ~lib/string/String
      return __liftString(exports.benchmarkMathOperations() >>> 0);
    },
    testMathOperations() {
      // assembly/core/math-optimized/testMathOperations() => bool
      return exports.testMathOperations() != 0;
    },
    SMALL_PRIMES: {
      // assembly/core/math-cache/SMALL_PRIMES: ~lib/array/Array<u32>
      valueOf() { return this.value; },
      get value() {
        return __liftArray(pointer => __getU32(pointer) >>> 0, 2, exports.SMALL_PRIMES.value >>> 0);
      }
    },
    primeCache: {
      // assembly/core/math-cache/primeCache: assembly/core/math-cache/PrimeCache
      valueOf() { return this.value; },
      get value() {
        return __liftInternref(exports.primeCache.value >>> 0);
      }
    },
    extendedGCD(a, b) {
      // assembly/core/math-extended-gcd/extendedGCD(i64, i64) => assembly/core/math-extended-gcd/ExtendedGCDResult
      a = a || 0n;
      b = b || 0n;
      return __liftInternref(exports.extendedGCD(a, b) >>> 0);
    },
    modInverse(a, m) {
      // assembly/core/math-extended-gcd/modInverse(u64, u64) => u64
      a = a || 0n;
      m = m || 0n;
      return BigInt.asUintN(64, exports.modInverse(a, m));
    },
    MILLER_RABIN_WITNESSES_32: {
      // assembly/core/math-miller-rabin/MILLER_RABIN_WITNESSES_32: ~lib/array/Array<u32>
      valueOf() { return this.value; },
      get value() {
        return __liftArray(pointer => __getU32(pointer) >>> 0, 2, exports.MILLER_RABIN_WITNESSES_32.value >>> 0);
      }
    },
    MILLER_RABIN_WITNESSES_64: {
      // assembly/core/math-miller-rabin/MILLER_RABIN_WITNESSES_64: ~lib/array/Array<u64>
      valueOf() { return this.value; },
      get value() {
        return __liftArray(pointer => BigInt.asUintN(64, __getU64(pointer)), 3, exports.MILLER_RABIN_WITNESSES_64.value >>> 0);
      }
    },
    millerRabinDeterministic32(n) {
      // assembly/core/math-miller-rabin/millerRabinDeterministic32(u32) => bool
      return exports.millerRabinDeterministic32(n) != 0;
    },
    millerRabinDeterministic64(n) {
      // assembly/core/math-miller-rabin/millerRabinDeterministic64(u64) => bool
      n = n || 0n;
      return exports.millerRabinDeterministic64(n) != 0;
    },
    modExpMontgomery(base, exp, mod) {
      // assembly/core/math-montgomery/modExpMontgomery(u64, u64, u64) => u64
      base = base || 0n;
      exp = exp || 0n;
      mod = mod || 0n;
      return BigInt.asUintN(64, exports.modExpMontgomery(base, exp, mod));
    },
    mulMod(a, b, mod) {
      // assembly/core/math-operations/mulMod(u64, u64, u64) => u64
      a = a || 0n;
      b = b || 0n;
      mod = mod || 0n;
      return BigInt.asUintN(64, exports.mulMod(a, b, mod));
    },
    addMod(a, b, mod) {
      // assembly/core/math-operations/addMod(u64, u64, u64) => u64
      a = a || 0n;
      b = b || 0n;
      mod = mod || 0n;
      return BigInt.asUintN(64, exports.addMod(a, b, mod));
    },
    modExp(base, exp, mod) {
      // assembly/core/math-operations/modExp(u64, u64, u64) => u64
      base = base || 0n;
      exp = exp || 0n;
      mod = mod || 0n;
      return BigInt.asUintN(64, exports.modExp(base, exp, mod));
    },
    arrayMul(a, b, result) {
      // assembly/core/math-operations/arrayMul(~lib/typedarray/Float64Array, ~lib/typedarray/Float64Array, ~lib/typedarray/Float64Array) => void
      a = __retain(__lowerTypedArray(Float64Array, 135, 3, a) || __notnull());
      b = __retain(__lowerTypedArray(Float64Array, 135, 3, b) || __notnull());
      result = __lowerTypedArray(Float64Array, 135, 3, result) || __notnull();
      try {
        exports.arrayMul(a, b, result);
      } finally {
        __release(a);
        __release(b);
      }
    },
    arrayAdd(a, b, result) {
      // assembly/core/math-operations/arrayAdd(~lib/typedarray/Float64Array, ~lib/typedarray/Float64Array, ~lib/typedarray/Float64Array) => void
      a = __retain(__lowerTypedArray(Float64Array, 135, 3, a) || __notnull());
      b = __retain(__lowerTypedArray(Float64Array, 135, 3, b) || __notnull());
      result = __lowerTypedArray(Float64Array, 135, 3, result) || __notnull();
      try {
        exports.arrayAdd(a, b, result);
      } finally {
        __release(a);
        __release(b);
      }
    },
    dotProduct(a, b) {
      // assembly/core/math-operations/dotProduct(~lib/typedarray/Float64Array, ~lib/typedarray/Float64Array) => f64
      a = __retain(__lowerTypedArray(Float64Array, 135, 3, a) || __notnull());
      b = __lowerTypedArray(Float64Array, 135, 3, b) || __notnull();
      try {
        return exports.dotProduct(a, b);
      } finally {
        __release(a);
      }
    },
    vectorMagnitude(v) {
      // assembly/core/math-operations/vectorMagnitude(~lib/typedarray/Float64Array) => f64
      v = __lowerTypedArray(Float64Array, 135, 3, v) || __notnull();
      return exports.vectorMagnitude(v);
    },
    normalizeVector(v, result) {
      // assembly/core/math-operations/normalizeVector(~lib/typedarray/Float64Array, ~lib/typedarray/Float64Array) => void
      v = __retain(__lowerTypedArray(Float64Array, 135, 3, v) || __notnull());
      result = __lowerTypedArray(Float64Array, 135, 3, result) || __notnull();
      try {
        exports.normalizeVector(v, result);
      } finally {
        __release(v);
      }
    },
    approxEqual(a, b, epsilon) {
      // assembly/core/math-operations/approxEqual(f64, f64, f64?) => bool
      exports.__setArgumentsLength(arguments.length);
      return exports.approxEqual(a, b, epsilon) != 0;
    },
    gcd(a, b) {
      // assembly/core/math-operations/gcd(u64, u64) => u64
      a = a || 0n;
      b = b || 0n;
      return BigInt.asUintN(64, exports.gcd(a, b));
    },
    lcm(a, b) {
      // assembly/core/math-operations/lcm(u64, u64) => u64
      a = a || 0n;
      b = b || 0n;
      return BigInt.asUintN(64, exports.lcm(a, b));
    },
    isPerfectSquare(n) {
      // assembly/core/math-operations/isPerfectSquare(u64) => bool
      n = n || 0n;
      return exports.isPerfectSquare(n) != 0;
    },
    isqrt(n) {
      // assembly/core/math-operations/isqrt(u64) => u64
      n = n || 0n;
      return BigInt.asUintN(64, exports.isqrt(n));
    },
    globalMathProfiler: {
      // assembly/core/math-performance/globalMathProfiler: assembly/core/math-performance/MathProfiler
      valueOf() { return this.value; },
      get value() {
        return __liftInternref(exports.globalMathProfiler.value >>> 0);
      }
    },
    profileMathOperation(name, operation) {
      // assembly/core/math-performance/profileMathOperation(~lib/string/String, () => void) => void
      name = __retain(__lowerString(name) || __notnull());
      operation = __lowerInternref(operation) || __notnull();
      try {
        exports.profileMathOperation(name, operation);
      } finally {
        __release(name);
      }
    },
    globalMathMemoryTracker: {
      // assembly/core/math-performance/globalMathMemoryTracker: assembly/core/math-performance/MathMemoryTracker
      valueOf() { return this.value; },
      get value() {
        return __liftInternref(exports.globalMathMemoryTracker.value >>> 0);
      }
    },
    isPrimeOptimized(n) {
      // assembly/core/math-primes/isPrimeOptimized(u64) => bool
      n = n || 0n;
      return exports.isPrimeOptimized(n) != 0;
    },
    generatePrimeOptimized(minBits, maxBits) {
      // assembly/core/math-primes/generatePrimeOptimized(i32, i32) => u64
      return BigInt.asUintN(64, exports.generatePrimeOptimized(minBits, maxBits));
    },
    generatePrimesOptimized(n) {
      // assembly/core/math-primes/generatePrimesOptimized(i32) => ~lib/array/Array<i32>
      return __liftArray(__getI32, 2, exports.generatePrimesOptimized(n) >>> 0);
    },
    isGaussianPrime(real, imag) {
      // assembly/core/math-primes/isGaussianPrime(f64, f64) => bool
      return exports.isGaussianPrime(real, imag) != 0;
    },
    sieveOfEratosthenes(n) {
      // assembly/core/math-primes/sieveOfEratosthenes(u32) => ~lib/array/Array<u32>
      return __liftArray(pointer => __getU32(pointer) >>> 0, 2, exports.sieveOfEratosthenes(n) >>> 0);
    },
    nextPrime(n) {
      // assembly/core/math-primes/nextPrime(u64) => u64
      n = n || 0n;
      return BigInt.asUintN(64, exports.nextPrime(n));
    },
    previousPrime(n) {
      // assembly/core/math-primes/previousPrime(u64) => u64
      n = n || 0n;
      return BigInt.asUintN(64, exports.previousPrime(n));
    },
    SHA256_H: {
      // assembly/core/constants/SHA256_H: ~lib/array/Array<u32>
      valueOf() { return this.value; },
      get value() {
        return __liftArray(pointer => __getU32(pointer) >>> 0, 2, exports.SHA256_H.value >>> 0);
      }
    },
    SHA256_K: {
      // assembly/core/constants/SHA256_K: ~lib/array/Array<u32>
      valueOf() { return this.value; },
      get value() {
        return __liftArray(pointer => __getU32(pointer) >>> 0, 2, exports.SHA256_K.value >>> 0);
      }
    },
    DEFAULT_PRNG_SEED: {
      // assembly/core/constants/DEFAULT_PRNG_SEED: u64
      valueOf() { return this.value; },
      get value() {
        return BigInt.asUintN(64, exports.DEFAULT_PRNG_SEED.value);
      }
    },
    LCG_MULTIPLIER: {
      // assembly/core/constants/LCG_MULTIPLIER: u64
      valueOf() { return this.value; },
      get value() {
        return BigInt.asUintN(64, exports.LCG_MULTIPLIER.value);
      }
    },
    LCG_INCREMENT: {
      // assembly/core/constants/LCG_INCREMENT: u64
      valueOf() { return this.value; },
      get value() {
        return BigInt.asUintN(64, exports.LCG_INCREMENT.value);
      }
    },
    MERSENNE_PRIME_31: {
      // assembly/core/constants/MERSENNE_PRIME_31: u64
      valueOf() { return this.value; },
      get value() {
        return BigInt.asUintN(64, exports.MERSENNE_PRIME_31.value);
      }
    },
    FIELD_GENERATOR: {
      // assembly/core/constants/FIELD_GENERATOR: u64
      valueOf() { return this.value; },
      get value() {
        return BigInt.asUintN(64, exports.FIELD_GENERATOR.value);
      }
    },
    MAX_ACTIVE_ROUNDS: {
      // assembly/core/constants/MAX_ACTIVE_ROUNDS: u32
      valueOf() { return this.value; },
      get value() {
        return exports.MAX_ACTIVE_ROUNDS.value >>> 0;
      }
    },
    DEFAULT_CHECKPOINT_INTERVAL: {
      // assembly/core/constants/DEFAULT_CHECKPOINT_INTERVAL: u64
      valueOf() { return this.value; },
      get value() {
        return BigInt.asUintN(64, exports.DEFAULT_CHECKPOINT_INTERVAL.value);
      }
    },
    MAX_CHECKPOINTS: {
      // assembly/core/constants/MAX_CHECKPOINTS: u32
      valueOf() { return this.value; },
      get value() {
        return exports.MAX_CHECKPOINTS.value >>> 0;
      }
    },
    OPTIMIZATION_INTERVAL: {
      // assembly/core/constants/OPTIMIZATION_INTERVAL: u64
      valueOf() { return this.value; },
      get value() {
        return BigInt.asUintN(64, exports.OPTIMIZATION_INTERVAL.value);
      }
    },
    NetworkError: (values => (
      // assembly/core/constants/NetworkError
      values[values.NODE_NOT_FOUND = exports["NetworkError.NODE_NOT_FOUND"].valueOf()] = "NODE_NOT_FOUND",
      values[values.NODE_ALREADY_EXISTS = exports["NetworkError.NODE_ALREADY_EXISTS"].valueOf()] = "NODE_ALREADY_EXISTS",
      values[values.ENTANGLEMENT_FAILED = exports["NetworkError.ENTANGLEMENT_FAILED"].valueOf()] = "ENTANGLEMENT_FAILED",
      values[values.LOW_COHERENCE = exports["NetworkError.LOW_COHERENCE"].valueOf()] = "LOW_COHERENCE",
      values[values.NOT_ENTANGLED = exports["NetworkError.NOT_ENTANGLED"].valueOf()] = "NOT_ENTANGLED",
      values[values.MEMORY_FULL = exports["NetworkError.MEMORY_FULL"].valueOf()] = "MEMORY_FULL",
      values[values.NETWORK_UNSTABLE = exports["NetworkError.NETWORK_UNSTABLE"].valueOf()] = "NETWORK_UNSTABLE",
      values[values.INVALID_PRIME = exports["NetworkError.INVALID_PRIME"].valueOf()] = "INVALID_PRIME",
      values[values.SYNCHRONIZATION_FAILED = exports["NetworkError.SYNCHRONIZATION_FAILED"].valueOf()] = "SYNCHRONIZATION_FAILED",
      values
    ))({}),
    ProtocolError: (values => (
      // assembly/core/constants/ProtocolError
      values[values.TIMEOUT = exports["ProtocolError.TIMEOUT"].valueOf()] = "TIMEOUT",
      values[values.INVALID_MESSAGE = exports["ProtocolError.INVALID_MESSAGE"].valueOf()] = "INVALID_MESSAGE",
      values[values.NOT_ENTANGLED = exports["ProtocolError.NOT_ENTANGLED"].valueOf()] = "NOT_ENTANGLED",
      values[values.LOW_COHERENCE = exports["ProtocolError.LOW_COHERENCE"].valueOf()] = "LOW_COHERENCE",
      values[values.ROUTE_NOT_FOUND = exports["ProtocolError.ROUTE_NOT_FOUND"].valueOf()] = "ROUTE_NOT_FOUND",
      values[values.SYNC_FAILED = exports["ProtocolError.SYNC_FAILED"].valueOf()] = "SYNC_FAILED",
      values[values.FIDELITY_TOO_LOW = exports["ProtocolError.FIDELITY_TOO_LOW"].valueOf()] = "FIDELITY_TOO_LOW",
      values[values.MESSAGE_TOO_LARGE = exports["ProtocolError.MESSAGE_TOO_LARGE"].valueOf()] = "MESSAGE_TOO_LARGE",
      values[values.SIGNATURE_INVALID = exports["ProtocolError.SIGNATURE_INVALID"].valueOf()] = "SIGNATURE_INVALID",
      values
    ))({}),
    generateUniqueId(prefix) {
      // assembly/core/constants/generateUniqueId(~lib/string/String) => ~lib/string/String
      prefix = __lowerString(prefix) || __notnull();
      return __liftString(exports.generateUniqueId(prefix) >>> 0);
    },
    approxEqual(a, b, epsilon) {
      // assembly/core/constants/approxEqual(f64, f64, f64?) => bool
      exports.__setArgumentsLength(arguments.length);
      return exports.approxEqual(a, b, epsilon) != 0;
    },
    IdentityType: (values => (
      // assembly/identity/interfaces/IdentityType
      values[values.SELF_SOVEREIGN = exports["IdentityType.SELF_SOVEREIGN"].valueOf()] = "SELF_SOVEREIGN",
      values[values.MANAGED = exports["IdentityType.MANAGED"].valueOf()] = "MANAGED",
      values[values.SYSTEM = exports["IdentityType.SYSTEM"].valueOf()] = "SYSTEM",
      values
    ))({}),
    KYCLevel: (values => (
      // assembly/identity/interfaces/KYCLevel
      values[values.NONE = exports["KYCLevel.NONE"].valueOf()] = "NONE",
      values[values.BASIC = exports["KYCLevel.BASIC"].valueOf()] = "BASIC",
      values[values.ENHANCED = exports["KYCLevel.ENHANCED"].valueOf()] = "ENHANCED",
      values[values.FULL = exports["KYCLevel.FULL"].valueOf()] = "FULL",
      values
    ))({}),
    KYCVerificationStatus: (values => (
      // assembly/identity/interfaces/KYCVerificationStatus
      values[values.PENDING = exports["KYCVerificationStatus.PENDING"].valueOf()] = "PENDING",
      values[values.IN_PROGRESS = exports["KYCVerificationStatus.IN_PROGRESS"].valueOf()] = "IN_PROGRESS",
      values[values.COMPLETED = exports["KYCVerificationStatus.COMPLETED"].valueOf()] = "COMPLETED",
      values[values.FAILED = exports["KYCVerificationStatus.FAILED"].valueOf()] = "FAILED",
      values[values.EXPIRED = exports["KYCVerificationStatus.EXPIRED"].valueOf()] = "EXPIRED",
      values
    ))({}),
    PermissionScope: (values => (
      // assembly/identity/interfaces/PermissionScope
      values[values.GLOBAL = exports["PermissionScope.GLOBAL"].valueOf()] = "GLOBAL",
      values[values.DOMAIN = exports["PermissionScope.DOMAIN"].valueOf()] = "DOMAIN",
      values[values.OBJECT = exports["PermissionScope.OBJECT"].valueOf()] = "OBJECT",
      values
    ))({}),
    AuditAction: (values => (
      // assembly/identity/interfaces/AuditAction
      values[values.CREATE = exports["AuditAction.CREATE"].valueOf()] = "CREATE",
      values[values.UPDATE = exports["AuditAction.UPDATE"].valueOf()] = "UPDATE",
      values[values.DELETE = exports["AuditAction.DELETE"].valueOf()] = "DELETE",
      values[values.TRANSFER = exports["AuditAction.TRANSFER"].valueOf()] = "TRANSFER",
      values[values.GRANT_PERMISSION = exports["AuditAction.GRANT_PERMISSION"].valueOf()] = "GRANT_PERMISSION",
      values[values.REVOKE_PERMISSION = exports["AuditAction.REVOKE_PERMISSION"].valueOf()] = "REVOKE_PERMISSION",
      values[values.ADD_MEMBER = exports["AuditAction.ADD_MEMBER"].valueOf()] = "ADD_MEMBER",
      values[values.REMOVE_MEMBER = exports["AuditAction.REMOVE_MEMBER"].valueOf()] = "REMOVE_MEMBER",
      values[values.VERIFY_KYC = exports["AuditAction.VERIFY_KYC"].valueOf()] = "VERIFY_KYC",
      values[values.AUTHENTICATE = exports["AuditAction.AUTHENTICATE"].valueOf()] = "AUTHENTICATE",
      values[values.DEACTIVATE = exports["AuditAction.DEACTIVATE"].valueOf()] = "DEACTIVATE",
      values[values.REACTIVATE = exports["AuditAction.REACTIVATE"].valueOf()] = "REACTIVATE",
      values
    ))({}),
    AuditResult: (values => (
      // assembly/identity/interfaces/AuditResult
      values[values.SUCCESS = exports["AuditResult.SUCCESS"].valueOf()] = "SUCCESS",
      values[values.FAILURE = exports["AuditResult.FAILURE"].valueOf()] = "FAILURE",
      values[values.PARTIAL = exports["AuditResult.PARTIAL"].valueOf()] = "PARTIAL",
      values
    ))({}),
    RecoveryMethod: (values => (
      // assembly/identity/interfaces/RecoveryMethod
      values[values.MULTI_SIGNATURE = exports["RecoveryMethod.MULTI_SIGNATURE"].valueOf()] = "MULTI_SIGNATURE",
      values[values.SOCIAL_RECOVERY = exports["RecoveryMethod.SOCIAL_RECOVERY"].valueOf()] = "SOCIAL_RECOVERY",
      values[values.TIME_LOCKED = exports["RecoveryMethod.TIME_LOCKED"].valueOf()] = "TIME_LOCKED",
      values[values.HARDWARE_KEY = exports["RecoveryMethod.HARDWARE_KEY"].valueOf()] = "HARDWARE_KEY",
      values
    ))({}),
    globalPrimeMapper: {
      // assembly/identity/prime-mapping/globalPrimeMapper: assembly/identity/prime-mapping/IdentityPrimeMapper
      valueOf() { return this.value; },
      get value() {
        return __liftInternref(exports.globalPrimeMapper.value >>> 0);
      }
    },
    TransferType: (values => (
      // assembly/identity/ownership-transfer/TransferType
      values[values.DOMAIN = exports["TransferType.DOMAIN"].valueOf()] = "DOMAIN",
      values[values.OBJECT = exports["TransferType.OBJECT"].valueOf()] = "OBJECT",
      values
    ))({}),
    TransferStatus: (values => (
      // assembly/identity/ownership-transfer/TransferStatus
      values[values.PENDING = exports["TransferStatus.PENDING"].valueOf()] = "PENDING",
      values[values.APPROVED = exports["TransferStatus.APPROVED"].valueOf()] = "APPROVED",
      values[values.REJECTED = exports["TransferStatus.REJECTED"].valueOf()] = "REJECTED",
      values[values.CANCELLED = exports["TransferStatus.CANCELLED"].valueOf()] = "CANCELLED",
      values[values.EXPIRED = exports["TransferStatus.EXPIRED"].valueOf()] = "EXPIRED",
      values[values.COMPLETED = exports["TransferStatus.COMPLETED"].valueOf()] = "COMPLETED",
      values
    ))({}),
    globalTransferManager: {
      // assembly/identity/ownership-transfer/globalTransferManager: assembly/identity/ownership-transfer/OwnershipTransferManager
      valueOf() { return this.value; },
      get value() {
        return __liftInternref(exports.globalTransferManager.value >>> 0);
      }
    },
    AuditEventType: (values => (
      // assembly/identity/audit-trail/AuditEventType
      values[values.IDENTITY_CREATED = exports["AuditEventType.IDENTITY_CREATED"].valueOf()] = "IDENTITY_CREATED",
      values[values.IDENTITY_UPDATED = exports["AuditEventType.IDENTITY_UPDATED"].valueOf()] = "IDENTITY_UPDATED",
      values[values.IDENTITY_KYC_CHANGED = exports["AuditEventType.IDENTITY_KYC_CHANGED"].valueOf()] = "IDENTITY_KYC_CHANGED",
      values[values.IDENTITY_DEACTIVATED = exports["AuditEventType.IDENTITY_DEACTIVATED"].valueOf()] = "IDENTITY_DEACTIVATED",
      values[values.IDENTITY_REACTIVATED = exports["AuditEventType.IDENTITY_REACTIVATED"].valueOf()] = "IDENTITY_REACTIVATED",
      values[values.DOMAIN_CREATED = exports["AuditEventType.DOMAIN_CREATED"].valueOf()] = "DOMAIN_CREATED",
      values[values.DOMAIN_UPDATED = exports["AuditEventType.DOMAIN_UPDATED"].valueOf()] = "DOMAIN_UPDATED",
      values[values.DOMAIN_MEMBER_ADDED = exports["AuditEventType.DOMAIN_MEMBER_ADDED"].valueOf()] = "DOMAIN_MEMBER_ADDED",
      values[values.DOMAIN_MEMBER_REMOVED = exports["AuditEventType.DOMAIN_MEMBER_REMOVED"].valueOf()] = "DOMAIN_MEMBER_REMOVED",
      values[values.DOMAIN_OWNERSHIP_TRANSFERRED = exports["AuditEventType.DOMAIN_OWNERSHIP_TRANSFERRED"].valueOf()] = "DOMAIN_OWNERSHIP_TRANSFERRED",
      values[values.OBJECT_CREATED = exports["AuditEventType.OBJECT_CREATED"].valueOf()] = "OBJECT_CREATED",
      values[values.OBJECT_UPDATED = exports["AuditEventType.OBJECT_UPDATED"].valueOf()] = "OBJECT_UPDATED",
      values[values.OBJECT_TRANSFERRED = exports["AuditEventType.OBJECT_TRANSFERRED"].valueOf()] = "OBJECT_TRANSFERRED",
      values[values.OBJECT_DESTROYED = exports["AuditEventType.OBJECT_DESTROYED"].valueOf()] = "OBJECT_DESTROYED",
      values[values.PERMISSION_GRANTED = exports["AuditEventType.PERMISSION_GRANTED"].valueOf()] = "PERMISSION_GRANTED",
      values[values.PERMISSION_REVOKED = exports["AuditEventType.PERMISSION_REVOKED"].valueOf()] = "PERMISSION_REVOKED",
      values[values.ROLE_ASSIGNED = exports["AuditEventType.ROLE_ASSIGNED"].valueOf()] = "ROLE_ASSIGNED",
      values[values.ROLE_REMOVED = exports["AuditEventType.ROLE_REMOVED"].valueOf()] = "ROLE_REMOVED",
      values[values.AUTH_LOGIN = exports["AuditEventType.AUTH_LOGIN"].valueOf()] = "AUTH_LOGIN",
      values[values.AUTH_LOGOUT = exports["AuditEventType.AUTH_LOGOUT"].valueOf()] = "AUTH_LOGOUT",
      values[values.AUTH_FAILED = exports["AuditEventType.AUTH_FAILED"].valueOf()] = "AUTH_FAILED",
      values[values.AUTH_SESSION_EXPIRED = exports["AuditEventType.AUTH_SESSION_EXPIRED"].valueOf()] = "AUTH_SESSION_EXPIRED",
      values[values.NODE_CONNECTED = exports["AuditEventType.NODE_CONNECTED"].valueOf()] = "NODE_CONNECTED",
      values[values.NODE_DISCONNECTED = exports["AuditEventType.NODE_DISCONNECTED"].valueOf()] = "NODE_DISCONNECTED",
      values[values.SYNC_STARTED = exports["AuditEventType.SYNC_STARTED"].valueOf()] = "SYNC_STARTED",
      values[values.SYNC_COMPLETED = exports["AuditEventType.SYNC_COMPLETED"].valueOf()] = "SYNC_COMPLETED",
      values[values.SYNC_FAILED = exports["AuditEventType.SYNC_FAILED"].valueOf()] = "SYNC_FAILED",
      values
    ))({}),
    AuditSeverity: (values => (
      // assembly/identity/audit-trail/AuditSeverity
      values[values.INFO = exports["AuditSeverity.INFO"].valueOf()] = "INFO",
      values[values.WARNING = exports["AuditSeverity.WARNING"].valueOf()] = "WARNING",
      values[values.ERROR = exports["AuditSeverity.ERROR"].valueOf()] = "ERROR",
      values[values.CRITICAL = exports["AuditSeverity.CRITICAL"].valueOf()] = "CRITICAL",
      values
    ))({}),
    globalAuditTrail: {
      // assembly/identity/audit-trail/globalAuditTrail: assembly/identity/audit-trail/AuditTrailManager
      valueOf() { return this.value; },
      get value() {
        return __liftInternref(exports.globalAuditTrail.value >>> 0);
      }
    },
    RecoveryStatus: (values => (
      // assembly/identity/identity-recovery/RecoveryStatus
      values[values.PENDING = exports["RecoveryStatus.PENDING"].valueOf()] = "PENDING",
      values[values.EXECUTED = exports["RecoveryStatus.EXECUTED"].valueOf()] = "EXECUTED",
      values[values.CANCELLED = exports["RecoveryStatus.CANCELLED"].valueOf()] = "CANCELLED",
      values[values.EXPIRED = exports["RecoveryStatus.EXPIRED"].valueOf()] = "EXPIRED",
      values
    ))({}),
    globalRecoveryManager: {
      // assembly/identity/identity-recovery/globalRecoveryManager: assembly/identity/identity-recovery/IdentityRecoveryManager
      valueOf() { return this.value; },
      get value() {
        return __liftInternref(exports.globalRecoveryManager.value >>> 0);
      }
    },
    DomainStatus: (values => (
      // assembly/identity/domain-registry/DomainStatus
      values[values.ACTIVE = exports["DomainStatus.ACTIVE"].valueOf()] = "ACTIVE",
      values[values.SUSPENDED = exports["DomainStatus.SUSPENDED"].valueOf()] = "SUSPENDED",
      values[values.EXPIRED = exports["DomainStatus.EXPIRED"].valueOf()] = "EXPIRED",
      values[values.RESERVED = exports["DomainStatus.RESERVED"].valueOf()] = "RESERVED",
      values
    ))({}),
    InheritanceMode: (values => (
      // assembly/identity/permission-inheritance/InheritanceMode
      values[values.NONE = exports["InheritanceMode.NONE"].valueOf()] = "NONE",
      values[values.ADDITIVE = exports["InheritanceMode.ADDITIVE"].valueOf()] = "ADDITIVE",
      values[values.RESTRICTIVE = exports["InheritanceMode.RESTRICTIVE"].valueOf()] = "RESTRICTIVE",
      values[values.OVERRIDE = exports["InheritanceMode.OVERRIDE"].valueOf()] = "OVERRIDE",
      values
    ))({}),
    globalPermissionInheritance: {
      // assembly/identity/permission-inheritance/globalPermissionInheritance: assembly/identity/permission-inheritance/PermissionInheritanceManager
      valueOf() { return this.value; },
      get value() {
        return __liftInternref(exports.globalPermissionInheritance.value >>> 0);
      }
    },
    AuthMethod: (values => (
      // assembly/identity/authentication/AuthMethod
      values[values.PASSWORD = exports["AuthMethod.PASSWORD"].valueOf()] = "PASSWORD",
      values[values.BIOMETRIC = exports["AuthMethod.BIOMETRIC"].valueOf()] = "BIOMETRIC",
      values[values.HARDWARE_KEY = exports["AuthMethod.HARDWARE_KEY"].valueOf()] = "HARDWARE_KEY",
      values[values.QUANTUM_SIGNATURE = exports["AuthMethod.QUANTUM_SIGNATURE"].valueOf()] = "QUANTUM_SIGNATURE",
      values[values.MULTI_FACTOR = exports["AuthMethod.MULTI_FACTOR"].valueOf()] = "MULTI_FACTOR",
      values
    ))({}),
    SessionStatus: (values => (
      // assembly/identity/authentication/SessionStatus
      values[values.ACTIVE = exports["SessionStatus.ACTIVE"].valueOf()] = "ACTIVE",
      values[values.EXPIRED = exports["SessionStatus.EXPIRED"].valueOf()] = "EXPIRED",
      values[values.REVOKED = exports["SessionStatus.REVOKED"].valueOf()] = "REVOKED",
      values[values.SUSPENDED = exports["SessionStatus.SUSPENDED"].valueOf()] = "SUSPENDED",
      values
    ))({}),
    globalAuthManager: {
      // assembly/identity/authentication/globalAuthManager: assembly/identity/authentication/AuthenticationManager
      valueOf() { return this.value; },
      get value() {
        return __liftInternref(exports.globalAuthManager.value >>> 0);
      }
    },
  }, exports);
  function __liftString(pointer) {
    if (!pointer) return null;
    const
      end = pointer + new Uint32Array(memory.buffer)[pointer - 4 >>> 2] >>> 1,
      memoryU16 = new Uint16Array(memory.buffer);
    let
      start = pointer >>> 1,
      string = "";
    while (end - start > 1024) string += String.fromCharCode(...memoryU16.subarray(start, start += 1024));
    return string + String.fromCharCode(...memoryU16.subarray(start, end));
  }
  function __lowerString(value) {
    if (value == null) return 0;
    const
      length = value.length,
      pointer = exports.__new(length << 1, 2) >>> 0,
      memoryU16 = new Uint16Array(memory.buffer);
    for (let i = 0; i < length; ++i) memoryU16[(pointer >>> 1) + i] = value.charCodeAt(i);
    return pointer;
  }
  function __liftArray(liftElement, align, pointer) {
    if (!pointer) return null;
    const
      dataStart = __getU32(pointer + 4),
      length = __dataview.getUint32(pointer + 12, true),
      values = new Array(length);
    for (let i = 0; i < length; ++i) values[i] = liftElement(dataStart + (i << align >>> 0));
    return values;
  }
  function __lowerArray(lowerElement, id, align, values) {
    if (values == null) return 0;
    const
      length = values.length,
      buffer = exports.__pin(exports.__new(length << align, 1)) >>> 0,
      header = exports.__pin(exports.__new(16, id)) >>> 0;
    __setU32(header + 0, buffer);
    __dataview.setUint32(header + 4, buffer, true);
    __dataview.setUint32(header + 8, length << align, true);
    __dataview.setUint32(header + 12, length, true);
    for (let i = 0; i < length; ++i) lowerElement(buffer + (i << align >>> 0), values[i]);
    exports.__unpin(buffer);
    exports.__unpin(header);
    return header;
  }
  function __lowerTypedArray(constructor, id, align, values) {
    if (values == null) return 0;
    const
      length = values.length,
      buffer = exports.__pin(exports.__new(length << align, 1)) >>> 0,
      header = exports.__new(12, id) >>> 0;
    __setU32(header + 0, buffer);
    __dataview.setUint32(header + 4, buffer, true);
    __dataview.setUint32(header + 8, length << align, true);
    new constructor(memory.buffer, buffer, length).set(values);
    exports.__unpin(buffer);
    return header;
  }
  class Internref extends Number {}
  const registry = new FinalizationRegistry(__release);
  function __liftInternref(pointer) {
    if (!pointer) return null;
    const sentinel = new Internref(__retain(pointer));
    registry.register(sentinel, pointer);
    return sentinel;
  }
  function __lowerInternref(value) {
    if (value == null) return 0;
    if (value instanceof Internref) return value.valueOf();
    throw TypeError("internref expected");
  }
  const refcounts = new Map();
  function __retain(pointer) {
    if (pointer) {
      const refcount = refcounts.get(pointer);
      if (refcount) refcounts.set(pointer, refcount + 1);
      else refcounts.set(exports.__pin(pointer), 1);
    }
    return pointer;
  }
  function __release(pointer) {
    if (pointer) {
      const refcount = refcounts.get(pointer);
      if (refcount === 1) exports.__unpin(pointer), refcounts.delete(pointer);
      else if (refcount) refcounts.set(pointer, refcount - 1);
      else throw Error(`invalid refcount '${refcount}' for reference '${pointer}'`);
    }
  }
  function __notnull() {
    throw TypeError("value must not be null");
  }
  let __dataview = new DataView(memory.buffer);
  function __setU32(pointer, value) {
    try {
      __dataview.setUint32(pointer, value, true);
    } catch {
      __dataview = new DataView(memory.buffer);
      __dataview.setUint32(pointer, value, true);
    }
  }
  function __setF64(pointer, value) {
    try {
      __dataview.setFloat64(pointer, value, true);
    } catch {
      __dataview = new DataView(memory.buffer);
      __dataview.setFloat64(pointer, value, true);
    }
  }
  function __getI32(pointer) {
    try {
      return __dataview.getInt32(pointer, true);
    } catch {
      __dataview = new DataView(memory.buffer);
      return __dataview.getInt32(pointer, true);
    }
  }
  function __getU32(pointer) {
    try {
      return __dataview.getUint32(pointer, true);
    } catch {
      __dataview = new DataView(memory.buffer);
      return __dataview.getUint32(pointer, true);
    }
  }
  function __getU64(pointer) {
    try {
      return __dataview.getBigUint64(pointer, true);
    } catch {
      __dataview = new DataView(memory.buffer);
      return __dataview.getBigUint64(pointer, true);
    }
  }
  function __getF64(pointer) {
    try {
      return __dataview.getFloat64(pointer, true);
    } catch {
      __dataview = new DataView(memory.buffer);
      return __dataview.getFloat64(pointer, true);
    }
  }
  return adaptedExports;
}
export const {
  memory,
  __new,
  __pin,
  __unpin,
  __collect,
  __rtti_base,
  currentNode,
  setCurrentNode,
  PI,
  ProtocolType,
  NetworkError,
  ProtocolError,
  tensor,
  collapse,
  rotatePhase,
  linkEntanglement,
  route,
  coherence,
  entropy,
  stabilize,
  teleport,
  entangled,
  observe,
  PHI,
  DELTA_S,
  primeOperator,
  factorizationOperator,
  rotationOperator,
  coherenceOperator,
  primeSpectrum,
  symbolicCollapse,
  transmitQuaternionicMessage,
  superpose,
  measure,
  collapse,
  entropyRate,
  align,
  generateSymbol,
  toFixed,
  initializeEntropyViz,
  getGlobalSampler,
  getGlobalTracker,
  exportEntropyData,
  exportEntropyHistory,
  escapeJSON,
  toFixed,
  serializeString,
  serializeNumber,
  serializeBoolean,
  serializeInteger,
  validateString,
  validateNumber,
  validateObject,
  modExpOptimized,
  modInverseOptimized,
  simdArrayMul,
  simdArrayAdd,
  simdDotProduct,
  getPrimeCacheStats,
  resetMathOptimizations,
  getMathPerformanceReport,
  validateMathOperations,
  benchmarkMathOperations,
  testMathOperations,
  SMALL_PRIMES,
  primeCache,
  extendedGCD,
  modInverse,
  MILLER_RABIN_WITNESSES_32,
  MILLER_RABIN_WITNESSES_64,
  millerRabinDeterministic32,
  millerRabinDeterministic64,
  modExpMontgomery,
  mulMod,
  addMod,
  modExp,
  arrayMul,
  arrayAdd,
  dotProduct,
  vectorMagnitude,
  normalizeVector,
  lerp,
  clamp,
  fastInvSqrt,
  approxEqual,
  safeDivide,
  gcd,
  lcm,
  isPerfectSquare,
  isqrt,
  globalMathProfiler,
  profileMathOperation,
  globalMathMemoryTracker,
  isPrimeOptimized,
  generatePrimeOptimized,
  generatePrimesOptimized,
  isGaussianPrime,
  sieveOfEratosthenes,
  nextPrime,
  previousPrime,
  PHI,
  E,
  PI,
  TWO_PI,
  SHA256_H,
  SHA256_K,
  HMAC_IPAD,
  HMAC_OPAD,
  SHA256_BLOCK_SIZE,
  SHA256_OUTPUT_SIZE,
  DEFAULT_PRNG_SEED,
  LCG_MULTIPLIER,
  LCG_INCREMENT,
  LCG_MODULUS,
  MERSENNE_PRIME_31,
  FIELD_GENERATOR,
  MILLER_RABIN_ITERATIONS,
  DEFAULT_PRIME_MIN_BITS,
  DEFAULT_PRIME_MAX_BITS,
  MIN_ENTANGLEMENT_STRENGTH,
  MAX_MESSAGE_SIZE,
  DEFAULT_PROTOCOL_TIMEOUT,
  DEFAULT_CONSENSUS_THRESHOLD,
  MAX_ACTIVE_ROUNDS,
  DEFAULT_CACHE_TIMEOUT,
  DEFAULT_SYNC_INTERVAL,
  DEFAULT_PHASE_TOLERANCE,
  MAX_FRAGMENTS_PER_NODE,
  DEFAULT_DHT_TTL,
  DEFAULT_CHECKPOINT_INTERVAL,
  MAX_CHECKPOINTS,
  BELL_PAIR_MAX_AGE,
  KEYTRIPLET_PRIME_COUNT,
  KEYTRIPLET_NOISE_SCALE,
  DEFAULT_PBKDF2_ITERATIONS,
  DEFAULT_PBKDF2_KEY_LENGTH,
  OPTIMIZATION_INTERVAL,
  MIN_OPTIMIZATION_ENTANGLEMENT,
  MAX_OPTIMIZATION_ENTANGLEMENT,
  ENTANGLEMENT_STEP,
  PATTERN_DECAY_RATE,
  LOAD_BALANCE_WEIGHT,
  DEFAULT_LEARNING_RATE,
  DEFAULT_OPTIMIZATION_ITERATIONS,
  DEFAULT_MONITORING_INTERVAL,
  DEFAULT_HISTORY_SIZE,
  NODE_HEALTH_TIMEOUT,
  NODE_STALE_TIMEOUT,
  CRITICAL_ERROR_THRESHOLD,
  POOR_COHERENCE_THRESHOLD,
  DEFAULT_MAX_ERROR_RATE,
  DEFAULT_MAX_LATENCY_P99,
  MAX_ENTROPY_HISTORY,
  GRADIENT_STEP_SIZE,
  NetworkError,
  ProtocolError,
  generateUniqueId,
  degreesToRadians,
  radiansToDegrees,
  clamp,
  lerp,
  approxEqual,
  exampleUsage,
  IdentityType,
  KYCLevel,
  KYCVerificationStatus,
  PermissionScope,
  AuditAction,
  AuditResult,
  RecoveryMethod,
  globalPrimeMapper,
  TransferType,
  TransferStatus,
  globalTransferManager,
  AuditEventType,
  AuditSeverity,
  globalAuditTrail,
  RecoveryStatus,
  globalRecoveryManager,
  DomainStatus,
  InheritanceMode,
  globalPermissionInheritance,
  AuthMethod,
  SessionStatus,
  globalAuthManager,
} = await (async url => instantiate(
  await (async () => {
    const isNodeOrBun = typeof process != "undefined" && process.versions != null && (process.versions.node != null || process.versions.bun != null);
    if (isNodeOrBun) { return globalThis.WebAssembly.compile(await (await import("node:fs/promises")).readFile(url)); }
    else { return await globalThis.WebAssembly.compileStreaming(globalThis.fetch(url)); }
  })(), {
  }
))(new URL("resolang.wasm", import.meta.url));
