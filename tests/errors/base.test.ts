import {
  KoreaPublicSDKError,
  ErrorCodes,
  getErrorMessage,
  getErrorCategory,
  isCommonError,
  isPlatformError,
} from "../../src/errors/base";

// Create a concrete implementation for testing abstract class
class TestError extends KoreaPublicSDKError {
  constructor(message: string, code: ErrorCodes) {
    super(message, code);
  }
}

describe("KoreaPublicSDKError", () => {
  describe("constructor", () => {
    it("should create error with correct properties", () => {
      const message = "Test error message";
      const code = ErrorCodes.VALIDATION_ERROR;
      const error = new TestError(message, code);

      expect(error.message).toBe(message);
      expect(error.code).toBe(code);
      expect(error.name).toBe("TestError");
      expect(error.timestamp).toBeInstanceOf(Date);
    });

    it("should set timestamp to current time", () => {
      const beforeCreation = new Date();
      const error = new TestError("test", ErrorCodes.API_ERROR);
      const afterCreation = new Date();

      expect(error.timestamp.getTime()).toBeGreaterThanOrEqual(
        beforeCreation.getTime()
      );
      expect(error.timestamp.getTime()).toBeLessThanOrEqual(
        afterCreation.getTime()
      );
    });

    it("should inherit from Error class", () => {
      const error = new TestError("test", ErrorCodes.NETWORK_ERROR);

      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(KoreaPublicSDKError);
    });

    it("should capture stack trace when available", () => {
      const error = new TestError("test", ErrorCodes.CONFIGURATION_ERROR);

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
      const code = ErrorCodes.ELEVATOR_NOT_FOUND;
      const error = new TestError(message, code);

      const json = error.toJSON();

      expect(json).toEqual({
        name: "TestError",
        message: message,
        code: code,
        category: getErrorCategory(code),
        codeMessage: getErrorMessage(code),
        timestamp: error.timestamp.toISOString(),
        stack: error.stack,
      });
    });

    it("should include all required properties in JSON", () => {
      const error = new TestError("test", ErrorCodes.RATE_LIMIT_EXCEEDED);
      const json = error.toJSON();

      expect(json).toHaveProperty("name");
      expect(json).toHaveProperty("message");
      expect(json).toHaveProperty("code");
      expect(json).toHaveProperty("category");
      expect(json).toHaveProperty("codeMessage");
      expect(json).toHaveProperty("timestamp");
      expect(json).toHaveProperty("stack");
    });

    it("should serialize timestamp as ISO string", () => {
      const error = new TestError("test", ErrorCodes.SERVICE_UNAVAILABLE);
      const json = error.toJSON();

      expect(typeof json.timestamp).toBe("string");
      expect(() => new Date(json.timestamp)).not.toThrow();
      expect(new Date(json.timestamp)).toEqual(error.timestamp);
    });

    it("should be serializable to JSON string", () => {
      const error = new TestError(
        "test error",
        ErrorCodes.KOELSA_SERVICE_ERROR
      );

      expect(() => JSON.stringify(error)).not.toThrow();

      const jsonString = JSON.stringify(error);
      const parsed = JSON.parse(jsonString);

      expect(parsed).toHaveProperty("name", "TestError");
      expect(parsed).toHaveProperty("message", "test error");
      expect(parsed).toHaveProperty("code", ErrorCodes.KOELSA_SERVICE_ERROR);
      expect(parsed).toHaveProperty("category", "KOELSA Error");
    });
  });

  describe("inheritance behavior", () => {
    it("should work correctly with instanceof checks", () => {
      const error = new TestError("test", ErrorCodes.INVALID_PARAMETER);

      expect(error instanceof TestError).toBe(true);
      expect(error instanceof KoreaPublicSDKError).toBe(true);
      expect(error instanceof Error).toBe(true);
    });

    it("should maintain proper prototype chain", () => {
      const error = new TestError("test", ErrorCodes.INVALID_PARAMETER);

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
      const error = new TestError("test", ErrorCodes.INVALID_DATE_FORMAT);

      expect(error.code).toBe(ErrorCodes.INVALID_DATE_FORMAT);
      expect(typeof error.code).toBe("number");
    });

    it("should have timestamp property with correct type", () => {
      const error = new TestError("test", ErrorCodes.DNS_RESOLUTION_FAILED);

      expect(error.timestamp).toBeInstanceOf(Date);
      expect(error.timestamp instanceof Date).toBe(true);
    });
  });

  describe("edge cases", () => {
    it("should handle empty message", () => {
      const error = new TestError("", ErrorCodes.SSL_ERROR);

      expect(error.message).toBe("");
      expect(error.toJSON().message).toBe("");
    });

    it("should handle special characters in message", () => {
      const message = 'Test with 한글, émojis 🎉, and "quotes"';
      const error = new TestError(message, ErrorCodes.WEATHER_DATA_NOT_FOUND);

      expect(error.message).toBe(message);
      expect(error.code).toBe(ErrorCodes.WEATHER_DATA_NOT_FOUND);

      const json = error.toJSON();
      expect(json.message).toBe(message);
      expect(json.code).toBe(ErrorCodes.WEATHER_DATA_NOT_FOUND);
    });
  });
});

