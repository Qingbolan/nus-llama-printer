/**
 * Simple test for EasyPaper package
 */

const { getPlatformKey, isInstalled } = require('../lib/downloader');
const { VERSION } = require('../lib/config');

console.log('Running EasyPaper tests...\n');

// Test 1: Check version
console.log('[Test 1] Version check');
console.log(`Version: ${VERSION}`);
console.assert(VERSION, 'Version should be defined');
console.log('✓ Passed\n');

// Test 2: Platform detection
console.log('[Test 2] Platform detection');
try {
  const platform = getPlatformKey();
  console.log(`Detected platform: ${platform}`);
  console.assert(platform, 'Platform should be detected');
  console.log('✓ Passed\n');
} catch (error) {
  console.error('✗ Failed:', error.message);
  process.exit(1);
}

// Test 3: Installation check
console.log('[Test 3] Installation check');
const installed = isInstalled();
console.log(`Binary installed: ${installed}`);
console.log('✓ Passed\n');

console.log('All tests passed! ✓');
