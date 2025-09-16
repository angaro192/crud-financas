// Test setup file
import { beforeAll, afterAll } from '@jest/globals';

beforeAll(async () => {
  // Setup any global test configuration
  console.log('Setting up UUID migration tests...');
});

afterAll(async () => {
  // Cleanup after tests
  console.log('UUID migration tests completed.');
});