#!/usr/bin/env node

import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import loader from '@assemblyscript/loader';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function runTests() {
  try {
    // Default to the test wasm file if no argument provided
    const wasmPath = process.argv[2] || join(__dirname, '..', 'build', 'test-core.wasm');
    
    console.log(`Loading test module from: ${wasmPath}`);
    
    // Read the wasm file
    const wasmBuffer = await readFile(wasmPath);
    
    // Store reference to module for console functions
    let wasmExports = null;
    
    // Create imports for the AssemblyScript module
    const imports = {
      env: {
        abort: (messagePtr, fileNamePtr, line, column) => {
          const message = wasmExports ? wasmExports.__getString(messagePtr) : 'Unknown error';
          const fileName = wasmExports ? wasmExports.__getString(fileNamePtr) : 'Unknown file';
          console.error(`Abort called: ${message} at ${fileName}:${line}:${column}`);
          process.exit(1);
        },
        trace: (message, n, ...args) => {
          console.log(`Trace: ${message}`, ...args);
        },
        seed: () => {
          return Date.now();
        },
        "Date.now": () => {
          return Date.now();
        },
        "console.log": (msgPtr) => {
          if (wasmExports) {
            const msg = wasmExports.__getString(msgPtr);
            console.log(msg);
          }
        },
        "console.error": (msgPtr) => {
          if (wasmExports) {
            const msg = wasmExports.__getString(msgPtr);
            console.error(msg);
          }
        },
        "console.warn": (msgPtr) => {
          if (wasmExports) {
            const msg = wasmExports.__getString(msgPtr);
            console.warn(msg);
          }
        }
      }
    };
    
    // Instantiate the module
    const module = await loader.instantiate(wasmBuffer, imports);
    wasmExports = module.exports;
    
    // Run the tests
    if (module.exports.runAllTests) {
      console.log('Running all tests...\n');
      try {
        module.exports.runAllTests();
        console.log('\nTests completed successfully!');
      } catch (error) {
        console.error('\nTest execution failed:', error);
        process.exit(1);
      }
    } else if (module.exports.default) {
      console.log('Running default export...\n');
      try {
        module.exports.default();
        console.log('\nTests completed successfully!');
      } catch (error) {
        console.error('\nTest execution failed:', error);
        process.exit(1);
      }
    } else {
      console.error('No runAllTests or default export found in the test module');
      process.exit(1);
    }
    
  } catch (error) {
    console.error('Error running tests:', error);
    process.exit(1);
  }
}

// Run the tests
runTests().catch(error => {
  console.error('Unhandled error:', error);
  process.exit(1);
});