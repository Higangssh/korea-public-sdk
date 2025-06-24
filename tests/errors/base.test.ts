import {
  KoreaPublicSDKError,
  ErrorCodes,
  getErrorMessage,
  getErrorCategory,
  isCommonError,
  isPlatformError,
} from "../../src/errors/base";

// Test error class for testing base functionality
class TestError extends KoreaPublicSDKError {
  constructor(message: string, code: ErrorCodes) {
    super(message, code);
  }
}

describe("KoreaPublicSDKError", () => {
  describe("constructor", () => {
    it("should create error with message and code", () => {
      const message = "Test error message";
      const code = ErrorCodes.VALIDATION_ERROR;
      const error = new TestError(message, code);

      expect(error.message).toBe(message);
      expect(error.code).toBe(code);
      expect(error.name).toBe("TestError");
      expect(error.timestamp).toBeInstanceOf(Date);
    });

    it("should maintain proper stack trace", () => {
      const error = new TestError("Stack trace test", ErrorCodes.API_ERROR);
      expect(error.stack).toBeDefined();
      expect(error.stack).toContain("TestError");
    });
  });

  describe("toJSON", () => {
    it("should return complete error information", () => {
      const message = "JSON serialization test";
      const code = ErrorCodes.NETWORK_ERROR;
      const error = new TestError(message, code);

      const json = error.toJSON();

      expect(json.name).toBe("TestError");
      expect(json.message).toBe(message);
      expect(json.code).toBe(code);
      expect(json.category).toBe(getErrorCategory(code));
      expect(json.codeMessage).toBe(getErrorMessage(code));
      expect(json.timestamp).toBeDefined();
      expect(json.stack).toBeDefined();
    });

    it("should serialize timestamp as ISO string", () => {
      const error = new TestError(
        "Timestamp test",
        ErrorCodes.CONFIGURATION_ERROR
      );
      const json = error.toJSON();

      expect(typeof json.timestamp).toBe("string");
      expect(new Date(json.timestamp).toISOString()).toBe(json.timestamp);
    });
  });
});