describe("ErrorCodes enum", () => {
  it("should have correct common error codes in 1xx range", () => {
    expect(ErrorCodes.UNKNOWN_ERROR).toBe(100);
    expect(ErrorCodes.VALIDATION_ERROR).toBe(101);
    expect(ErrorCodes.INVALID_PARAMETER).toBe(102);
    expect(ErrorCodes.API_ERROR).toBe(121);
    expect(ErrorCodes.NETWORK_ERROR).toBe(141);
    expect(ErrorCodes.CONFIGURATION_ERROR).toBe(161);
    expect(ErrorCodes.SERVICE_UNAVAILABLE).toBe(181);
    expect(ErrorCodes.RATE_LIMIT_EXCEEDED).toBe(191);
  });

  it("should have correct KOELSA error codes in 2xx range", () => {
    expect(ErrorCodes.KOELSA_SERVICE_ERROR).toBe(200);
    expect(ErrorCodes.ELEVATOR_NOT_FOUND).toBe(201);
    expect(ErrorCodes.INVALID_ELEVATOR_NUMBER).toBe(202);
    expect(ErrorCodes.INVALID_INSPECTION_DATA).toBe(203);
  });

  it("should have correct KMA error codes in 3xx range", () => {
    expect(ErrorCodes.KMA_SERVICE_ERROR).toBe(300);
    expect(ErrorCodes.WEATHER_DATA_NOT_FOUND).toBe(301);
    expect(ErrorCodes.INVALID_LOCATION_CODE).toBe(302);
  });

  it("should have correct KOTSA error codes in 4xx range", () => {
    expect(ErrorCodes.KOTSA_SERVICE_ERROR).toBe(400);
    expect(ErrorCodes.VEHICLE_NOT_FOUND).toBe(401);
    expect(ErrorCodes.INVALID_VEHICLE_NUMBER).toBe(402);
  });
});

describe("getErrorMessage function", () => {
  it("should return correct messages for common errors", () => {
    expect(getErrorMessage(ErrorCodes.VALIDATION_ERROR)).toBe(
      "Validation failed"
    );
    expect(getErrorMessage(ErrorCodes.API_ERROR)).toBe("API request failed");
    expect(getErrorMessage(ErrorCodes.NETWORK_ERROR)).toBe(
      "Network connection failed"
    );
    expect(getErrorMessage(ErrorCodes.RATE_LIMIT_EXCEEDED)).toBe(
      "Rate limit exceeded"
    );
  });

  it("should return correct messages for KOELSA errors", () => {
    expect(getErrorMessage(ErrorCodes.ELEVATOR_NOT_FOUND)).toBe(
      "Elevator not found"
    );
    expect(getErrorMessage(ErrorCodes.INVALID_ELEVATOR_NUMBER)).toBe(
      "Invalid elevator number format"
    );
    expect(getErrorMessage(ErrorCodes.KOELSA_SERVICE_ERROR)).toBe(
      "KOELSA service error"
    );
  });

  it("should return correct messages for future platform errors", () => {
    expect(getErrorMessage(ErrorCodes.WEATHER_DATA_NOT_FOUND)).toBe(
      "Weather data not found"
    );
    expect(getErrorMessage(ErrorCodes.VEHICLE_NOT_FOUND)).toBe(
      "Vehicle not found"
    );
  });

  it("should return default message for unknown codes", () => {
    // TypeScript will prevent this, but testing runtime behavior
    expect(getErrorMessage(999 as ErrorCodes)).toBe("Unknown error");
  });
});

