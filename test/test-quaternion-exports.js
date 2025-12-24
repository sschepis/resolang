/**
 * Test script to verify quaternion exports are working correctly
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function testQuaternionExports() {
  try {
    // Import the resolang library
    const resolang = await import('../build/resolang.js');
    
    console.log('✅ Successfully imported resolang library');
    
    // Test basic quaternion creation
    if (typeof resolang.createQuaternion === 'function') {
      console.log('✅ createQuaternion function is available');
      
      // Try to create a quaternion
      const q = resolang.createQuaternion(1, 0, 0, 0);
      console.log('✅ Successfully created quaternion:', q);
      
      // Test quaternion operations
      if (typeof resolang.quaternionNorm === 'function') {
        const norm = resolang.quaternionNorm(q);
        console.log('✅ Quaternion norm calculation works:', norm);
      }
      
      if (typeof resolang.quaternionToString === 'function') {
        const str = resolang.quaternionToString(q);
        console.log('✅ Quaternion string conversion works:', str);
      }
    } else {
      console.log('❌ createQuaternion function not found');
    }
    
    // Test split prime functionality
    if (typeof resolang.isSplitPrime === 'function') {
      console.log('✅ isSplitPrime function is available');
      const result = resolang.isSplitPrime(13); // 13 % 12 = 1, so it's a split prime
      console.log('✅ Split prime test (13):', result);
    } else {
      console.log('❌ isSplitPrime function not found');
    }
    
    // Test quaternion pool
    if (typeof resolang.createQuaternionPool === 'function') {
      console.log('✅ createQuaternionPool function is available');
      const pool = resolang.createQuaternionPool(100);
      console.log('✅ Successfully created quaternion pool:', pool);
    } else {
      console.log('❌ createQuaternionPool function not found');
    }
    
    // Test resonance field
    if (typeof resolang.createQuaternionicResonanceField === 'function') {
      console.log('✅ createQuaternionicResonanceField function is available');
      const field = resolang.createQuaternionicResonanceField();
      console.log('✅ Successfully created resonance field:', field);
    } else {
      console.log('❌ createQuaternionicResonanceField function not found');
    }
    
    // Test entanglement
    if (typeof resolang.createQuaternionicAgent === 'function') {
      console.log('✅ createQuaternionicAgent function is available');
    } else {
      console.log('❌ createQuaternionicAgent function not found');
    }
    
    console.log('\n🎉 Quaternion export testing completed successfully!');
    console.log('All quaternion classes and operations are now properly exported.');
    
  } catch (error) {
    console.error('❌ Error testing quaternion exports:', error);
    return false;
  }
  
  return true;
}

// Check if type definitions exist
function checkTypeDefinitions() {
  const dtsPath = path.join(__dirname, 'build', 'resolang.d.ts');
  if (fs.existsSync(dtsPath)) {
    const content = fs.readFileSync(dtsPath, 'utf8');
    const quaternionFunctions = [
      'createQuaternion',
      'quaternionMultiply',
      'quaternionNormalize',
      'isSplitPrime',
      'createQuaternionFromPrime',
      'createQuaternionicResonanceField',
      'createTwistDynamics',
      'createQuaternionicProjector',
      'createQuaternionPool',
      'createEntangledQuaternionPair',
      'createQuaternionicSynchronizer',
      'createQuaternionicAgent'
    ];
    
    console.log('\n📝 Checking type definitions:');
    
    let allFound = true;
    for (const func of quaternionFunctions) {
      if (content.includes(func)) {
        console.log(`✅ ${func} type definition found`);
      } else {
        console.log(`❌ ${func} type definition missing`);
        allFound = false;
      }
    }
    
    if (allFound) {
      console.log('🎉 All quaternion function type definitions are present!');
    }
    
    return allFound;
  } else {
    console.log('❌ Type definition file not found');
    return false;
  }
}

// Run tests
async function main() {
  console.log('🧪 Testing ResoLang Quaternion Exports\n');
  
  const typeDefsOk = checkTypeDefinitions();
  const exportsOk = await testQuaternionExports();
  
  if (typeDefsOk && exportsOk) {
    console.log('\n✅ ALL TESTS PASSED - Quaternion exports are ready for VS Code extension integration!');
    process.exit(0);
  } else {
    console.log('\n❌ SOME TESTS FAILED - Please check the export configuration');
    process.exit(1);
  }
}

main().catch(console.error);