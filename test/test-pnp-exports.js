/**
 * Test script to verify P=NP solver exports are working correctly
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function testPnpExports() {
  try {
    // Import the resolang library
    const resolang = await import('../build/resolang.js');
    
    console.log('✅ Successfully imported resolang library');
    
    // Test that the new functions are available
    const functionsToTest = [
      'createState',
      'isStateSatisfied',
      'getSolutionEncoding',
      'createTransformer',
      'encodeProblem',
      'solveProblem',
      'verifyConvergence'
    ];

    let allFunctionsFound = true;
    for (const func of functionsToTest) {
      if (typeof resolang[func] === 'function') {
        console.log(`✅ ${func} function is available`);
      } else {
        console.log(`❌ ${func} function not found`);
        allFunctionsFound = false;
      }
    }

    if (!allFunctionsFound) {
        throw new Error('One or more exported functions are missing.');
    }

    // Test that the NPProblemType enum is available
    if (typeof resolang.NPProblemType === 'object') {
        console.log('✅ NPProblemType enum is available');
        if (resolang.NPProblemType.TSP === 5) {
            console.log('✅ NPProblemType.TSP has the correct value');
        } else {
            console.log('❌ NPProblemType.TSP has the wrong value');
        }
    } else {
        console.log('❌ NPProblemType enum not found');
    }
    
    console.log('\n🎉 P=NP solver export testing completed successfully!');
    
  } catch (error) {
    console.error('❌ Error testing P=NP solver exports:', error);
    return false;
  }
  
  return true;
}

// Check if type definitions exist
function checkTypeDefinitions() {
  const dtsPath = path.join(__dirname, 'build', 'resolang.d.ts');
  if (fs.existsSync(dtsPath)) {
    const content = fs.readFileSync(dtsPath, 'utf8');
    const pnpFunctions = [
      'createState',
      'isStateSatisfied',
      'getSolutionEncoding',
      'createTransformer',
      'encodeProblem',
      'solveProblem',
      'verifyConvergence',
      'NPProblemType',
      'UniversalConstraint'
    ];
    
    console.log('\n📝 Checking type definitions:');
    
    let allFound = true;
    for (const func of pnpFunctions) {
      if (content.includes(func)) {
        console.log(`✅ ${func} type definition found`);
      } else {
        console.log(`❌ ${func} type definition missing`);
        allFound = false;
      }
    }
    
    if (allFound) {
      console.log('🎉 All P=NP solver function type definitions are present!');
    }
    
    return allFound;
  } else {
    console.log('❌ Type definition file not found');
    return false;
  }
}

// Run tests
async function main() {
  console.log('🧪 Testing ResoLang P=NP Solver Exports\n');
  
  const typeDefsOk = checkTypeDefinitions();
  const exportsOk = await testPnpExports();
  
  if (typeDefsOk && exportsOk) {
    console.log('\n✅ ALL TESTS PASSED - P=NP solver exports are ready for VS Code extension integration!');
    process.exit(0);
  } else {
    console.log('\n❌ SOME TESTS FAILED - Please check the export configuration');
    process.exit(1);
  }
}

main().catch(console.error);