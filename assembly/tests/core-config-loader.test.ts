// assembly/tests/core-config-loader.test.ts

import {
  SystemConfig,
  ModuleConfig,
  ProfileConfig,
  JSONConfigParser,
} from "../core/config-loader";

export function testJSONConfigParser(): void {
  const json = `{
    "global": {
      "setting1": "value1"
    },
    "modules": [
      {
        "type": "test-module",
        "id": "test-module-1",
        "enabled": true,
        "priority": 10,
        "config": {
          "param1": "value1"
        },
        "dependencies": []
      }
    ],
    "profiles": {
      "test-profile": {
        "name": "test-profile",
        "modules": [],
        "overrides": {}
      }
    }
  }`;

  const config = JSONConfigParser.parse(json);

  assert(config.global.has("setting1"), "The global config should have the correct setting");
  assert(config.modules.length == 1, "The config should have the correct number of modules");
  assert(config.profiles.has("test-profile"), "The config should have the correct profile");
}

export function runAllConfigLoaderTests(): void {
  console.log("Running config loader tests...");

  testJSONConfigParser();
  console.log("✓ JSONConfigParser test passed");

  console.log("\nAll config loader tests passed! ✨");
}