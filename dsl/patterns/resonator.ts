// Sephirotic Resonator Pattern
// Provides the standard topology and resonance loop logic for the Cognitive Resonator

export const SEPHIROTIC_TOPOLOGY = {
  // Keter (Intention) -> Chokmah, Binah, Tiphereth
  37: [23, 3, 17],
  // Chokmah (Wisdom/Creativity) -> Keter, Tiphereth, Netzach
  23: [37, 17, 67],
  // Binah (Understanding/Structure) -> Keter, Tiphereth, Geburah
  3: [37, 17, 83],
  // Tiphereth (Beauty/Harmony) -> Chokmah, Binah, Malkuth, Netzach, Hod
  17: [23, 3, 43, 67, 83],
  // Malkuth (Kingdom/Action) -> Tiphereth, Netzach, Hod
  43: [17, 67, 83],
  // Netzach (Victory/Emotion) -> Chokmah, Tiphereth, Malkuth
  67: [23, 17, 43],
  // Hod (Splendor/Intellect) -> Binah, Tiphereth, Malkuth
  83: [3, 17, 43]
};

export const RESONATOR_SOURCE = `
PROGRAM SEPHIROTIC_RESONATOR_V2 {
  CONFIG {
    q_factor: 500, 
    coupling_strength: 0.75,
    convergence_limit: 0.001,
    damping: 0.1,
    
    // The Paths (Edges) connecting the Primes (Nodes)
    topology: {
      37: [23, 3, 17],   // Intention -> Creativity, Structure, Harmony
      23: [37, 17, 67],  // Creativity -> Intention, Harmony, Love
      3:  [37, 17, 83],  // Structure -> Intention, Harmony, Justice
      17: [23, 3, 43, 67, 83], // Harmony centers the tree
      43: [17, 83, 67],  // Action receives from Harmony, Justice, Love
      67: [23, 17, 43],
      83: [3, 17, 43]
    }
  }

  // The 'Cavity' state: A map of the energy active at each Node
  STATE node_states = {
    37: QUATERNION([0,0,0],0,[0,0],[0,0]),
    23: QUATERNION([0,0,0],0,[0,0],[0,0]),
    3:  QUATERNION([0,0,0],0,[0,0],[0,0]),
    17: QUATERNION([0,0,0],0,[0,0],[0,0]),
    43: QUATERNION([0,0,0],0,[0,0],[0,0]),
    67: QUATERNION([0,0,0],0,[0,0],[0,0]),
    83: QUATERNION([0,0,0],0,[0,0],[0,0])
  }

  // The raw input stimulus (will be injected)
  STATE input_impulse = QUATERNION([0, 0, 0], 0, [0,0], [0,0]) 

  FUNCTION resonate(impulse) {
    // 1. INJECTION: Pump energy into Keter (Intention/37) and Malkuth (Action/43)
    node_states[37] = impulse
    node_states[43] = SCALE(impulse, 0.5)
    
    VAR t = 0
    VAR coherent = false
    VAR global_delta = 1.0
    
    // Resonance Loop
    WHILE (global_delta > CONFIG.convergence_limit) {
      t = t + 1
      global_delta = 0.0
      
      // A temporary buffer for the next timestep (synchronous update)
      VAR next_states = COPY(node_states)
      
      // 2. PROPAGATION & INTERFERENCE
      FOR prime_id IN KEYS(node_states) {
        VAR current_wave = node_states[prime_id]
        VAR incoming_flux = QUATERNION([0,0,0],0,[0,0],[0,0])
        
        // Sum inputs from all connected neighbors (The Paths)
        FOR neighbor IN CONFIG.topology[prime_id] {
           incoming_flux = VECTOR_ADD(incoming_flux, SCALE(node_states[neighbor], CONFIG.coupling_strength))
        }
        
        // 3. NODE RESONANCE (Refraction)
        // The node's own nature acts as a forceful harmonic oscillator
        VAR prime_eigenvector = GET_EIGENVECTOR(prime_id)
        
        // Calculate alignment: How much of the flux matches this node?
        VAR alignment = COMPUTE_RESONANCE(incoming_flux, prime_eigenvector, 1.0)
        VAR strength = alignment.strength
        
        // Physics: Driven Damped Harmonic Oscillator
        // If Aligned -> Amplify (The node "sings")
        // If Misaligned -> Dampen (The node absorbs/heats up)
        VAR amplification = (strength * strength) * 2.0
        VAR damping = (1.0 - strength) * CONFIG.damping
        
        VAR gain = amplification - damping
        
        VAR driven_response = SCALE(incoming_flux, gain)
        
        // Prevent NaN/Infinity propagation
        IF (MAGNITUDE(driven_response) > 1000.0) {
           driven_response = NORMALIZE(driven_response)
        }

        VAR new_wave = VECTOR_ADD(
            SCALE(current_wave, 0.9), // Inertia
            driven_response // Driven response
        )
        
        // Normalize to prevent energy explosion (Conservation of Energy)
        next_states[prime_id] = NORMALIZE_TANH(new_wave)
        
        // Track change rate to detect standing wave
        global_delta = global_delta + DISTANCE(current_wave, next_states[prime_id])
      }
      
      node_states = next_states
      
      // Safety break
      IF (t > 50) {
        global_delta = 0.0
      }
    }
    
    RETURN node_states
  }

  EXECUTE {
    // This block is for testing purposes
    VAR result = resonate(input_impulse)
    LOG("Resonance Complete", result)
    STORE_RESULT("result", result)
  }
}
`;