describe("ErrorCodes", () => {
  describe("enum values", () => {
    it("should have correct common error codes (1xx)", () => {
      expect(ErrorCodes.UNKNOWN_ERROR).toBe(100);

      // Validation errors (101-120)
      expect(ErrorCodes.VALIDATION_ERROR).toBe(101);
      expect(ErrorCodes.INVALID_PARAMETER).toBe(102);
      expect(ErrorCodes.MISSING_REQUIRED_FIELD).toBe(103);
      expect(ErrorCodes.INVALID_DATE_FORMAT).toBe(104);
      expect(ErrorCodes.INVALID_PAGE_NUMBER).toBe(105);
      expect(ErrorCodes.INVALID_SERVICE_KEY).toBe(106);

      // API errors (121-140)
      expect(ErrorCodes.API_ERROR).toBe(121);
      expect(ErrorCodes.API_REQUEST_FAILED).toBe(122);
      expect(ErrorCodes.API_RESPONSE_ERROR).toBe(123);
      expect(ErrorCodes.INVALID_API_RESPONSE).toBe(124);
      expect(ErrorCodes.API_TIMEOUT).toBe(125);

      // Network errors (141-160)
      expect(ErrorCodes.NETWORK_ERROR).toBe(141);
      expect(ErrorCodes.CONNECTION_FAILED).toBe(142);
      expect(ErrorCodes.DNS_RESOLUTION_FAILED).toBe(143);
      expect(ErrorCodes.SSL_ERROR).toBe(144);

      // Configuration errors (161-180)
      expect(ErrorCodes.CONFIGURATION_ERROR).toBe(161);
      expect(ErrorCodes.INVALID_BASE_URL).toBe(162);
      expect(ErrorCodes.INVALID_TIMEOUT).toBe(163);
      expect(ErrorCodes.MISSING_CONFIGURATION).toBe(164);

      // Service availability errors (181-190)
      expect(ErrorCodes.SERVICE_UNAVAILABLE).toBe(181);
      expect(ErrorCodes.SERVICE_MAINTENANCE).toBe(182);
      expect(ErrorCodes.SERVICE_DEPRECATED).toBe(183);

      // Rate limiting errors (191-199)
      expect(ErrorCodes.RATE_LIMIT_EXCEEDED).toBe(191);
      expect(ErrorCodes.QUOTA_EXCEEDED).toBe(192);
      expect(ErrorCodes.DAILY_LIMIT_EXCEEDED).toBe(193);
    });

    it("should have correct KOELSA error codes (2xx)", () => {
      expect(ErrorCodes.KOELSA_SERVICE_ERROR).toBe(200);
      expect(ErrorCodes.ELEVATOR_NOT_FOUND).toBe(201);
      expect(ErrorCodes.INVALID_ELEVATOR_NUMBER).toBe(202);
      expect(ErrorCodes.INVALID_INSPECTION_DATA).toBe(203);
      expect(ErrorCodes.INVALID_MANAGEMENT_CODE).toBe(204);
      expect(ErrorCodes.INSPECTION_DATA_NOT_AVAILABLE).toBe(205);
      expect(ErrorCodes.ELEVATOR_INSTALLATION_NOT_FOUND).toBe(206);
      expect(ErrorCodes.INVALID_ELEVATOR_TYPE).toBe(207);
      expect(ErrorCodes.MAINTENANCE_RECORD_NOT_FOUND).toBe(208);
    });
  });

  describe("error code ranges", () => {
    it("should maintain proper numeric ranges", () => {
      // Common errors should be in 1xx range
      const commonCodes = [
        ErrorCodes.UNKNOWN_ERROR,
        ErrorCodes.VALIDATION_ERROR,
        ErrorCodes.API_ERROR,
        ErrorCodes.NETWORK_ERROR,
        ErrorCodes.CONFIGURATION_ERROR,
        ErrorCodes.SERVICE_UNAVAILABLE,
        ErrorCodes.RATE_LIMIT_EXCEEDED,
      ];

      commonCodes.forEach((code) => {
        expect(code).toBeGreaterThanOrEqual(100);
        expect(code).toBeLessThan(200);
      });

      // KOELSA errors should be in 2xx range
      const koelsaCodes = [
        ErrorCodes.KOELSA_SERVICE_ERROR,
        ErrorCodes.ELEVATOR_NOT_FOUND,
        ErrorCodes.INVALID_ELEVATOR_NUMBER,
      ];

      koelsaCodes.forEach((code) => {
        expect(code).toBeGreaterThanOrEqual(200);
        expect(code).toBeLessThan(300);
      });
    });
  });

  describe("consistency check", () => {
    it("should have unique error codes", () => {
      const codes = Object.values(ErrorCodes).filter(
        (value) => typeof value === "number"
      ) as number[];

      const uniqueCodes = [...new Set(codes)];
      expect(codes.length).toBe(uniqueCodes.length);
    });
  });

  describe("error instantiation", () => {
    it("should create error with platform error code", () => {
      const message = "Platform error test";
      const error = new TestError(message, ErrorCodes.ELEVATOR_NOT_FOUND);

      expect(error.message).toBe(message);
      expect(error.code).toBe(ErrorCodes.ELEVATOR_NOT_FOUND);

      const json = error.toJSON();
      expect(json.code).toBe(ErrorCodes.ELEVATOR_NOT_FOUND);
      expect(json.category).toBe("KOELSA Error");
    });
  });
});

describe("getErrorMessage", () => {
  it("should return correct messages for common errors", () => {
    expect(getErrorMessage(ErrorCodes.UNKNOWN_ERROR)).toBe(
      "Unknown error occurred"
    );
    expect(getErrorMessage(ErrorCodes.VALIDATION_ERROR)).toBe(
      "Validation failed"
    );
    expect(getErrorMessage(ErrorCodes.API_ERROR)).toBe("API request failed");
    expect(getErrorMessage(ErrorCodes.NETWORK_ERROR)).toBe(
      "Network connection failed"
    );
    expect(getErrorMessage(ErrorCodes.CONFIGURATION_ERROR)).toBe(
      "Configuration error"
    );
    expect(getErrorMessage(ErrorCodes.SERVICE_UNAVAILABLE)).toBe(
      "Service is currently unavailable"
    );
    expect(getErrorMessage(ErrorCodes.RATE_LIMIT_EXCEEDED)).toBe(
      "Rate limit exceeded"
    );
  });

  it("should return correct messages for KOELSA errors", () => {
    expect(getErrorMessage(ErrorCodes.KOELSA_SERVICE_ERROR)).toBe(
      "KOELSA service error"
    );
    expect(getErrorMessage(ErrorCodes.ELEVATOR_NOT_FOUND)).toBe(
      "Elevator not found"
    );
    expect(getErrorMessage(ErrorCodes.INVALID_ELEVATOR_NUMBER)).toBe(
      "Invalid elevator number format"
    );
  });

  it("should return 'Unknown error' for invalid codes", () => {
    expect(getErrorMessage(999 as ErrorCodes)).toBe("Unknown error");
    expect(getErrorMessage(-1 as ErrorCodes)).toBe("Unknown error");
  });
});

