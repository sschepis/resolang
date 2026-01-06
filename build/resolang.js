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
      "Date.now"() {
        // ~lib/bindings/dom/Date.now() => f64
        return Date.now();
      },
      "console.log"(text) {
        // ~lib/bindings/dom/console.log(~lib/string/String) => void
        text = __liftString(text >>> 0);
        console.log(text);
      },
    }),
  };
  const { exports } = await WebAssembly.instantiate(module, adaptedImports);
  const memory = exports.memory || imports.env.memory;
  const adaptedExports = Object.setPrototypeOf({
    generatePrimes(n) {
      // assembly/core/math/generatePrimes(i32) => ~lib/array/Array<u32>
      return __liftArray(pointer => __getU32(pointer) >>> 0, 2, exports.generatePrimes(n) >>> 0);
    },
    escapeJSON(str) {
      // assembly/core/serialization/escapeJSON(~lib/string/String) => ~lib/string/String
      str = __lowerString(str) || __notnull();
      return __liftString(exports.escapeJSON(str) >>> 0);
    },
    MERSENNE_PRIME_31: {
      // assembly/core/constants/MERSENNE_PRIME_31: u64
      valueOf() { return this.value; },
      get value() {
        return BigInt.asUintN(64, exports.MERSENNE_PRIME_31.value);
      }
    },
    generateUniqueId(prefix) {
      // assembly/core/constants/generateUniqueId(~lib/string/String) => ~lib/string/String
      prefix = __lowerString(prefix) || __notnull();
      return __liftString(exports.generateUniqueId(prefix) >>> 0);
    },
    runFullValidationSuite() {
      // assembly/examples/comprehensive-benchmark-suite/runFullValidationSuite() => ~lib/string/String
      return __liftString(exports.runFullValidationSuite() >>> 0);
    },
    runBenchmarkTests() {
      // assembly/examples/test-comprehensive-benchmark-suite/runBenchmarkTests() => assembly/examples/test-comprehensive-benchmark-suite/BenchmarkTestSuite
      return __liftInternref(exports.runBenchmarkTests() >>> 0);
    },
    SMF_CONFIG: {
      // assembly/smf/SMF_CONFIG: assembly/smf/SMFConfig
      valueOf() { return this.value; },
      get value() {
        return __liftRecord181(exports.SMF_CONFIG.value >>> 0);
      }
    },
    SEMANTIC_AXES: {
      // assembly/smf/SEMANTIC_AXES: ~lib/array/Array<~lib/string/String>
      valueOf() { return this.value; },
      get value() {
        return __liftArray(pointer => __liftString(__getU32(pointer)), 2, exports.SEMANTIC_AXES.value >>> 0);
      }
    },
    createSMFFromValues(values) {
      // assembly/smf/createSMFFromValues(~lib/typedarray/Float64Array) => assembly/smf/SedenionMemoryField
      values = __lowerTypedArray(Float64Array, 185, 3, values) || __notnull();
      return __liftInternref(exports.createSMFFromValues(values) >>> 0);
    },
    createSMFFromText(text) {
      // assembly/smf/createSMFFromText(~lib/string/String) => assembly/smf/SedenionMemoryField
      text = __lowerString(text) || __notnull();
      return __liftInternref(exports.createSMFFromText(text) >>> 0);
    },
    createSnapshot(timestamp, coherence, entropy, numOscillators) {
      // assembly/state/createSnapshot(i64, f64, f64, i32) => assembly/state/StateSnapshot
      timestamp = timestamp || 0n;
      return __liftInternref(exports.createSnapshot(timestamp, coherence, entropy, numOscillators) >>> 0);
    },
    startSentientCore(timestamp) {
      // assembly/sentient/startSentientCore(i64) => void
      timestamp = timestamp || 0n;
      exports.startSentientCore(timestamp);
    },
    tickSentientCore(dt, timestamp) {
      // assembly/sentient/tickSentientCore(f64, i64) => i32
      timestamp = timestamp || 0n;
      return exports.tickSentientCore(dt, timestamp);
    },
    getSentientState() {
      // assembly/sentient/getSentientState() => ~lib/string/String
      return __liftString(exports.getSentientState() >>> 0);
    },
    DISCRETE_CONFIG: {
      // assembly/discrete-observer/DISCRETE_CONFIG: assembly/discrete-observer/DiscreteObserverConfig
      valueOf() { return this.value; },
      get value() {
        return __liftRecord199(exports.DISCRETE_CONFIG.value >>> 0);
      }
    },
    DEFAULT_PRIMES: {
      // assembly/discrete-observer/DEFAULT_PRIMES: ~lib/array/Array<i32>
      valueOf() { return this.value; },
      get value() {
        return __liftArray(__getI32, 2, exports.DEFAULT_PRIMES.value >>> 0);
      }
    },
    ENOCHIAN_PRIMES: {
      // assembly/discrete-observer/ENOCHIAN_PRIMES: ~lib/array/Array<i32>
      valueOf() { return this.value; },
      get value() {
        return __liftArray(__getI32, 2, exports.ENOCHIAN_PRIMES.value >>> 0);
      }
    },
    computeDiscreteCoupling(state, i) {
      // assembly/discrete-observer/computeDiscreteCoupling(assembly/discrete-observer/DiscreteObserverState, i32) => i32
      state = __lowerInternref(state) || __notnull();
      return exports.computeDiscreteCoupling(state, i);
    },
    computeHistogramCoherence(state) {
      // assembly/discrete-observer/computeHistogramCoherence(assembly/discrete-observer/DiscreteObserverState) => f64
      state = __lowerInternref(state) || __notnull();
      return exports.computeHistogramCoherence(state);
    },
    computeWindowedStability(state) {
      // assembly/discrete-observer/computeWindowedStability(assembly/discrete-observer/DiscreteObserverState) => f64
      state = __lowerInternref(state) || __notnull();
      return exports.computeWindowedStability(state);
    },
    getActiveIndices(state) {
      // assembly/discrete-observer/getActiveIndices(assembly/discrete-observer/DiscreteObserverState) => ~lib/typedarray/Int32Array
      state = __lowerInternref(state) || __notnull();
      return __liftTypedArray(Int32Array, exports.getActiveIndices(state) >>> 0);
    },
    getActiveIndicesForLearning(state) {
      // assembly/discrete-observer/getActiveIndicesForLearning(assembly/discrete-observer/DiscreteObserverState) => ~lib/typedarray/Int32Array
      state = __lowerInternref(state) || __notnull();
      return __liftTypedArray(Int32Array, exports.getActiveIndicesForLearning(state) >>> 0);
    },
    compositionVector(u, v) {
      // assembly/discrete-observer/compositionVector(i32, i32) => ~lib/typedarray/Int8Array
      return __liftTypedArray(Int8Array, exports.compositionVector(u, v) >>> 0);
    },
    normalizeSMF(state) {
      // assembly/discrete-observer/normalizeSMF(assembly/discrete-observer/DiscreteObserverState) => void
      state = __lowerInternref(state) || __notnull();
      exports.normalizeSMF(state);
    },
    computeSmfEntropy(state) {
      // assembly/discrete-observer/computeSmfEntropy(assembly/discrete-observer/DiscreteObserverState) => f64
      state = __lowerInternref(state) || __notnull();
      return exports.computeSmfEntropy(state);
    },
    updateSMF(state, activeIndices) {
      // assembly/discrete-observer/updateSMF(assembly/discrete-observer/DiscreteObserverState, ~lib/typedarray/Int32Array) => void
      state = __retain(__lowerInternref(state) || __notnull());
      activeIndices = __lowerTypedArray(Int32Array, 200, 2, activeIndices) || __notnull();
      try {
        exports.updateSMF(state, activeIndices);
      } finally {
        __release(state);
      }
    },
    applyHebbianLearning(state, activeIndices) {
      // assembly/discrete-observer/applyHebbianLearning(assembly/discrete-observer/DiscreteObserverState, ~lib/typedarray/Int32Array) => bool
      state = __retain(__lowerInternref(state) || __notnull());
      activeIndices = __lowerTypedArray(Int32Array, 200, 2, activeIndices) || __notnull();
      try {
        return exports.applyHebbianLearning(state, activeIndices) != 0;
      } finally {
        __release(state);
      }
    },
    decayLearnedCoupling(state, rate) {
      // assembly/discrete-observer/decayLearnedCoupling(assembly/discrete-observer/DiscreteObserverState, f64?) => void
      state = __lowerInternref(state) || __notnull();
      exports.__setArgumentsLength(arguments.length);
      exports.decayLearnedCoupling(state, rate);
    },
    getLearnedCoupling(state, i, j) {
      // assembly/discrete-observer/getLearnedCoupling(assembly/discrete-observer/DiscreteObserverState, i32, i32) => f32
      state = __lowerInternref(state) || __notnull();
      return exports.getLearnedCoupling(state, i, j);
    },
    getLearnedCouplingStrength(state) {
      // assembly/discrete-observer/getLearnedCouplingStrength(assembly/discrete-observer/DiscreteObserverState) => f64
      state = __lowerInternref(state) || __notnull();
      return exports.getLearnedCouplingStrength(state);
    },
    detectLockup(state, dC) {
      // assembly/discrete-observer/detectLockup(assembly/discrete-observer/DiscreteObserverState, f64) => bool
      state = __lowerInternref(state) || __notnull();
      return exports.detectLockup(state, dC) != 0;
    },
    applyControlledTunneling(state) {
      // assembly/discrete-observer/applyControlledTunneling(assembly/discrete-observer/DiscreteObserverState) => void
      state = __lowerInternref(state) || __notnull();
      exports.applyControlledTunneling(state);
    },
    discreteStep(state, driveInput, plasticity) {
      // assembly/discrete-observer/discreteStep(assembly/discrete-observer/DiscreteObserverState, ~lib/typedarray/Float64Array | null?, bool?) => assembly/discrete-observer/DiscreteStepResult
      state = __retain(__lowerInternref(state) || __notnull());
      driveInput = __lowerTypedArray(Float64Array, 185, 3, driveInput);
      plasticity = plasticity ? 1 : 0;
      try {
        exports.__setArgumentsLength(arguments.length);
        return __liftInternref(exports.discreteStep(state, driveInput, plasticity) >>> 0);
      } finally {
        __release(state);
      }
    },
    dampenAll(state) {
      // assembly/discrete-observer/dampenAll(assembly/discrete-observer/DiscreteObserverState) => void
      state = __lowerInternref(state) || __notnull();
      exports.dampenAll(state);
    },
    randomizeCoupling(state) {
      // assembly/discrete-observer/randomizeCoupling(assembly/discrete-observer/DiscreteObserverState) => void
      state = __lowerInternref(state) || __notnull();
      exports.randomizeCoupling(state);
    },
    resetCoupling(state) {
      // assembly/discrete-observer/resetCoupling(assembly/discrete-observer/DiscreteObserverState) => void
      state = __lowerInternref(state) || __notnull();
      exports.resetCoupling(state);
    },
    getStateMetrics(state) {
      // assembly/discrete-observer/getStateMetrics(assembly/discrete-observer/DiscreteObserverState) => ~lib/typedarray/Float64Array
      state = __lowerInternref(state) || __notnull();
      return __liftTypedArray(Float64Array, exports.getStateMetrics(state) >>> 0);
    },
    getPhases(state) {
      // assembly/discrete-observer/getPhases(assembly/discrete-observer/DiscreteObserverState) => ~lib/typedarray/Int32Array
      state = __lowerInternref(state) || __notnull();
      return __liftTypedArray(Int32Array, exports.getPhases(state) >>> 0);
    },
    getAmplitudes(state) {
      // assembly/discrete-observer/getAmplitudes(assembly/discrete-observer/DiscreteObserverState) => ~lib/typedarray/Float64Array
      state = __lowerInternref(state) || __notnull();
      return __liftTypedArray(Float64Array, exports.getAmplitudes(state) >>> 0);
    },
    getSMF(state) {
      // assembly/discrete-observer/getSMF(assembly/discrete-observer/DiscreteObserverState) => ~lib/typedarray/Int32Array
      state = __lowerInternref(state) || __notnull();
      return __liftTypedArray(Int32Array, exports.getSMF(state) >>> 0);
    },
    getWeights(state) {
      // assembly/discrete-observer/getWeights(assembly/discrete-observer/DiscreteObserverState) => ~lib/typedarray/Int32Array
      state = __lowerInternref(state) || __notnull();
      return __liftTypedArray(Int32Array, exports.getWeights(state) >>> 0);
    },
    isLockedUp(state) {
      // assembly/discrete-observer/isLockedUp(assembly/discrete-observer/DiscreteObserverState) => bool
      state = __lowerInternref(state) || __notnull();
      return exports.isLockedUp(state) != 0;
    },
    boostPrime(state, prime) {
      // assembly/discrete-observer/boostPrime(assembly/discrete-observer/DiscreteObserverState, i32) => void
      state = __lowerInternref(state) || __notnull();
      exports.boostPrime(state, prime);
    },
    boostIndex(state, index) {
      // assembly/discrete-observer/boostIndex(assembly/discrete-observer/DiscreteObserverState, i32) => void
      state = __lowerInternref(state) || __notnull();
      exports.boostIndex(state, index);
    },
    discreteObserverGetState() {
      // assembly/discrete-observer/discreteObserverGetState() => ~lib/string/String
      return __liftString(exports.discreteObserverGetState() >>> 0);
    },
    discreteObserverApplyHebbianLearning() {
      // assembly/discrete-observer/discreteObserverApplyHebbianLearning() => bool
      return exports.discreteObserverApplyHebbianLearning() != 0;
    },
    currentNode: {
      // assembly/resolang/currentNode: assembly/resolang/EntangledNode | null
      valueOf() { return this.value; },
      get value() {
        return __liftInternref(exports.currentNode.value >>> 0);
      },
      set value(value) {
        exports.currentNode.value = __lowerInternref(value);
      }
    },
    setCurrentNode(node) {
      // assembly/resolang/setCurrentNode(assembly/resolang/EntangledNode | null) => void
      node = __lowerInternref(node);
      exports.setCurrentNode(node);
    },
    createResonantFragment(pattern, spatialEntropy, angularPosition) {
      // assembly/resolang/createResonantFragment(~lib/string/String, f64?, f64?) => assembly/resolang/ResonantFragment
      pattern = __lowerString(pattern) || __notnull();
      exports.__setArgumentsLength(arguments.length);
      return __liftInternref(exports.createResonantFragment(pattern, spatialEntropy, angularPosition) >>> 0);
    },
    generateEntangledNode(p1, p2, p3) {
      // assembly/resolang/generateEntangledNode(u32, u32, u32) => assembly/resolang/EntangledNode
      return __liftInternref(exports.generateEntangledNode(p1, p2, p3) >>> 0);
    },
    createAttractor(symbol, coherence) {
      // assembly/resolang/createAttractor(~lib/string/String, f64?) => assembly/resolang/Attractor
      symbol = __lowerString(symbol) || __notnull();
      exports.__setArgumentsLength(arguments.length);
      return __liftInternref(exports.createAttractor(symbol, coherence) >>> 0);
    },
    resonantFragmentToJSON(fragment) {
      // assembly/resolang/resonantFragmentToJSON(assembly/resolang/ResonantFragment) => ~lib/string/String
      fragment = __lowerInternref(fragment) || __notnull();
      return __liftString(exports.resonantFragmentToJSON(fragment) >>> 0);
    },
    tensor(fragmentA, fragmentB) {
      // assembly/operators/tensor(assembly/resolang/ResonantFragment, assembly/resolang/ResonantFragment) => assembly/resolang/ResonantFragment
      fragmentA = __retain(__lowerInternref(fragmentA) || __notnull());
      fragmentB = __lowerInternref(fragmentB) || __notnull();
      try {
        return __liftInternref(exports.tensor(fragmentA, fragmentB) >>> 0);
      } finally {
        __release(fragmentA);
      }
    },
    collapse(fragment) {
      // assembly/operators/collapse(assembly/resolang/ResonantFragment) => assembly/resolang/ResonantFragment
      fragment = __lowerInternref(fragment) || __notnull();
      return __liftInternref(exports.collapse(fragment) >>> 0);
    },
    rotatePhase(node, phaseShift) {
      // assembly/operators/rotatePhase(assembly/resolang/EntangledNode, f64) => void
      node = __lowerInternref(node) || __notnull();
      exports.rotatePhase(node, phaseShift);
    },
    linkEntanglement(nodeA, nodeB) {
      // assembly/operators/linkEntanglement(assembly/resolang/EntangledNode, assembly/resolang/EntangledNode) => void
      nodeA = __retain(__lowerInternref(nodeA) || __notnull());
      nodeB = __lowerInternref(nodeB) || __notnull();
      try {
        exports.linkEntanglement(nodeA, nodeB);
      } finally {
        __release(nodeA);
      }
    },
    route(source, target, viaNodes) {
      // assembly/operators/route(assembly/resolang/EntangledNode, assembly/resolang/EntangledNode, ~lib/array/Array<assembly/resolang/EntangledNode>) => bool
      source = __retain(__lowerInternref(source) || __notnull());
      target = __retain(__lowerInternref(target) || __notnull());
      viaNodes = __lowerArray((pointer, value) => { __setU32(pointer, __lowerInternref(value) || __notnull()); }, 233, 2, viaNodes) || __notnull();
      try {
        return exports.route(source, target, viaNodes) != 0;
      } finally {
        __release(source);
        __release(target);
      }
    },
    coherence(node) {
      // assembly/operators/coherence(assembly/resolang/EntangledNode) => f64
      node = __lowerInternref(node) || __notnull();
      return exports.coherence(node);
    },
    entropy(fragment) {
      // assembly/operators/entropy(assembly/resolang/ResonantFragment) => f64
      fragment = __lowerInternref(fragment) || __notnull();
      return exports.entropy(fragment);
    },
    stabilize(node) {
      // assembly/functionalBlocks/stabilize(assembly/resolang/EntangledNode) => bool
      node = __lowerInternref(node) || __notnull();
      return exports.stabilize(node) != 0;
    },
    teleport(mem, to) {
      // assembly/functionalBlocks/teleport(assembly/resolang/ResonantFragment, assembly/resolang/EntangledNode) => bool
      mem = __retain(__lowerInternref(mem) || __notnull());
      to = __lowerInternref(to) || __notnull();
      try {
        return exports.teleport(mem, to) != 0;
      } finally {
        __release(mem);
      }
    },
    entangled(nodeA, nodeB) {
      // assembly/functionalBlocks/entangled(assembly/resolang/EntangledNode, assembly/resolang/EntangledNode) => bool
      nodeA = __retain(__lowerInternref(nodeA) || __notnull());
      nodeB = __lowerInternref(nodeB) || __notnull();
      try {
        return exports.entangled(nodeA, nodeB) != 0;
      } finally {
        __release(nodeA);
      }
    },
    observe(remote) {
      // assembly/functionalBlocks/observe(assembly/resolang/EntangledNode) => ~lib/array/Array<f64>
      remote = __lowerInternref(remote) || __notnull();
      return __liftArray(__getF64, 3, exports.observe(remote) >>> 0);
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
      primes = __lowerArray(__setU32, 15, 2, primes) || __notnull();
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
      a = __retain(__lowerTypedArray(Float64Array, 185, 3, a) || __notnull());
      b = __retain(__lowerTypedArray(Float64Array, 185, 3, b) || __notnull());
      result = __lowerTypedArray(Float64Array, 185, 3, result) || __notnull();
      try {
        exports.simdArrayMul(a, b, result);
      } finally {
        __release(a);
        __release(b);
      }
    },
    simdArrayAdd(a, b, result) {
      // assembly/core/math-optimized/simdArrayAdd(~lib/typedarray/Float64Array, ~lib/typedarray/Float64Array, ~lib/typedarray/Float64Array) => void
      a = __retain(__lowerTypedArray(Float64Array, 185, 3, a) || __notnull());
      b = __retain(__lowerTypedArray(Float64Array, 185, 3, b) || __notnull());
      result = __lowerTypedArray(Float64Array, 185, 3, result) || __notnull();
      try {
        exports.simdArrayAdd(a, b, result);
      } finally {
        __release(a);
        __release(b);
      }
    },
    simdDotProduct(a, b) {
      // assembly/core/math-optimized/simdDotProduct(~lib/typedarray/Float64Array, ~lib/typedarray/Float64Array) => f64
      a = __retain(__lowerTypedArray(Float64Array, 185, 3, a) || __notnull());
      b = __lowerTypedArray(Float64Array, 185, 3, b) || __notnull();
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
      a = __retain(__lowerTypedArray(Float64Array, 185, 3, a) || __notnull());
      b = __retain(__lowerTypedArray(Float64Array, 185, 3, b) || __notnull());
      result = __lowerTypedArray(Float64Array, 185, 3, result) || __notnull();
      try {
        exports.arrayMul(a, b, result);
      } finally {
        __release(a);
        __release(b);
      }
    },
    arrayAdd(a, b, result) {
      // assembly/core/math-operations/arrayAdd(~lib/typedarray/Float64Array, ~lib/typedarray/Float64Array, ~lib/typedarray/Float64Array) => void
      a = __retain(__lowerTypedArray(Float64Array, 185, 3, a) || __notnull());
      b = __retain(__lowerTypedArray(Float64Array, 185, 3, b) || __notnull());
      result = __lowerTypedArray(Float64Array, 185, 3, result) || __notnull();
      try {
        exports.arrayAdd(a, b, result);
      } finally {
        __release(a);
        __release(b);
      }
    },
    dotProduct(a, b) {
      // assembly/core/math-operations/dotProduct(~lib/typedarray/Float64Array, ~lib/typedarray/Float64Array) => f64
      a = __retain(__lowerTypedArray(Float64Array, 185, 3, a) || __notnull());
      b = __lowerTypedArray(Float64Array, 185, 3, b) || __notnull();
      try {
        return exports.dotProduct(a, b);
      } finally {
        __release(a);
      }
    },
    vectorMagnitude(v) {
      // assembly/core/math-operations/vectorMagnitude(~lib/typedarray/Float64Array) => f64
      v = __lowerTypedArray(Float64Array, 185, 3, v) || __notnull();
      return exports.vectorMagnitude(v);
    },
    normalizeVector(v, result) {
      // assembly/core/math-operations/normalizeVector(~lib/typedarray/Float64Array, ~lib/typedarray/Float64Array) => void
      v = __retain(__lowerTypedArray(Float64Array, 185, 3, v) || __notnull());
      result = __lowerTypedArray(Float64Array, 185, 3, result) || __notnull();
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
      // assembly/core/math-primes/generatePrimesOptimized(i32) => ~lib/array/Array<u32>
      return __liftArray(pointer => __getU32(pointer) >>> 0, 2, exports.generatePrimesOptimized(n) >>> 0);
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
    globalResoLangProcessor: {
      // assembly/identity/resolang-processor/globalResoLangProcessor: assembly/identity/resolang-processor/IdentityResoLangProcessor
      valueOf() { return this.value; },
      get value() {
        return __liftInternref(exports.globalResoLangProcessor.value >>> 0);
      }
    },
    quantumCheckPermission(identity, permission, resource) {
      // assembly/identity/resolang-processor/quantumCheckPermission(assembly/identity/interfaces/IIdentity, ~lib/string/String, ~lib/string/String | null?) => bool
      identity = __retain(__lowerRecord101(identity) || __notnull());
      permission = __retain(__lowerString(permission) || __notnull());
      resource = __lowerString(resource);
      try {
        exports.__setArgumentsLength(arguments.length);
        return exports.quantumCheckPermission(identity, permission, resource) != 0;
      } finally {
        __release(identity);
        __release(permission);
      }
    },
    quantumProcessTransfer(request, approvers) {
      // assembly/identity/resolang-processor/quantumProcessTransfer(assembly/identity/ownership-transfer/TransferRequest, ~lib/array/Array<assembly/identity/interfaces/IIdentity>) => bool
      request = __retain(__lowerInternref(request) || __notnull());
      approvers = __lowerArray((pointer, value) => { __setU32(pointer, __lowerRecord101(value) || __notnull()); }, 274, 2, approvers) || __notnull();
      try {
        return exports.quantumProcessTransfer(request, approvers) != 0;
      } finally {
        __release(request);
      }
    },
    quantumRecoverIdentity(lostIdentityId, recoveryIdentities, requiredSignatures) {
      // assembly/identity/resolang-processor/quantumRecoverIdentity(~lib/string/String, ~lib/array/Array<assembly/identity/interfaces/IIdentity>, i32?) => bool
      lostIdentityId = __retain(__lowerString(lostIdentityId) || __notnull());
      recoveryIdentities = __lowerArray((pointer, value) => { __setU32(pointer, __lowerRecord101(value) || __notnull()); }, 274, 2, recoveryIdentities) || __notnull();
      try {
        exports.__setArgumentsLength(arguments.length);
        return exports.quantumRecoverIdentity(lostIdentityId, recoveryIdentities, requiredSignatures) != 0;
      } finally {
        __release(lostIdentityId);
      }
    },
    quantumCreateAuditEntry(entry) {
      // assembly/identity/resolang-processor/quantumCreateAuditEntry(assembly/identity/audit-trail/AuditEntry) => void
      entry = __lowerInternref(entry) || __notnull();
      exports.quantumCreateAuditEntry(entry);
    },
    quantumVerifyAuditIntegrity() {
      // assembly/identity/resolang-processor/quantumVerifyAuditIntegrity() => bool
      return exports.quantumVerifyAuditIntegrity() != 0;
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
    primeSpectrum(state) {
      // assembly/quantum/prime-memory/primeSpectrum(assembly/quantum/prime-state/PrimeState) => ~lib/map/Map<u32,f64>
      state = __lowerInternref(state) || __notnull();
      return __liftInternref(exports.primeSpectrum(state) >>> 0);
    },
    symbolicCollapse(state, n, resonanceFactor) {
      // assembly/quantum/prime-memory/symbolicCollapse(assembly/quantum/prime-state/PrimeState, u32, f64?) => assembly/quantum/prime-state/PrimeState
      state = __lowerInternref(state) || __notnull();
      exports.__setArgumentsLength(arguments.length);
      return __liftInternref(exports.symbolicCollapse(state, n, resonanceFactor) >>> 0);
    },
    primeOperator(state) {
      // assembly/quantum/prime-operators/primeOperator(assembly/quantum/prime-state/PrimeState) => ~lib/map/Map<u32,f64>
      state = __lowerInternref(state) || __notnull();
      return __liftInternref(exports.primeOperator(state) >>> 0);
    },
    factorizationOperator(n) {
      // assembly/quantum/prime-operators/factorizationOperator(u32) => assembly/quantum/prime-state/PrimeState
      return __liftInternref(exports.factorizationOperator(n) >>> 0);
    },
    ControlFlowType: (values => (
      // assembly/runtime/execution/controlFlow/ControlFlowType
      values[values.SEQUENTIAL = exports["ControlFlowType.SEQUENTIAL"].valueOf()] = "SEQUENTIAL",
      values[values.CONDITIONAL = exports["ControlFlowType.CONDITIONAL"].valueOf()] = "CONDITIONAL",
      values[values.LOOP = exports["ControlFlowType.LOOP"].valueOf()] = "LOOP",
      values[values.JUMP = exports["ControlFlowType.JUMP"].valueOf()] = "JUMP",
      values[values.CALL = exports["ControlFlowType.CALL"].valueOf()] = "CALL",
      values[values.RETURN = exports["ControlFlowType.RETURN"].valueOf()] = "RETURN",
      values[values.BREAK = exports["ControlFlowType.BREAK"].valueOf()] = "BREAK",
      values[values.CONTINUE = exports["ControlFlowType.CONTINUE"].valueOf()] = "CONTINUE",
      values[values.HALT = exports["ControlFlowType.HALT"].valueOf()] = "HALT",
      values
    ))({}),
    BasisType: (values => (
      // assembly/runtime/state/primeState/BasisType
      values[values.PRIME = exports["BasisType.PRIME"].valueOf()] = "PRIME",
      values[values.FOURIER = exports["BasisType.FOURIER"].valueOf()] = "FOURIER",
      values[values.WAVELET = exports["BasisType.WAVELET"].valueOf()] = "WAVELET",
      values[values.POLYNOMIAL = exports["BasisType.POLYNOMIAL"].valueOf()] = "POLYNOMIAL",
      values[values.MODULAR = exports["BasisType.MODULAR"].valueOf()] = "MODULAR",
      values
    ))({}),
    createQuaternion(w, x, y, z) {
      // assembly/quaternion-exports/createQuaternion(f64, f64, f64, f64) => assembly/quaternion/Quaternion
      return __liftInternref(exports.createQuaternion(w, x, y, z) >>> 0);
    },
    quaternionMultiply(q1, q2) {
      // assembly/quaternion-exports/quaternionMultiply(assembly/quaternion/Quaternion, assembly/quaternion/Quaternion) => assembly/quaternion/Quaternion
      q1 = __retain(__lowerInternref(q1) || __notnull());
      q2 = __lowerInternref(q2) || __notnull();
      try {
        return __liftInternref(exports.quaternionMultiply(q1, q2) >>> 0);
      } finally {
        __release(q1);
      }
    },
    quaternionConjugate(q) {
      // assembly/quaternion-exports/quaternionConjugate(assembly/quaternion/Quaternion) => assembly/quaternion/Quaternion
      q = __lowerInternref(q) || __notnull();
      return __liftInternref(exports.quaternionConjugate(q) >>> 0);
    },
    quaternionNorm(q) {
      // assembly/quaternion-exports/quaternionNorm(assembly/quaternion/Quaternion) => f64
      q = __lowerInternref(q) || __notnull();
      return exports.quaternionNorm(q);
    },
    quaternionNormalize(q) {
      // assembly/quaternion-exports/quaternionNormalize(assembly/quaternion/Quaternion) => assembly/quaternion/Quaternion
      q = __lowerInternref(q) || __notnull();
      return __liftInternref(exports.quaternionNormalize(q) >>> 0);
    },
    quaternionToBlochVector(q) {
      // assembly/quaternion-exports/quaternionToBlochVector(assembly/quaternion/Quaternion) => ~lib/typedarray/Float64Array
      q = __lowerInternref(q) || __notnull();
      return __liftTypedArray(Float64Array, exports.quaternionToBlochVector(q) >>> 0);
    },
    quaternionExp(q) {
      // assembly/quaternion-exports/quaternionExp(assembly/quaternion/Quaternion) => assembly/quaternion/Quaternion
      q = __lowerInternref(q) || __notnull();
      return __liftInternref(exports.quaternionExp(q) >>> 0);
    },
    quaternionRotate(q, angle) {
      // assembly/quaternion-exports/quaternionRotate(assembly/quaternion/Quaternion, f64) => assembly/quaternion/Quaternion
      q = __lowerInternref(q) || __notnull();
      return __liftInternref(exports.quaternionRotate(q, angle) >>> 0);
    },
    quaternionToString(q) {
      // assembly/quaternion-exports/quaternionToString(assembly/quaternion/Quaternion) => ~lib/string/String
      q = __lowerInternref(q) || __notnull();
      return __liftString(exports.quaternionToString(q) >>> 0);
    },
    quaternionToJSON(q) {
      // assembly/quaternion-exports/quaternionToJSON(assembly/quaternion/Quaternion) => ~lib/string/String
      q = __lowerInternref(q) || __notnull();
      return __liftString(exports.quaternionToJSON(q) >>> 0);
    },
    isSplitPrime(p) {
      // assembly/quaternion-exports/isSplitPrime(u32) => bool
      return exports.isSplitPrime(p) != 0;
    },
    createQuaternionFromPrime(p) {
      // assembly/quaternion-exports/createQuaternionFromPrime(u32) => assembly/quaternion/Quaternion | null
      return __liftInternref(exports.createQuaternionFromPrime(p) >>> 0);
    },
    createQuaternionicResonanceField() {
      // assembly/quaternion-exports/createQuaternionicResonanceField() => assembly/quaternion/QuaternionicResonanceField
      return __liftInternref(exports.createQuaternionicResonanceField() >>> 0);
    },
    addPrimeToResonanceField(field, p) {
      // assembly/quaternion-exports/addPrimeToResonanceField(assembly/quaternion/QuaternionicResonanceField, u32) => bool
      field = __lowerInternref(field) || __notnull();
      return exports.addPrimeToResonanceField(field, p) != 0;
    },
    computeResonanceField(field, x, t) {
      // assembly/quaternion-exports/computeResonanceField(assembly/quaternion/QuaternionicResonanceField, f64, f64) => assembly/quaternion/Quaternion
      field = __lowerInternref(field) || __notnull();
      return __liftInternref(exports.computeResonanceField(field, x, t) >>> 0);
    },
    optimizeResonanceFieldParameters(field, target, iterations) {
      // assembly/quaternion-exports/optimizeResonanceFieldParameters(assembly/quaternion/QuaternionicResonanceField, assembly/quaternion/Quaternion, i32?) => void
      field = __retain(__lowerInternref(field) || __notnull());
      target = __lowerInternref(target) || __notnull();
      try {
        exports.__setArgumentsLength(arguments.length);
        exports.optimizeResonanceFieldParameters(field, target, iterations);
      } finally {
        __release(field);
      }
    },
    createTwistDynamics() {
      // assembly/quaternion-exports/createTwistDynamics() => assembly/quaternion/TwistDynamics
      return __liftInternref(exports.createTwistDynamics() >>> 0);
    },
    computeTwistAngleFromQuaternion(dynamics, q) {
      // assembly/quaternion-exports/computeTwistAngleFromQuaternion(assembly/quaternion/TwistDynamics, assembly/quaternion/Quaternion) => f64
      dynamics = __retain(__lowerInternref(dynamics) || __notnull());
      q = __lowerInternref(q) || __notnull();
      try {
        return exports.computeTwistAngleFromQuaternion(dynamics, q);
      } finally {
        __release(dynamics);
      }
    },
    evolveTwistDynamics(dynamics, dt) {
      // assembly/quaternion-exports/evolveTwistDynamics(assembly/quaternion/TwistDynamics, f64) => void
      dynamics = __lowerInternref(dynamics) || __notnull();
      exports.evolveTwistDynamics(dynamics, dt);
    },
    checkTwistCollapse(dynamics, entropy, entropyThreshold, angleThreshold) {
      // assembly/quaternion-exports/checkTwistCollapse(assembly/quaternion/TwistDynamics, f64, f64, f64) => bool
      dynamics = __lowerInternref(dynamics) || __notnull();
      return exports.checkTwistCollapse(dynamics, entropy, entropyThreshold, angleThreshold) != 0;
    },
    getDynamicsTwistAngle(dynamics) {
      // assembly/quaternion-exports/getDynamicsTwistAngle(assembly/quaternion/TwistDynamics) => f64
      dynamics = __lowerInternref(dynamics) || __notnull();
      return exports.getDynamicsTwistAngle(dynamics);
    },
    setTwistAngle(dynamics, angle) {
      // assembly/quaternion-exports/setTwistAngle(assembly/quaternion/TwistDynamics, f64) => void
      dynamics = __lowerInternref(dynamics) || __notnull();
      exports.setTwistAngle(dynamics, angle);
    },
    createQuaternionicProjector(errorCorrection) {
      // assembly/quaternion-exports/createQuaternionicProjector(f64?) => assembly/quaternion/QuaternionicProjector
      exports.__setArgumentsLength(arguments.length);
      return __liftInternref(exports.createQuaternionicProjector(errorCorrection) >>> 0);
    },
    projectQuaternion(projector, q) {
      // assembly/quaternion-exports/projectQuaternion(assembly/quaternion/QuaternionicProjector, assembly/quaternion/Quaternion) => ~lib/typedarray/Float64Array
      projector = __retain(__lowerInternref(projector) || __notnull());
      q = __lowerInternref(q) || __notnull();
      try {
        return __liftTypedArray(Float64Array, exports.projectQuaternion(projector, q) >>> 0);
      } finally {
        __release(projector);
      }
    },
    computeQuaternionEigenvalues(projector, q) {
      // assembly/quaternion-exports/computeQuaternionEigenvalues(assembly/quaternion/QuaternionicProjector, assembly/quaternion/Quaternion) => ~lib/typedarray/Float64Array
      projector = __retain(__lowerInternref(projector) || __notnull());
      q = __lowerInternref(q) || __notnull();
      try {
        return __liftTypedArray(Float64Array, exports.computeQuaternionEigenvalues(projector, q) >>> 0);
      } finally {
        __release(projector);
      }
    },
    createQuaternionPool(maxSize) {
      // assembly/quaternion-exports/createQuaternionPool(i32?) => assembly/quaternion/QuaternionPool
      exports.__setArgumentsLength(arguments.length);
      return __liftInternref(exports.createQuaternionPool(maxSize) >>> 0);
    },
    allocateQuaternionFromPool(pool) {
      // assembly/quaternion-exports/allocateQuaternionFromPool(assembly/quaternion/QuaternionPool) => assembly/quaternion/Quaternion
      pool = __lowerInternref(pool) || __notnull();
      return __liftInternref(exports.allocateQuaternionFromPool(pool) >>> 0);
    },
    deallocateQuaternionToPool(pool, q) {
      // assembly/quaternion-exports/deallocateQuaternionToPool(assembly/quaternion/QuaternionPool, assembly/quaternion/Quaternion) => void
      pool = __retain(__lowerInternref(pool) || __notnull());
      q = __lowerInternref(q) || __notnull();
      try {
        exports.deallocateQuaternionToPool(pool, q);
      } finally {
        __release(pool);
      }
    },
    createEntangledQuaternionPair(q1, q2, couplingStrength) {
      // assembly/quaternion-exports/createEntangledQuaternionPair(assembly/quaternion/Quaternion, assembly/quaternion/Quaternion, f64?) => assembly/quaternion-entanglement/EntangledQuaternionPair
      q1 = __retain(__lowerInternref(q1) || __notnull());
      q2 = __lowerInternref(q2) || __notnull();
      try {
        exports.__setArgumentsLength(arguments.length);
        return __liftInternref(exports.createEntangledQuaternionPair(q1, q2, couplingStrength) >>> 0);
      } finally {
        __release(q1);
      }
    },
    evolveEntangledPair(pair, dt) {
      // assembly/quaternion-exports/evolveEntangledPair(assembly/quaternion-entanglement/EntangledQuaternionPair, f64) => void
      pair = __lowerInternref(pair) || __notnull();
      exports.evolveEntangledPair(pair, dt);
    },
    computeEntangledPairFidelity(pair, target) {
      // assembly/quaternion-exports/computeEntangledPairFidelity(assembly/quaternion-entanglement/EntangledQuaternionPair, assembly/quaternion-entanglement/EntangledQuaternionPair) => f64
      pair = __retain(__lowerInternref(pair) || __notnull());
      target = __lowerInternref(target) || __notnull();
      try {
        return exports.computeEntangledPairFidelity(pair, target);
      } finally {
        __release(pair);
      }
    },
    optimizeEntanglement(pair, target, iterations) {
      // assembly/quaternion-exports/optimizeEntanglement(assembly/quaternion-entanglement/EntangledQuaternionPair, assembly/quaternion-entanglement/EntangledQuaternionPair, i32?) => void
      pair = __retain(__lowerInternref(pair) || __notnull());
      target = __lowerInternref(target) || __notnull();
      try {
        exports.__setArgumentsLength(arguments.length);
        exports.optimizeEntanglement(pair, target, iterations);
      } finally {
        __release(pair);
      }
    },
    createQuaternionicSynchronizer() {
      // assembly/quaternion-exports/createQuaternionicSynchronizer() => assembly/quaternion-entanglement/QuaternionicSynchronizer
      return __liftInternref(exports.createQuaternionicSynchronizer() >>> 0);
    },
    measureQuaternionPhaseDifference(sync, q1, q2) {
      // assembly/quaternion-exports/measureQuaternionPhaseDifference(assembly/quaternion-entanglement/QuaternionicSynchronizer, assembly/quaternion/Quaternion, assembly/quaternion/Quaternion) => f64
      sync = __retain(__lowerInternref(sync) || __notnull());
      q1 = __retain(__lowerInternref(q1) || __notnull());
      q2 = __lowerInternref(q2) || __notnull();
      try {
        return exports.measureQuaternionPhaseDifference(sync, q1, q2);
      } finally {
        __release(sync);
        __release(q1);
      }
    },
    synchronizeQuaternions(sync, q1, q2, id1, id2, targetPhaseDiff, tolerance) {
      // assembly/quaternion-exports/synchronizeQuaternions(assembly/quaternion-entanglement/QuaternionicSynchronizer, assembly/quaternion/Quaternion, assembly/quaternion/Quaternion, ~lib/string/String, ~lib/string/String, f64?, f64?) => bool
      sync = __retain(__lowerInternref(sync) || __notnull());
      q1 = __retain(__lowerInternref(q1) || __notnull());
      q2 = __retain(__lowerInternref(q2) || __notnull());
      id1 = __retain(__lowerString(id1) || __notnull());
      id2 = __lowerString(id2) || __notnull();
      try {
        exports.__setArgumentsLength(arguments.length);
        return exports.synchronizeQuaternions(sync, q1, q2, id1, id2, targetPhaseDiff, tolerance) != 0;
      } finally {
        __release(sync);
        __release(q1);
        __release(q2);
        __release(id1);
      }
    },
    runAdaptiveSynchronization(sync, pair, maxIterations, dt) {
      // assembly/quaternion-exports/runAdaptiveSynchronization(assembly/quaternion-entanglement/QuaternionicSynchronizer, assembly/quaternion-entanglement/EntangledQuaternionPair, i32?, f64?) => bool
      sync = __retain(__lowerInternref(sync) || __notnull());
      pair = __lowerInternref(pair) || __notnull();
      try {
        exports.__setArgumentsLength(arguments.length);
        return exports.runAdaptiveSynchronization(sync, pair, maxIterations, dt) != 0;
      } finally {
        __release(sync);
      }
    },
    createQuaternionicAgent(q) {
      // assembly/quaternion-exports/createQuaternionicAgent(assembly/quaternion/Quaternion) => assembly/quaternion-entanglement/QuaternionicAgent
      q = __lowerInternref(q) || __notnull();
      return __liftInternref(exports.createQuaternionicAgent(q) >>> 0);
    },
    encodeQuaternionicMessage(agent, message) {
      // assembly/quaternion-exports/encodeQuaternionicMessage(assembly/quaternion-entanglement/QuaternionicAgent, ~lib/string/String) => void
      agent = __retain(__lowerInternref(agent) || __notnull());
      message = __lowerString(message) || __notnull();
      try {
        exports.encodeQuaternionicMessage(agent, message);
      } finally {
        __release(agent);
      }
    },
    decodeQuaternionicMessage(agent) {
      // assembly/quaternion-exports/decodeQuaternionicMessage(assembly/quaternion-entanglement/QuaternionicAgent) => ~lib/string/String
      agent = __lowerInternref(agent) || __notnull();
      return __liftString(exports.decodeQuaternionicMessage(agent) >>> 0);
    },
    entangleQuaternionicAgents(agent1, agent2, targetFidelity) {
      // assembly/quaternion-exports/entangleQuaternionicAgents(assembly/quaternion-entanglement/QuaternionicAgent, assembly/quaternion-entanglement/QuaternionicAgent, f64?) => assembly/quaternion-entanglement/EntangledQuaternionPair
      agent1 = __retain(__lowerInternref(agent1) || __notnull());
      agent2 = __lowerInternref(agent2) || __notnull();
      try {
        exports.__setArgumentsLength(arguments.length);
        return __liftInternref(exports.entangleQuaternionicAgents(agent1, agent2, targetFidelity) >>> 0);
      } finally {
        __release(agent1);
      }
    },
    applyQuaternionicSymbolicCollapse(agent, entropyThreshold) {
      // assembly/quaternion-exports/applyQuaternionicSymbolicCollapse(assembly/quaternion-entanglement/QuaternionicAgent, f64?) => bool
      agent = __lowerInternref(agent) || __notnull();
      exports.__setArgumentsLength(arguments.length);
      return exports.applyQuaternionicSymbolicCollapse(agent, entropyThreshold) != 0;
    },
    getQuaternionicAgentQuaternion(agent) {
      // assembly/quaternion-exports/getQuaternionicAgentQuaternion(assembly/quaternion-entanglement/QuaternionicAgent) => assembly/quaternion/Quaternion
      agent = __lowerInternref(agent) || __notnull();
      return __liftInternref(exports.getQuaternionicAgentQuaternion(agent) >>> 0);
    },
    getQuaternionicAgentEntanglementFidelity(agent) {
      // assembly/quaternion-exports/getQuaternionicAgentEntanglementFidelity(assembly/quaternion-entanglement/QuaternionicAgent) => f64
      agent = __lowerInternref(agent) || __notnull();
      return exports.getQuaternionicAgentEntanglementFidelity(agent);
    },
    getQuaternionW(q) {
      // assembly/quaternion-exports/getQuaternionW(assembly/quaternion/Quaternion) => f64
      q = __lowerInternref(q) || __notnull();
      return exports.getQuaternionW(q);
    },
    getQuaternionX(q) {
      // assembly/quaternion-exports/getQuaternionX(assembly/quaternion/Quaternion) => f64
      q = __lowerInternref(q) || __notnull();
      return exports.getQuaternionX(q);
    },
    getQuaternionY(q) {
      // assembly/quaternion-exports/getQuaternionY(assembly/quaternion/Quaternion) => f64
      q = __lowerInternref(q) || __notnull();
      return exports.getQuaternionY(q);
    },
    getQuaternionZ(q) {
      // assembly/quaternion-exports/getQuaternionZ(assembly/quaternion/Quaternion) => f64
      q = __lowerInternref(q) || __notnull();
      return exports.getQuaternionZ(q);
    },
    setQuaternionComponents(q, w, x, y, z) {
      // assembly/quaternion-exports/setQuaternionComponents(assembly/quaternion/Quaternion, f64, f64, f64, f64) => void
      q = __lowerInternref(q) || __notnull();
      exports.setQuaternionComponents(q, w, x, y, z);
    },
    createHolographicEncoding() {
      // assembly/quantum-exports/createHolographicEncoding() => assembly/quantum/holographic-encoding/HolographicEncoding
      return __liftInternref(exports.createHolographicEncoding() >>> 0);
    },
    holographicEncodingEncode(encoding, x, y, entropy) {
      // assembly/quantum-exports/holographicEncodingEncode(assembly/quantum/holographic-encoding/HolographicEncoding, f64, f64, f64) => f64
      encoding = __lowerInternref(encoding) || __notnull();
      return exports.holographicEncodingEncode(encoding, x, y, entropy);
    },
    holographicEncodingDecode(encoding, queryX, queryY) {
      // assembly/quantum-exports/holographicEncodingDecode(assembly/quantum/holographic-encoding/HolographicEncoding, f64, f64) => f64
      encoding = __lowerInternref(encoding) || __notnull();
      return exports.holographicEncodingDecode(encoding, queryX, queryY);
    },
    holographicEncodingClear(encoding) {
      // assembly/quantum-exports/holographicEncodingClear(assembly/quantum/holographic-encoding/HolographicEncoding) => void
      encoding = __lowerInternref(encoding) || __notnull();
      exports.holographicEncodingClear(encoding);
    },
    createEntropyEvolution(S0, lambda) {
      // assembly/quantum-exports/createEntropyEvolution(f64, f64) => assembly/quantum/entropy-evolution/EntropyEvolution
      return __liftInternref(exports.createEntropyEvolution(S0, lambda) >>> 0);
    },
    entropyEvolutionEvolve(evolution, time) {
      // assembly/quantum-exports/entropyEvolutionEvolve(assembly/quantum/entropy-evolution/EntropyEvolution, f64) => f64
      evolution = __lowerInternref(evolution) || __notnull();
      return exports.entropyEvolutionEvolve(evolution, time);
    },
    entropyEvolutionCollapseProbability(evolution, t) {
      // assembly/quantum-exports/entropyEvolutionCollapseProbability(assembly/quantum/entropy-evolution/EntropyEvolution, f64) => f64
      evolution = __lowerInternref(evolution) || __notnull();
      return exports.entropyEvolutionCollapseProbability(evolution, t);
    },
    createComplex(real, imag) {
      // assembly/complex-exports/createComplex(f64, f64) => assembly/types/Complex
      return __liftInternref(exports.createComplex(real, imag) >>> 0);
    },
    complexAdd(a, b) {
      // assembly/complex-exports/complexAdd(assembly/types/Complex, assembly/types/Complex) => assembly/types/Complex
      a = __retain(__lowerInternref(a) || __notnull());
      b = __lowerInternref(b) || __notnull();
      try {
        return __liftInternref(exports.complexAdd(a, b) >>> 0);
      } finally {
        __release(a);
      }
    },
    complexMultiply(a, b) {
      // assembly/complex-exports/complexMultiply(assembly/types/Complex, assembly/types/Complex) => assembly/types/Complex
      a = __retain(__lowerInternref(a) || __notnull());
      b = __lowerInternref(b) || __notnull();
      try {
        return __liftInternref(exports.complexMultiply(a, b) >>> 0);
      } finally {
        __release(a);
      }
    },
    complexMagnitude(a) {
      // assembly/complex-exports/complexMagnitude(assembly/types/Complex) => f64
      a = __lowerInternref(a) || __notnull();
      return exports.complexMagnitude(a);
    },
    complexFromPolar(magnitude, phase) {
      // assembly/complex-exports/complexFromPolar(f64, f64) => assembly/types/Complex
      return __liftInternref(exports.complexFromPolar(magnitude, phase) >>> 0);
    },
    getComplexReal(a) {
      // assembly/complex-exports/getComplexReal(assembly/types/Complex) => f64
      a = __lowerInternref(a) || __notnull();
      return exports.getComplexReal(a);
    },
    getComplexImag(a) {
      // assembly/complex-exports/getComplexImag(assembly/types/Complex) => f64
      a = __lowerInternref(a) || __notnull();
      return exports.getComplexImag(a);
    },
    createPrimeState() {
      // assembly/prime-state-exports/createPrimeState() => assembly/quantum/prime-state/PrimeState
      return __liftInternref(exports.createPrimeState() >>> 0);
    },
    getPrimeStateAmplitudes(state) {
      // assembly/prime-state-exports/getPrimeStateAmplitudes(assembly/quantum/prime-state/PrimeState) => ~lib/map/Map<f64,f64>
      state = __lowerInternref(state) || __notnull();
      return __liftInternref(exports.getPrimeStateAmplitudes(state) >>> 0);
    },
    getPrimeStateCoefficients(state) {
      // assembly/prime-state-exports/getPrimeStateCoefficients(assembly/quantum/prime-state/PrimeState) => ~lib/array/Array<assembly/types/Complex>
      state = __lowerInternref(state) || __notnull();
      return __liftArray(pointer => __liftInternref(__getU32(pointer)), 2, exports.getPrimeStateCoefficients(state) >>> 0);
    },
    setPrimeStateAmplitudes(state, amplitudes) {
      // assembly/prime-state-exports/setPrimeStateAmplitudes(assembly/quantum/prime-state/PrimeState, ~lib/map/Map<f64,f64>) => void
      state = __retain(__lowerInternref(state) || __notnull());
      amplitudes = __lowerInternref(amplitudes) || __notnull();
      try {
        exports.setPrimeStateAmplitudes(state, amplitudes);
      } finally {
        __release(state);
      }
    },
    createState(type, vars, constraints) {
      // assembly/pnp-exports/createState(i32, ~lib/array/Array<i32>, ~lib/array/Array<assembly/examples/universal-symbolic-transformer/UniversalConstraint>) => assembly/examples/universal-symbolic-transformer/UniversalSymbolicState
      vars = __retain(__lowerArray(__setU32, 33, 2, vars) || __notnull());
      constraints = __lowerArray((pointer, value) => { __setU32(pointer, __lowerInternref(value) || __notnull()); }, 212, 2, constraints) || __notnull();
      try {
        return __liftInternref(exports.createState(type, vars, constraints) >>> 0);
      } finally {
        __release(vars);
      }
    },
    isStateSatisfied(state) {
      // assembly/pnp-exports/isStateSatisfied(assembly/examples/universal-symbolic-transformer/UniversalSymbolicState) => bool
      state = __lowerInternref(state) || __notnull();
      return exports.isStateSatisfied(state) != 0;
    },
    getSolutionEncoding(state) {
      // assembly/pnp-exports/getSolutionEncoding(assembly/examples/universal-symbolic-transformer/UniversalSymbolicState) => ~lib/array/Array<i32>
      state = __lowerInternref(state) || __notnull();
      return __liftArray(__getI32, 2, exports.getSolutionEncoding(state) >>> 0);
    },
    createTransformer(problem_dimension) {
      // assembly/pnp-exports/createTransformer(i32) => assembly/examples/universal-symbolic-transformer/UniversalSymbolicTransformer
      return __liftInternref(exports.createTransformer(problem_dimension) >>> 0);
    },
    encodeProblem(problem_type, variables, raw_constraints, weights) {
      // assembly/pnp-exports/encodeProblem(i32, ~lib/array/Array<i32>, ~lib/array/Array<~lib/array/Array<i32>>, ~lib/array/Array<f64>) => assembly/examples/universal-symbolic-transformer/UniversalSymbolicState
      variables = __retain(__lowerArray(__setU32, 33, 2, variables) || __notnull());
      raw_constraints = __retain(__lowerArray((pointer, value) => { __setU32(pointer, __lowerArray(__setU32, 33, 2, value) || __notnull()); }, 213, 2, raw_constraints) || __notnull());
      weights = __lowerArray(__setF64, 7, 3, weights) || __notnull();
      try {
        return __liftInternref(exports.encodeProblem(problem_type, variables, raw_constraints, weights) >>> 0);
      } finally {
        __release(variables);
        __release(raw_constraints);
      }
    },
    solveProblem(transformer, problem_state) {
      // assembly/pnp-exports/solveProblem(assembly/examples/universal-symbolic-transformer/UniversalSymbolicTransformer, assembly/examples/universal-symbolic-transformer/UniversalSymbolicState) => assembly/examples/universal-symbolic-transformer/UniversalSymbolicState
      transformer = __retain(__lowerInternref(transformer) || __notnull());
      problem_state = __lowerInternref(problem_state) || __notnull();
      try {
        return __liftInternref(exports.solveProblem(transformer, problem_state) >>> 0);
      } finally {
        __release(transformer);
      }
    },
    verifyConvergence(transformer) {
      // assembly/pnp-exports/verifyConvergence(assembly/examples/universal-symbolic-transformer/UniversalSymbolicTransformer) => bool
      transformer = __lowerInternref(transformer) || __notnull();
      return exports.verifyConvergence(transformer) != 0;
    },
    NPProblemType: (values => (
      // assembly/examples/universal-symbolic-transformer/NPProblemType
      values[values.SAT = exports["NPProblemType.SAT"].valueOf()] = "SAT",
      values[values.VERTEX_COVER = exports["NPProblemType.VERTEX_COVER"].valueOf()] = "VERTEX_COVER",
      values[values.HAMILTONIAN_PATH = exports["NPProblemType.HAMILTONIAN_PATH"].valueOf()] = "HAMILTONIAN_PATH",
      values[values.GRAPH_COLORING = exports["NPProblemType.GRAPH_COLORING"].valueOf()] = "GRAPH_COLORING",
      values[values.KNAPSACK = exports["NPProblemType.KNAPSACK"].valueOf()] = "KNAPSACK",
      values[values.TSP = exports["NPProblemType.TSP"].valueOf()] = "TSP",
      values[values.SUBSET_SUM = exports["NPProblemType.SUBSET_SUM"].valueOf()] = "SUBSET_SUM",
      values[values.CLIQUE = exports["NPProblemType.CLIQUE"].valueOf()] = "CLIQUE",
      values[values.INDEPENDENT_SET = exports["NPProblemType.INDEPENDENT_SET"].valueOf()] = "INDEPENDENT_SET",
      values[values.PARTITION = exports["NPProblemType.PARTITION"].valueOf()] = "PARTITION",
      values[values.INTEGER_PROGRAMMING = exports["NPProblemType.INTEGER_PROGRAMMING"].valueOf()] = "INTEGER_PROGRAMMING",
      values[values.STEINER_TREE = exports["NPProblemType.STEINER_TREE"].valueOf()] = "STEINER_TREE",
      values[values.SET_COVER = exports["NPProblemType.SET_COVER"].valueOf()] = "SET_COVER",
      values[values.BIN_PACKING = exports["NPProblemType.BIN_PACKING"].valueOf()] = "BIN_PACKING",
      values[values.SCHEDULING = exports["NPProblemType.SCHEDULING"].valueOf()] = "SCHEDULING",
      values
    ))({}),
    createIdentityProcessor() {
      // assembly/runtime-exports/createIdentityProcessor() => assembly/runtime/processor/IdentityResoLangProcessor
      return __liftInternref(exports.createIdentityProcessor() >>> 0);
    },
    checkPermission(processor, identity, permission, resource) {
      // assembly/runtime-exports/checkPermission(assembly/runtime/processor/IdentityResoLangProcessor, assembly/identity/interfaces/IIdentity, ~lib/string/String, ~lib/string/String | null?) => bool
      processor = __retain(__lowerInternref(processor) || __notnull());
      identity = __retain(__lowerRecord101(identity) || __notnull());
      permission = __retain(__lowerString(permission) || __notnull());
      resource = __lowerString(resource);
      try {
        exports.__setArgumentsLength(arguments.length);
        return exports.checkPermission(processor, identity, permission, resource) != 0;
      } finally {
        __release(processor);
        __release(identity);
        __release(permission);
      }
    },
    processTransferRequest(processor, request, approvers) {
      // assembly/runtime-exports/processTransferRequest(assembly/runtime/processor/IdentityResoLangProcessor, assembly/identity/ownership-transfer/TransferRequest, ~lib/array/Array<assembly/identity/interfaces/IIdentity>) => bool
      processor = __retain(__lowerInternref(processor) || __notnull());
      request = __retain(__lowerInternref(request) || __notnull());
      approvers = __lowerArray((pointer, value) => { __setU32(pointer, __lowerRecord101(value) || __notnull()); }, 274, 2, approvers) || __notnull();
      try {
        return exports.processTransferRequest(processor, request, approvers) != 0;
      } finally {
        __release(processor);
        __release(request);
      }
    },
    recoverIdentity(processor, lostIdentityId, recoveryIdentities, requiredSignatures) {
      // assembly/runtime-exports/recoverIdentity(assembly/runtime/processor/IdentityResoLangProcessor, ~lib/string/String, ~lib/array/Array<assembly/identity/interfaces/IIdentity>, i32?) => bool
      processor = __retain(__lowerInternref(processor) || __notnull());
      lostIdentityId = __retain(__lowerString(lostIdentityId) || __notnull());
      recoveryIdentities = __lowerArray((pointer, value) => { __setU32(pointer, __lowerRecord101(value) || __notnull()); }, 274, 2, recoveryIdentities) || __notnull();
      try {
        exports.__setArgumentsLength(arguments.length);
        return exports.recoverIdentity(processor, lostIdentityId, recoveryIdentities, requiredSignatures) != 0;
      } finally {
        __release(processor);
        __release(lostIdentityId);
      }
    },
    createAuditEntry(processor, entry) {
      // assembly/runtime-exports/createAuditEntry(assembly/runtime/processor/IdentityResoLangProcessor, assembly/identity/audit-trail/AuditEntry) => void
      processor = __retain(__lowerInternref(processor) || __notnull());
      entry = __lowerInternref(entry) || __notnull();
      try {
        exports.createAuditEntry(processor, entry);
      } finally {
        __release(processor);
      }
    },
    verifyAuditIntegrity(processor) {
      // assembly/runtime-exports/verifyAuditIntegrity(assembly/runtime/processor/IdentityResoLangProcessor) => bool
      processor = __lowerInternref(processor) || __notnull();
      return exports.verifyAuditIntegrity(processor) != 0;
    },
    syncWithNetwork(processor) {
      // assembly/runtime-exports/syncWithNetwork(assembly/runtime/processor/IdentityResoLangProcessor) => bool
      processor = __lowerInternref(processor) || __notnull();
      return exports.syncWithNetwork(processor) != 0;
    },
    composeTwistAngles(primes) {
      // assembly/twist/composeTwistAngles(~lib/array/Array<i32>) => f64
      primes = __lowerArray(__setU32, 33, 2, primes) || __notnull();
      return exports.composeTwistAngles(primes);
    },
    isTwistClosed(totalTwist, tolerance) {
      // assembly/twist/isTwistClosed(f64, f64?) => bool
      exports.__setArgumentsLength(arguments.length);
      return exports.isTwistClosed(totalTwist, tolerance) != 0;
    },
    isCoprimeToThirty(n) {
      // assembly/twist/isCoprimeToThirty(i32) => bool
      return exports.isCoprimeToThirty(n) != 0;
    },
    needsMasterKey(primes) {
      // assembly/twist/needsMasterKey(~lib/array/Array<i32>) => bool
      primes = __lowerArray(__setU32, 33, 2, primes) || __notnull();
      return exports.needsMasterKey(primes) != 0;
    },
    applyMasterKey(primes) {
      // assembly/twist/applyMasterKey(~lib/array/Array<i32>) => ~lib/array/Array<i32>
      primes = __lowerArray(__setU32, 33, 2, primes) || __notnull();
      return __liftArray(__getI32, 2, exports.applyMasterKey(primes) >>> 0);
    },
    is108Resonant(n) {
      // assembly/twist/is108Resonant(i32) => bool
      return exports.is108Resonant(n) != 0;
    },
    getLetterData(char) {
      // assembly/enochian/getLetterData(~lib/string/String) => assembly/enochian/EnochianLetter | null
      char = __lowerString(char) || __notnull();
      return __liftInternref(exports.getLetterData(char) >>> 0);
    },
    parseEnochian(text) {
      // assembly/enochian/parseEnochian(~lib/string/String) => assembly/enochian/EnochianParseResult
      text = __lowerString(text) || __notnull();
      return __liftInternref(exports.parseEnochian(text) >>> 0);
    },
    getPreferredLetter(prime, mode) {
      // assembly/enochian/getPreferredLetter(i32, i32) => ~lib/string/String
      return __liftString(exports.getPreferredLetter(prime, mode) >>> 0);
    },
    primesToEnochian(primes, preferredMode) {
      // assembly/enochian/primesToEnochian(~lib/array/Array<i32>, i32?) => ~lib/string/String
      primes = __lowerArray(__setU32, 33, 2, primes) || __notnull();
      exports.__setArgumentsLength(arguments.length);
      return __liftString(exports.primesToEnochian(primes, preferredMode) >>> 0);
    },
    CONFIG: {
      // assembly/physics/CONFIG: assembly/physics/PhysicsConfig
      valueOf() { return this.value; },
      get value() {
        return __liftRecord177(exports.CONFIG.value >>> 0);
      }
    },
    oscillators: {
      // assembly/physics/oscillators: ~lib/array/Array<assembly/physics/PrimeOscillator>
      valueOf() { return this.value; },
      get value() {
        return __liftArray(pointer => __liftInternref(__getU32(pointer)), 2, exports.oscillators.value >>> 0);
      },
      set value(value) {
        exports.oscillators.value = __lowerArray((pointer, value) => { __setU32(pointer, __lowerInternref(value) || __notnull()); }, 179, 2, value) || __notnull();
      }
    },
    updatePhysics() {
      // assembly/physics/updatePhysics() => assembly/physics/PhysicsState
      return __liftInternref(exports.updatePhysics() >>> 0);
    },
    FANO_LINES: {
      // assembly/fano/FANO_LINES: ~lib/staticarray/StaticArray<~lib/staticarray/StaticArray<i32>>
      valueOf() { return this.value; },
      get value() {
        return __liftStaticArray(pointer => __liftStaticArray(__getI32, 2, __getU32(pointer)), 2, exports.FANO_LINES.value >>> 0);
      }
    },
    octonionMultiplyIndex(i, j) {
      // assembly/fano/octonionMultiplyIndex(i32, i32) => assembly/fano/MultiplicationResult
      return __liftInternref(exports.octonionMultiplyIndex(i, j) >>> 0);
    },
    sedenionMultiplyIndex(i, j) {
      // assembly/fano/sedenionMultiplyIndex(i32, i32) => assembly/fano/MultiplicationResult
      return __liftInternref(exports.sedenionMultiplyIndex(i, j) >>> 0);
    },
    multiplyIndices(dim, i, j) {
      // assembly/fano/multiplyIndices(i32, i32, i32) => assembly/fano/MultiplicationResult
      return __liftInternref(exports.multiplyIndices(dim, i, j) >>> 0);
    },
    buildMultiplicationTable(dim) {
      // assembly/fano/buildMultiplicationTable(i32) => ~lib/array/Array<~lib/array/Array<assembly/fano/MultiplicationResult>>
      return __liftArray(pointer => __liftArray(pointer => __liftInternref(__getU32(pointer)), 2, __getU32(pointer)), 2, exports.buildMultiplicationTable(dim) >>> 0);
    },
    basisName(dim, index) {
      // assembly/fano/basisName(i32, i32) => ~lib/string/String
      return __liftString(exports.basisName(dim, index) >>> 0);
    },
    complex(real, imag) {
      // assembly/hypercomplex/complex(f64, f64) => assembly/hypercomplex/Hypercomplex
      return __liftInternref(exports.complex(real, imag) >>> 0);
    },
    quaternion(w, x, y, z) {
      // assembly/hypercomplex/quaternion(f64, f64, f64, f64) => assembly/hypercomplex/Hypercomplex
      return __liftInternref(exports.quaternion(w, x, y, z) >>> 0);
    },
    octonion(c0, c1, c2, c3, c4, c5, c6, c7) {
      // assembly/hypercomplex/octonion(f64, f64, f64, f64, f64, f64, f64, f64) => assembly/hypercomplex/Hypercomplex
      return __liftInternref(exports.octonion(c0, c1, c2, c3, c4, c5, c6, c7) >>> 0);
    },
    getDimensionName(dim) {
      // assembly/hypercomplex/getDimensionName(i32) => ~lib/string/String
      return __liftString(exports.getDimensionName(dim) >>> 0);
    },
    encodeMemory(text, primes) {
      // assembly/hilbert/encodeMemory(~lib/string/String, ~lib/array/Array<u32> | null?) => assembly/hilbert/PrimeHilbertState
      text = __retain(__lowerString(text) || __notnull());
      primes = __lowerArray(__setU32, 15, 2, primes);
      try {
        exports.__setArgumentsLength(arguments.length);
        return __liftInternref(exports.encodeMemory(text, primes) >>> 0);
      } finally {
        __release(text);
      }
    },
    symbolicCompute(inputStates, maxIterations, coherenceThreshold) {
      // assembly/hilbert/symbolicCompute(~lib/array/Array<assembly/hilbert/PrimeHilbertState>, i32?, f64?) => assembly/hilbert/SymbolicComputeResult | null
      inputStates = __lowerArray((pointer, value) => { __setU32(pointer, __lowerInternref(value) || __notnull()); }, 294, 2, inputStates) || __notnull();
      exports.__setArgumentsLength(arguments.length);
      return __liftInternref(exports.symbolicCompute(inputStates, maxIterations, coherenceThreshold) >>> 0);
    },
    resonanceScore(query, key) {
      // assembly/rformer/resonanceScore(assembly/rformer/SparsePrimeState, assembly/rformer/SparsePrimeState) => f64
      query = __retain(__lowerInternref(query) || __notnull());
      key = __lowerInternref(key) || __notnull();
      try {
        return exports.resonanceScore(query, key);
      } finally {
        __release(query);
      }
    },
    resonantAttention(query, keys, values, temperature) {
      // assembly/rformer/resonantAttention(assembly/rformer/SparsePrimeState, ~lib/array/Array<assembly/rformer/SparsePrimeState>, ~lib/array/Array<assembly/rformer/SparsePrimeState>, f64?) => assembly/rformer/SparsePrimeState
      query = __retain(__lowerInternref(query) || __notnull());
      keys = __retain(__lowerArray((pointer, value) => { __setU32(pointer, __lowerInternref(value) || __notnull()); }, 304, 2, keys) || __notnull());
      values = __lowerArray((pointer, value) => { __setU32(pointer, __lowerInternref(value) || __notnull()); }, 304, 2, values) || __notnull();
      try {
        exports.__setArgumentsLength(arguments.length);
        return __liftInternref(exports.resonantAttention(query, keys, values, temperature) >>> 0);
      } finally {
        __release(query);
        __release(keys);
      }
    },
    multiHeadResonantAttention(query, keys, values, numHeads, temperature) {
      // assembly/rformer/multiHeadResonantAttention(assembly/rformer/SparsePrimeState, ~lib/array/Array<assembly/rformer/SparsePrimeState>, ~lib/array/Array<assembly/rformer/SparsePrimeState>, i32?, f64?) => assembly/rformer/SparsePrimeState
      query = __retain(__lowerInternref(query) || __notnull());
      keys = __retain(__lowerArray((pointer, value) => { __setU32(pointer, __lowerInternref(value) || __notnull()); }, 304, 2, keys) || __notnull());
      values = __lowerArray((pointer, value) => { __setU32(pointer, __lowerInternref(value) || __notnull()); }, 304, 2, values) || __notnull();
      try {
        exports.__setArgumentsLength(arguments.length);
        return __liftInternref(exports.multiHeadResonantAttention(query, keys, values, numHeads, temperature) >>> 0);
      } finally {
        __release(query);
        __release(keys);
      }
    },
    PipelineEventType: (values => (
      // assembly/pipelines/types/PipelineEventType
      values[values.TICK = exports["PipelineEventType.TICK"].valueOf()] = "TICK",
      values[values.COLLAPSE = exports["PipelineEventType.COLLAPSE"].valueOf()] = "COLLAPSE",
      values[values.ENTANGLEMENT = exports["PipelineEventType.ENTANGLEMENT"].valueOf()] = "ENTANGLEMENT",
      values[values.RESONANCE = exports["PipelineEventType.RESONANCE"].valueOf()] = "RESONANCE",
      values[values.MEMORY_STORE = exports["PipelineEventType.MEMORY_STORE"].valueOf()] = "MEMORY_STORE",
      values[values.MEMORY_RECALL = exports["PipelineEventType.MEMORY_RECALL"].valueOf()] = "MEMORY_RECALL",
      values[values.COHERENCE_CHANGE = exports["PipelineEventType.COHERENCE_CHANGE"].valueOf()] = "COHERENCE_CHANGE",
      values[values.ENTROPY_CHANGE = exports["PipelineEventType.ENTROPY_CHANGE"].valueOf()] = "ENTROPY_CHANGE",
      values[values.PHASE_LOCK = exports["PipelineEventType.PHASE_LOCK"].valueOf()] = "PHASE_LOCK",
      values[values.STATE_CHANGE = exports["PipelineEventType.STATE_CHANGE"].valueOf()] = "STATE_CHANGE",
      values
    ))({}),
    createSemanticPipeline(config) {
      // assembly/pipelines/semantic/createSemanticPipeline(assembly/pipelines/types/PipelineConfig | null?) => assembly/pipelines/semantic/SemanticPipeline
      config = __lowerRecord305(config);
      exports.__setArgumentsLength(arguments.length);
      return __liftInternref(exports.createSemanticPipeline(config) >>> 0);
    },
    createCognitivePipeline(config) {
      // assembly/pipelines/cognitive/createCognitivePipeline(assembly/pipelines/types/PipelineConfig | null?) => assembly/pipelines/cognitive/CognitivePipeline
      config = __lowerRecord305(config);
      exports.__setArgumentsLength(arguments.length);
      return __liftInternref(exports.createCognitivePipeline(config) >>> 0);
    },
    createMemoryPipeline(config) {
      // assembly/pipelines/memory/createMemoryPipeline(assembly/pipelines/types/PipelineConfig | null?) => assembly/pipelines/memory/MemoryPipeline
      config = __lowerRecord305(config);
      exports.__setArgumentsLength(arguments.length);
      return __liftInternref(exports.createMemoryPipeline(config) >>> 0);
    },
    createEmbeddingPipeline(config) {
      // assembly/pipelines/embedding/createEmbeddingPipeline(assembly/pipelines/types/PipelineConfig | null?) => assembly/pipelines/embedding/EmbeddingPipeline
      config = __lowerRecord305(config);
      exports.__setArgumentsLength(arguments.length);
      return __liftInternref(exports.createEmbeddingPipeline(config) >>> 0);
    },
    createAgentPipeline(config) {
      // assembly/pipelines/agent/createAgentPipeline(assembly/pipelines/types/PipelineConfig | null?) => assembly/pipelines/agent/AgentPipeline
      config = __lowerRecord305(config);
      exports.__setArgumentsLength(arguments.length);
      return __liftInternref(exports.createAgentPipeline(config) >>> 0);
    },
    createDiscretePipeline(config) {
      // assembly/pipelines/discrete/createDiscretePipeline(assembly/pipelines/discrete/DiscreteConfig | null?) => assembly/pipelines/discrete/DiscretePipeline
      config = __lowerRecord324(config);
      exports.__setArgumentsLength(arguments.length);
      return __liftInternref(exports.createDiscretePipeline(config) >>> 0);
    },
    createFastDiscretePipeline() {
      // assembly/pipelines/discrete/createFastDiscretePipeline() => assembly/pipelines/discrete/DiscretePipeline
      return __liftInternref(exports.createFastDiscretePipeline() >>> 0);
    },
    createPreciseDiscretePipeline() {
      // assembly/pipelines/discrete/createPreciseDiscretePipeline() => assembly/pipelines/discrete/DiscretePipeline
      return __liftInternref(exports.createPreciseDiscretePipeline() >>> 0);
    },
  }, exports);
  function __liftRecord181(pointer) {
    // assembly/smf/SMFConfig
    // Hint: Opt-out from lifting as a record by providing an empty constructor
    if (!pointer) return null;
    return {
      decayRate: __getF64(pointer + 0),
      coherenceThreshold: __getF64(pointer + 8),
      resonanceStrength: __getF64(pointer + 16),
      collapseThreshold: __getF64(pointer + 24),
      historyLength: __getI32(pointer + 32),
    };
  }
  function __liftRecord199(pointer) {
    // assembly/discrete-observer/DiscreteObserverConfig
    // Hint: Opt-out from lifting as a record by providing an empty constructor
    if (!pointer) return null;
    return {
      M: __getI32(pointer + 0),
      c: __getI32(pointer + 4),
      d: __getI32(pointer + 8),
      K: __getI32(pointer + 12),
      scale: __getI32(pointer + 16),
      A_max: __getF64(pointer + 24),
      delta: __getF64(pointer + 32),
      B: __getI32(pointer + 40),
      H: __getI32(pointer + 44),
      C_th: __getF64(pointer + 48),
      epsilon_C: __getF64(pointer + 56),
      tau_Var: __getF64(pointer + 64),
      C_lock: __getF64(pointer + 72),
      dC_lock: __getF64(pointer + 80),
      tunnelCooldown: __getI32(pointer + 88),
      entropyFloor: __getF64(pointer + 96),
      entropyCeiling: __getF64(pointer + 104),
      J_max: __getI32(pointer + 112),
      W_max: __getI32(pointer + 116),
      L: __getI32(pointer + 120),
      learningRate: __getF64(pointer + 128),
      learnedCouplingWeight: __getF64(pointer + 136),
      learningThreshold: __getF64(pointer + 144),
      lockupDetectionWindow: __getI32(pointer + 152),
      perturbationStrength: __getF64(pointer + 160),
      maxTotalEnergy: __getF64(pointer + 168),
      targetMaxActive: __getI32(pointer + 176),
    };
  }
  function __lowerRecord101(value) {
    // assembly/identity/interfaces/IIdentity
    // Hint: Opt-out from lowering as a record by providing an empty constructor
    if (value == null) return 0;
    const pointer = exports.__pin(exports.__new(0, 101));
    exports.__unpin(pointer);
    return pointer;
  }
  function __liftRecord177(pointer) {
    // assembly/physics/PhysicsConfig
    // Hint: Opt-out from lifting as a record by providing an empty constructor
    if (!pointer) return null;
    return {
      resonanceThreshold: __getF64(pointer + 0),
      couplingBase: __getF64(pointer + 8),
      simulationSpeed: __getF64(pointer + 16),
      dampening: __getF64(pointer + 24),
      lyapunovStableThreshold: __getF64(pointer + 32),
    };
  }
  function __lowerRecord305(value) {
    // assembly/pipelines/types/PipelineConfig
    // Hint: Opt-out from lowering as a record by providing an empty constructor
    if (value == null) return 0;
    const pointer = exports.__pin(exports.__new(80, 305));
    __setU32(pointer + 0, value.numPrimes);
    __setU32(pointer + 4, value.historyLength);
    __setF64(pointer + 8, value.defaultDt);
    __setF64(pointer + 16, value.collapseThreshold);
    __setF64(pointer + 24, value.coherenceThreshold);
    __setF64(pointer + 32, value.entanglementThreshold);
    __setF64(pointer + 40, value.memoryDecayRate);
    __setF64(pointer + 48, value.entropyDecayRate);
    __setF64(pointer + 56, value.amplitudeDecayRate);
    __setF64(pointer + 64, value.kuramotoCoupling);
    __setF64(pointer + 72, value.resonanceStrength);
    exports.__unpin(pointer);
    return pointer;
  }
  function __lowerRecord324(value) {
    // assembly/pipelines/discrete/DiscreteConfig
    // Hint: Opt-out from lowering as a record by providing an empty constructor
    if (value == null) return 0;
    const pointer = exports.__pin(exports.__new(80, 324));
    __setU32(pointer + 0, value.numOscillators);
    __setU32(pointer + 4, value.phaseResolution);
    __setF64(pointer + 8, value.amplitudeMax);
    __setF64(pointer + 16, value.amplitudeDecay);
    __setF64(pointer + 24, value.activeThreshold);
    __setF64(pointer + 32, value.baseBoostAmount);
    __setU32(pointer + 40, value.couplingStrength);
    __setF64(pointer + 48, value.coherenceThreshold);
    __setF64(pointer + 56, value.hebbianLearningRate);
    __setU8(pointer + 64, value.useEnochianPrimes ? 1 : 0);
    __setU8(pointer + 65, value.enableLockupRecovery ? 1 : 0);
    __setU32(pointer + 68, value.lockupWindow);
    __setF64(pointer + 72, value.lockupThreshold);
    exports.__unpin(pointer);
    return pointer;
  }
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
  function __liftTypedArray(constructor, pointer) {
    if (!pointer) return null;
    return new constructor(
      memory.buffer,
      __getU32(pointer + 4),
      __dataview.getUint32(pointer + 8, true) / constructor.BYTES_PER_ELEMENT
    ).slice();
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
  function __liftStaticArray(liftElement, align, pointer) {
    if (!pointer) return null;
    const
      length = __getU32(pointer - 4) >>> align,
      values = new Array(length);
    for (let i = 0; i < length; ++i) values[i] = liftElement(pointer + (i << align >>> 0));
    return values;
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
  function __setU8(pointer, value) {
    try {
      __dataview.setUint8(pointer, value, true);
    } catch {
      __dataview = new DataView(memory.buffer);
      __dataview.setUint8(pointer, value, true);
    }
  }
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
  generatePrimes,
  escapeJSON,
  PHI,
  E,
  TWO_PI,
  MERSENNE_PRIME_31,
  generateUniqueId,
  degreesToRadians,
  radiansToDegrees,
  runFullValidationSuite,
  runBenchmarkTests,
  SMF_CONFIG,
  SEMANTIC_AXES,
  AXIS_COHERENCE,
  AXIS_IDENTITY,
  AXIS_DUALITY,
  AXIS_STRUCTURE,
  AXIS_CHANGE,
  AXIS_LIFE,
  AXIS_HARMONY,
  AXIS_WISDOM,
  AXIS_INFINITY,
  AXIS_CREATION,
  AXIS_TRUTH,
  AXIS_LOVE,
  AXIS_POWER,
  AXIS_TIME,
  AXIS_SPACE,
  AXIS_CONSCIOUSNESS,
  createSMFFromValues,
  createSMFFromText,
  createSnapshot,
  createSentientCore,
  startSentientCore,
  stopSentientCore,
  tickSentientCore,
  getSentientCoherence,
  getSentientEntropy,
  getSentientSMFAxis,
  getSentientPhase,
  getSentientAmplitude,
  exciteSentientOscillator,
  resetSentientCore,
  getSentientState,
  DISCRETE_CONFIG,
  DEFAULT_PRIMES,
  ENOCHIAN_PRIMES,
  computeDiscreteCoupling,
  computeHistogramCoherence,
  computeWindowedStability,
  getActiveIndices,
  getActiveIndicesForLearning,
  primeToSMFAxis,
  compositionVector,
  normalizeSMF,
  computeSmfEntropy,
  updateSMF,
  applyHebbianLearning,
  decayLearnedCoupling,
  getLearnedCoupling,
  getLearnedCouplingStrength,
  detectLockup,
  applyControlledTunneling,
  discreteStep,
  dampenAll,
  randomizeCoupling,
  resetCoupling,
  getStateMetrics,
  getPhases,
  getAmplitudes,
  getSMF,
  getWeights,
  isLockedUp,
  boostPrime,
  boostIndex,
  createDiscreteObserver,
  discreteObserverStep,
  discreteObserverBoost,
  discreteObserverGetCoherence,
  discreteObserverGetPhase,
  discreteObserverGetAmplitude,
  discreteObserverGetSMFAxis,
  discreteObserverGetTickCount,
  discreteObserverGetEntropy,
  discreteObserverReset,
  discreteObserverGetCount,
  discreteObserverGetState,
  discreteObserverGetLearnedCouplingStrength,
  discreteObserverGetLearnedCoupling,
  discreteObserverApplyHebbianLearning,
  discreteObserverDecayLearnedCoupling,
  currentNode,
  setCurrentNode,
  PI,
  createResonantFragment,
  generateEntangledNode,
  createAttractor,
  resonantFragmentToJSON,
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
  transmitQuaternionicMessage,
  entropyRate,
  align,
  generateSymbol,
  toFixed,
  initializeEntropyViz,
  getGlobalSampler,
  getGlobalTracker,
  exportEntropyData,
  exportEntropyHistory,
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
  globalResoLangProcessor,
  quantumCheckPermission,
  quantumProcessTransfer,
  quantumRecoverIdentity,
  quantumCreateAuditEntry,
  quantumVerifyAuditIntegrity,
  RecoveryStatus,
  globalRecoveryManager,
  DomainStatus,
  InheritanceMode,
  globalPermissionInheritance,
  AuthMethod,
  SessionStatus,
  globalAuthManager,
  primeSpectrum,
  symbolicCollapse,
  primeOperator,
  factorizationOperator,
  rotationOperator,
  DELTA_S,
  ControlFlowType,
  BasisType,
  createQuaternion,
  quaternionMultiply,
  quaternionConjugate,
  quaternionNorm,
  quaternionNormalize,
  quaternionToBlochVector,
  quaternionExp,
  quaternionRotate,
  quaternionToString,
  quaternionToJSON,
  isSplitPrime,
  createQuaternionFromPrime,
  createQuaternionicResonanceField,
  addPrimeToResonanceField,
  computeResonanceField,
  optimizeResonanceFieldParameters,
  createTwistDynamics,
  computeTwistAngleFromQuaternion,
  evolveTwistDynamics,
  checkTwistCollapse,
  getDynamicsTwistAngle,
  setTwistAngle,
  createQuaternionicProjector,
  projectQuaternion,
  computeQuaternionEigenvalues,
  createQuaternionPool,
  allocateQuaternionFromPool,
  deallocateQuaternionToPool,
  createEntangledQuaternionPair,
  evolveEntangledPair,
  computeEntangledPairFidelity,
  optimizeEntanglement,
  createQuaternionicSynchronizer,
  measureQuaternionPhaseDifference,
  synchronizeQuaternions,
  runAdaptiveSynchronization,
  createQuaternionicAgent,
  encodeQuaternionicMessage,
  decodeQuaternionicMessage,
  entangleQuaternionicAgents,
  applyQuaternionicSymbolicCollapse,
  getQuaternionicAgentQuaternion,
  getQuaternionicAgentEntanglementFidelity,
  getQuaternionW,
  getQuaternionX,
  getQuaternionY,
  getQuaternionZ,
  setQuaternionComponents,
  createHolographicEncoding,
  holographicEncodingEncode,
  holographicEncodingDecode,
  holographicEncodingClear,
  createEntropyEvolution,
  entropyEvolutionEvolve,
  entropyEvolutionCollapseProbability,
  createComplex,
  complexAdd,
  complexMultiply,
  complexMagnitude,
  complexFromPolar,
  getComplexReal,
  getComplexImag,
  createPrimeState,
  getPrimeStateAmplitudes,
  getPrimeStateCoefficients,
  setPrimeStateAmplitudes,
  createState,
  isStateSatisfied,
  getSolutionEncoding,
  createTransformer,
  encodeProblem,
  solveProblem,
  verifyConvergence,
  NPProblemType,
  createIdentityProcessor,
  checkPermission,
  processTransferRequest,
  recoverIdentity,
  createAuditEntry,
  verifyAuditIntegrity,
  syncWithNetwork,
  FUNDAMENTAL_INVARIANT,
  PRIMORIAL_BASE,
  MASTER_KEY_PRIME,
  getTwistAngle,
  getTwistRate,
  composeTwistAngles,
  isTwistClosed,
  isCoprimeToThirty,
  getMod30Residue,
  getCoprimeClassIndex,
  residueToSedenionAxis,
  needsMasterKey,
  applyMasterKey,
  symbolicEntropy,
  get108HarmonicOffset,
  is108Resonant,
  getLetterData,
  parseEnochian,
  getPreferredLetter,
  primesToEnochian,
  CONFIG,
  oscillators,
  addOscillator,
  clearOscillators,
  updatePhysics,
  FANO_LINES,
  octonionMultiplyIndex,
  sedenionMultiplyIndex,
  multiplyIndices,
  buildMultiplicationTable,
  basisName,
  complex,
  quaternion,
  octonion,
  getDimensionName,
  encodeMemory,
  symbolicCompute,
  resonanceScore,
  resonantAttention,
  multiHeadResonantAttention,
  PipelineEventType,
  createSemanticPipeline,
  createCognitivePipeline,
  createMemoryPipeline,
  createEmbeddingPipeline,
  createAgentPipeline,
  createDiscretePipeline,
  createFastDiscretePipeline,
  createPreciseDiscretePipeline,
} = await (async url => instantiate(
  await (async () => {
    const isNodeOrBun = typeof process != "undefined" && process.versions != null && (process.versions.node != null || process.versions.bun != null);
    if (isNodeOrBun) { return globalThis.WebAssembly.compile(await (await import("node:fs/promises")).readFile(url)); }
    else { return await globalThis.WebAssembly.compileStreaming(globalThis.fetch(url)); }
  })(), {
  }
))(new URL("resolang.wasm", import.meta.url));