describe("getErrorCategory function", () => {
  it("should return correct category for common errors", () => {
    expect(getErrorCategory(ErrorCodes.VALIDATION_ERROR)).toBe("Common Error");
    expect(getErrorCategory(ErrorCodes.API_ERROR)).toBe("Common Error");
    expect(getErrorCategory(ErrorCodes.RATE_LIMIT_EXCEEDED)).toBe(
      "Common Error"
    );
  });

  it("should return correct category for platform-specific errors", () => {
    expect(getErrorCategory(ErrorCodes.ELEVATOR_NOT_FOUND)).toBe(
      "KOELSA Error"
    );
    expect(getErrorCategory(ErrorCodes.WEATHER_DATA_NOT_FOUND)).toBe(
      "KMA Error"
    );
    expect(getErrorCategory(ErrorCodes.VEHICLE_NOT_FOUND)).toBe("KOTSA Error");
  });

  it("should return unknown category for invalid codes", () => {
    expect(getErrorCategory(999 as ErrorCodes)).toBe("Unknown Category");
    expect(getErrorCategory(50 as ErrorCodes)).toBe("Unknown Category");
  });
});

describe("isCommonError function", () => {
  it("should return true for common error codes (1xx)", () => {
    expect(isCommonError(ErrorCodes.VALIDATION_ERROR)).toBe(true);
    expect(isCommonError(ErrorCodes.API_ERROR)).toBe(true);
    expect(isCommonError(ErrorCodes.NETWORK_ERROR)).toBe(true);
    expect(isCommonError(ErrorCodes.RATE_LIMIT_EXCEEDED)).toBe(true);
    expect(isCommonError(ErrorCodes.UNKNOWN_ERROR)).toBe(true);
  });

  it("should return false for platform-specific error codes", () => {
    expect(isCommonError(ErrorCodes.ELEVATOR_NOT_FOUND)).toBe(false);
    expect(isCommonError(ErrorCodes.WEATHER_DATA_NOT_FOUND)).toBe(false);
    expect(isCommonError(ErrorCodes.VEHICLE_NOT_FOUND)).toBe(false);
  });
});

describe("isPlatformError function", () => {
  it("should return true for platform-specific error codes (2xx-4xx)", () => {
    expect(isPlatformError(ErrorCodes.ELEVATOR_NOT_FOUND)).toBe(true);
    expect(isPlatformError(ErrorCodes.KOELSA_SERVICE_ERROR)).toBe(true);
    expect(isPlatformError(ErrorCodes.WEATHER_DATA_NOT_FOUND)).toBe(true);
    expect(isPlatformError(ErrorCodes.VEHICLE_NOT_FOUND)).toBe(true);
  });

  it("should return false for common error codes (1xx)", () => {
    expect(isPlatformError(ErrorCodes.VALIDATION_ERROR)).toBe(false);
    expect(isPlatformError(ErrorCodes.API_ERROR)).toBe(false);
    expect(isPlatformError(ErrorCodes.NETWORK_ERROR)).toBe(false);
    expect(isPlatformError(ErrorCodes.RATE_LIMIT_EXCEEDED)).toBe(false);
  });

  it("should return false for codes outside platform range", () => {
    expect(isPlatformError(500 as ErrorCodes)).toBe(false);
    expect(isPlatformError(50 as ErrorCodes)).toBe(false);
  });
});