describe("getErrorCategory", () => {
  it("should return correct categories for error codes", () => {
    expect(getErrorCategory(ErrorCodes.VALIDATION_ERROR)).toBe("Common Error");
    expect(getErrorCategory(ErrorCodes.API_ERROR)).toBe("Common Error");
    expect(getErrorCategory(ErrorCodes.NETWORK_ERROR)).toBe("Common Error");

    expect(getErrorCategory(ErrorCodes.KOELSA_SERVICE_ERROR)).toBe(
      "KOELSA Error"
    );
    expect(getErrorCategory(ErrorCodes.ELEVATOR_NOT_FOUND)).toBe(
      "KOELSA Error"
    );
  });

  it("should return 'Future Agency Error' for unimplemented ranges", () => {
    expect(getErrorCategory(300 as ErrorCodes)).toBe("Future Agency Error");
    expect(getErrorCategory(400 as ErrorCodes)).toBe("Future Agency Error");
    expect(getErrorCategory(500 as ErrorCodes)).toBe("Future Agency Error");
  });
});

describe("isCommonError", () => {
  it("should correctly identify common errors", () => {
    expect(isCommonError(ErrorCodes.VALIDATION_ERROR)).toBe(true);
    expect(isCommonError(ErrorCodes.API_ERROR)).toBe(true);
    expect(isCommonError(ErrorCodes.NETWORK_ERROR)).toBe(true);
    expect(isCommonError(ErrorCodes.CONFIGURATION_ERROR)).toBe(true);
    expect(isCommonError(ErrorCodes.SERVICE_UNAVAILABLE)).toBe(true);
    expect(isCommonError(ErrorCodes.RATE_LIMIT_EXCEEDED)).toBe(true);
  });

  it("should correctly identify non-common errors", () => {
    expect(isCommonError(ErrorCodes.KOELSA_SERVICE_ERROR)).toBe(false);
    expect(isCommonError(ErrorCodes.ELEVATOR_NOT_FOUND)).toBe(false);
  });
});

describe("isPlatformError", () => {
  it("should correctly identify platform errors", () => {
    expect(isPlatformError(ErrorCodes.KOELSA_SERVICE_ERROR)).toBe(true);
    expect(isPlatformError(ErrorCodes.ELEVATOR_NOT_FOUND)).toBe(true);
    expect(isPlatformError(ErrorCodes.INVALID_ELEVATOR_NUMBER)).toBe(true);
  });

  it("should correctly identify non-platform errors", () => {
    expect(isPlatformError(ErrorCodes.VALIDATION_ERROR)).toBe(false);
    expect(isPlatformError(ErrorCodes.API_ERROR)).toBe(false);
    expect(isPlatformError(ErrorCodes.NETWORK_ERROR)).toBe(false);
  });

  it("should return false for future agency codes", () => {
    expect(isPlatformError(300 as ErrorCodes)).toBe(false);
    expect(isPlatformError(400 as ErrorCodes)).toBe(false);
  });
});

describe("error code consistency", () => {
  it("should have consistent error messages and categories", () => {
    const allCodes = Object.values(ErrorCodes).filter(
      (value) => typeof value === "number"
    ) as ErrorCodes[];

    allCodes.forEach((code) => {
      const message = getErrorMessage(code);
      const category = getErrorCategory(code);

      expect(message).toBeTruthy();
      expect(message).not.toBe("Unknown error");
      expect(category).toBeTruthy();
    });
  });

  it("should have correct range classifications", () => {
    const allCodes = Object.values(ErrorCodes).filter(
      (value) => typeof value === "number"
    ) as ErrorCodes[];

    allCodes.forEach((code) => {
      if (code >= 100 && code < 200) {
        expect(isCommonError(code)).toBe(true);
        expect(isPlatformError(code)).toBe(false);
        expect(getErrorCategory(code)).toBe("Common Error");
      } else if (code >= 200 && code < 300) {
        expect(isCommonError(code)).toBe(false);
        expect(isPlatformError(code)).toBe(true);
        expect(getErrorCategory(code)).toBe("KOELSA Error");
      }
    });
  });
});
