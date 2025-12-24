import loader from "@assemblyscript/loader";
import fs from 'fs';
import path from 'path';
import util from 'util';
import { performance } from 'perf_hooks';

async function runTests() {
  console.log('Running Identity System Export Tests...');

  const wasmBuffer = fs.readFileSync('../build/resolang.wasm');
  const imports = {
    env: {
      "Date.now": Date.now,
      "console.log": function (msg) {
        console.log(wasmModule.exports.__getString(msg));
      },
      "Math.random": Math.random,
      "performance.now": performance.now,
      "process.hrtime": process.hrtime,
      "fs.readFileSync": fs.readFileSync,
      "fs.writeFileSync": fs.writeFileSync,
      "path.resolve": path.resolve,
      "util.inspect": util.inspect,
      "trace": function(msg, n) {
        console.log(wasmModule.exports.__getString(msg) + (n ? " " + Array.prototype.slice.call(arguments, 2, 2 + n).join(", ") : ""));
      },
      "abort": function (msg, file, line, column) {
        const errorMsg = `Abort: ${wasmModule.exports.__getString(msg)} at ${wasmModule.exports.__getString(file)}:${line}:${column}`;
        console.error(errorMsg);
        process.exit(1);
      }
    },
  };

  const wasmModule = await loader.instantiate(wasmBuffer, imports);
  const wasm = wasmModule;

  // 1. Test globalResoLangProcessor existence
  if (!wasm.exports.globalResoLangProcessor) {
    console.error('Test Failed: globalResoLangProcessor is not exported.');
    return;
  }
  console.log('Test Passed: globalResoLangProcessor is exported.');

  // 2. Test quantumCheckPermission
  if (typeof wasm.exports.quantumCheckPermission !== 'function') {
    console.error('Test Failed: quantumCheckPermission is not exported or not a function.');
    return;
  }
  console.log('Test Passed: quantumCheckPermission is exported.');

  // 3. Test quantumProcessTransfer
  if (typeof wasm.exports.quantumProcessTransfer !== 'function') {
    console.error('Test Failed: quantumProcessTransfer is not exported or not a function.');
    return;
  }
  console.log('Test Passed: quantumProcessTransfer is exported.');

  // 4. Test quantumRecoverIdentity
  if (typeof wasm.exports.quantumRecoverIdentity !== 'function') {
    console.error('Test Failed: quantumRecoverIdentity is not exported or not a function.');
    return;
  }
  console.log('Test Passed: quantumRecoverIdentity is exported.');

  // 5. Test quantumCreateAuditEntry
  if (typeof wasm.exports.quantumCreateAuditEntry !== 'function') {
    console.error('Test Failed: quantumCreateAuditEntry is not exported or not a function.');
    return;
  }
  console.log('Test Passed: quantumCreateAuditEntry is exported.');

  // 6. Test quantumVerifyAuditIntegrity
  if (typeof wasm.exports.quantumVerifyAuditIntegrity !== 'function') {
    console.error('Test Failed: quantumVerifyAuditIntegrity is not exported or not a function.');
    return;
  }
  console.log('Test Passed: quantumVerifyAuditIntegrity is exported.');


  console.log('All tests completed.');
}

runTests().catch(console.error);