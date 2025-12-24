import {
  createIdentityProcessor,
  checkPermission,
  processTransferRequest,
  recoverIdentity,
  createAuditEntry,
  verifyAuditIntegrity,
  syncWithNetwork,
} from "../build/resolang.js";
import assert from "assert";

const processor = createIdentityProcessor();
assert.ok(processor, "Processor should be created");

// Test each exported function
assert.strictEqual(typeof checkPermission, "function", "checkPermission should be a function");
assert.strictEqual(typeof processTransferRequest, "function", "processTransferRequest should be a function");
assert.strictEqual(typeof recoverIdentity, "function", "recoverIdentity should be a function");
assert.strictEqual(typeof createAuditEntry, "function", "createAuditEntry should be a function");
assert.strictEqual(typeof verifyAuditIntegrity, "function", "verifyAuditIntegrity should be a function");
assert.strictEqual(typeof syncWithNetwork, "function", "syncWithNetwork should be a function");

console.log("All IdentityResoLangProcessor methods exported successfully!");