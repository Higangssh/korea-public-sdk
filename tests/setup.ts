// Jest setup file

// Extend Jest matchers
import "jest";

// Mock console methods in tests to reduce noise
const originalConsoleWarn = console.warn;
const originalConsoleError = console.error;

beforeEach(() => {
  console.warn = jest.fn();
  console.error = jest.fn();
});

afterEach(() => {
  console.warn = originalConsoleWarn;
  console.error = originalConsoleError;
  jest.clearAllMocks();
});

// Global test configuration
jest.setTimeout(10000);
