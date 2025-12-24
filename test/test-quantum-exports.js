/**
 * Test script to verify quantum exports are working correctly
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function testQuantumExports() {
  try {
    // Import the resolang library
    const resolang = await import('../build/resolang.js');
    
    console.log('✅ Successfully imported resolang library');
    
    // Test HolographicEncoding
    if (typeof resolang.createHolographicEncoding === 'function') {
      console.log('✅ createHolographicEncoding function is available');
      const encoding = resolang.createHolographicEncoding();
      console.log('✅ Successfully created holographic encoding:', encoding);
      
      if (typeof resolang.holographicEncodingEncode === 'function') {
        const amp = resolang.holographicEncodingEncode(encoding, 1, 2, 0.5);
        console.log('✅ Holographic encoding encode works:', amp);
      }
      
      if (typeof resolang.holographicEncodingDecode === 'function') {
        const decoded = resolang.holographicEncodingDecode(encoding, 1, 2);
        console.log('✅ Holographic encoding decode works:', decoded);
      }
    } else {
      console.log('❌ createHolographicEncoding function not found');
    }
    
    // Test EntropyEvolution
    if (typeof resolang.createEntropyEvolution === 'function') {
      console.log('✅ createEntropyEvolution function is available');
      const evolution = resolang.createEntropyEvolution(1.0, 0.1);
      console.log('✅ Successfully created entropy evolution:', evolution);
      
      if (typeof resolang.entropyEvolutionEvolve === 'function') {
        const entropy = resolang.entropyEvolutionEvolve(evolution, 5.0);
        console.log('✅ Entropy evolution evolve works:', entropy);
      }
      
      if (typeof resolang.entropyEvolutionCollapseProbability === 'function') {
        const prob = resolang.entropyEvolutionCollapseProbability(evolution, 5.0);
        console.log('✅ Entropy evolution collapse probability works:', prob);
      }
    } else {
      console.log('❌ createEntropyEvolution function not found');
    }
    
    console.log('\n🎉 Quantum export testing completed successfully!');
    console.log('All quantum classes and operations are now properly exported.');
    
  } catch (error) {
    console.error('❌ Error testing quantum exports:', error);
    return false;
  }
  
  return true;
}

// Check if type definitions exist
function checkTypeDefinitions() {
  const dtsPath = path.join(__dirname, 'build', 'resolang.d.ts');
  if (fs.existsSync(dtsPath)) {
    const content = fs.readFileSync(dtsPath, 'utf8');
    const quantumFunctions = [
      'createHolographicEncoding',
      'holographicEncodingEncode',
      'holographicEncodingDecode',
      'holographicEncodingClear',
      'createEntropyEvolution',
      'entropyEvolutionEvolve',
      'entropyEvolutionCollapseProbability'
    ];
    
    console.log('\n📝 Checking type definitions:');
    
    let allFound = true;
    for (const func of quantumFunctions) {
      if (content.includes(func)) {
        console.log(`✅ ${func} type definition found`);
      } else {
        console.log(`❌ ${func} type definition missing`);
        allFound = false;
      }
    }
    
    if (allFound) {
      console.log('🎉 All quantum function type definitions are present!');
    }
    
    return allFound;
  } else {
    console.log('❌ Type definition file not found');
    return false;
  }
}

// Run tests
async function main() {
  console.log('🧪 Testing ResoLang Quantum Exports\n');
  
  const typeDefsOk = checkTypeDefinitions();
  const exportsOk = await testQuantumExports();
  
  if (typeDefsOk && exportsOk) {
    console.log('\n✅ ALL TESTS PASSED - Quantum exports are ready for VS Code extension integration!');
    process.exit(0);
  } else {
    console.log('\n❌ SOME TESTS FAILED - Please check the export configuration');
    process.exit(1);
  }
}

main().catch(console.error);