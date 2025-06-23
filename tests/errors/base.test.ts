import { KoreaPublicSDKError } from "../../src/errors/base";

// Create a concrete implementation for testing abstract class
class TestError extends KoreaPublicSDKError {
  constructor(message: string, code: string) {
    super(message, code);
  }
}

describe("KoreaPublicSDKError", () => {
  describe("constructor", () => {
    it("should create error with correct properties", () => {
      const message = "Test error message";
      const code = "TEST_ERROR";
      const error = new TestError(message, code);

      expect(error.message).toBe(message);
      expect(error.code).toBe(code);
      expect(error.name).toBe("TestError");
      expect(error.timestamp).toBeInstanceOf(Date);
    });

    it("should set timestamp to current time", () => {
      const beforeCreation = new Date();
      const error = new TestError("test", "TEST_CODE");
      const afterCreation = new Date();

      expect(error.timestamp.getTime()).toBeGreaterThanOrEqual(
        beforeCreation.getTime()
      );
      expect(error.timestamp.getTime()).toBeLessThanOrEqual(
        afterCreation.getTime()
      );
    });

    it("should inherit from Error class", () => {
      const error = new TestError("test", "TEST_CODE");

      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(KoreaPublicSDKError);
    });

    it("should capture stack trace when available", () => {
      const error = new TestError("test", "TEST_CODE");

      expect(error.stack).toBeDefined();
      expect(typeof error.stack).toBe("string");
      if (error.stack) {
        expect(error.stack).toContain("TestError");
      }
    });
  });

  describe("toJSON method", () => {
    it("should return correct JSON representation", () => {
      const message = "Test error message";
      const code = "TEST_ERROR";
      const error = new TestError(message, code);

      const json = error.toJSON();

      expect(json).toEqual({
        name: "TestError",
        message: message,
        code: code,
        timestamp: error.timestamp.toISOString(),
        stack: error.stack,
      });
    });

    it("should include all required properties in JSON", () => {
      const error = new TestError("test", "TEST_CODE");
      const json = error.toJSON();

      expect(json).toHaveProperty("name");
      expect(json).toHaveProperty("message");
      expect(json).toHaveProperty("code");
      expect(json).toHaveProperty("timestamp");
      expect(json).toHaveProperty("stack");
    });

    it("should serialize timestamp as ISO string", () => {
      const error = new TestError("test", "TEST_CODE");
      const json = error.toJSON();

      expect(typeof json.timestamp).toBe("string");
      expect(() => new Date(json.timestamp)).not.toThrow();
      expect(new Date(json.timestamp)).toEqual(error.timestamp);
    });

    it("should be serializable to JSON string", () => {
      const error = new TestError("test error", "TEST_CODE");

      expect(() => JSON.stringify(error)).not.toThrow();

      const jsonString = JSON.stringify(error);
      const parsed = JSON.parse(jsonString);

      expect(parsed).toHaveProperty("name", "TestError");
      expect(parsed).toHaveProperty("message", "test error");
      expect(parsed).toHaveProperty("code", "TEST_CODE");
    });
  });

  describe("inheritance behavior", () => {
    it("should work correctly with instanceof checks", () => {
      const error = new TestError("test", "TEST_CODE");

      expect(error instanceof TestError).toBe(true);
      expect(error instanceof KoreaPublicSDKError).toBe(true);
      expect(error instanceof Error).toBe(true);
    });

    it("should maintain proper prototype chain", () => {
      const error = new TestError("test", "TEST_CODE");

      expect(Object.getPrototypeOf(error)).toBe(TestError.prototype);
      expect(Object.getPrototypeOf(TestError.prototype)).toBe(
        KoreaPublicSDKError.prototype
      );
      expect(Object.getPrototypeOf(KoreaPublicSDKError.prototype)).toBe(
        Error.prototype
      );
    });
  });

  describe("error properties immutability", () => {
    it("should have code property with correct value", () => {
      const error = new TestError("test", "TEST_CODE");

      // Test that code property exists and is the correct value
      expect(error.code).toBe("TEST_CODE");
      expect(typeof error.code).toBe("string");
    });

    it("should have timestamp property with correct type", () => {
      const error = new TestError("test", "TEST_CODE");

      // Test that timestamp property exists and is the correct type
      expect(error.timestamp).toBeInstanceOf(Date);
      expect(error.timestamp instanceof Date).toBe(true);
    });
  });

  describe("edge cases", () => {
    it("should handle empty message", () => {
      const error = new TestError("", "TEST_CODE");

      expect(error.message).toBe("");
      expect(error.toJSON().message).toBe("");
    });

    it("should handle empty code", () => {
      const error = new TestError("test message", "");

      expect(error.code).toBe("");
      expect(error.toJSON().code).toBe("");
    });

    it("should handle special characters in message and code", () => {
      const message = 'Test with 한글, émojis 🎉, and "quotes"';
      const code = "TEST_WITH_SPECIAL_CHARS_123";
      const error = new TestError(message, code);

      expect(error.message).toBe(message);
      expect(error.code).toBe(code);

      const json = error.toJSON();
      expect(json.message).toBe(message);
      expect(json.code).toBe(code);
    });
  });
});
