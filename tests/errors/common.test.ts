import {
  ValidationError,
  ApiError,
  NetworkError,
  ConfigurationError,
  ServiceUnavailableError,
  RateLimitError,
} from "../../src/errors/common";
import { KoreaPublicSDKError, ErrorCodes } from "../../src/errors/base";

describe("Common Error Classes", () => {
  describe("ValidationError", () => {
    it("should create ValidationError with correct properties", () => {
      const message = "Invalid input";
      const field = "email";
      const error = new ValidationError(message, field);

      expect(error.message).toBe(message);
      expect(error.code).toBe(ErrorCodes.VALIDATION_ERROR);
      expect(error.field).toBe(field);
      expect(error.name).toBe("ValidationError");
      expect(error).toBeInstanceOf(KoreaPublicSDKError);
    });

    it("should work without field parameter", () => {
      const message = "Validation failed";
      const error = new ValidationError(message);

      expect(error.message).toBe(message);
      expect(error.code).toBe(ErrorCodes.VALIDATION_ERROR);
      expect(error.field).toBeUndefined();
    });

    it("should allow custom error codes", () => {
      const error = new ValidationError(
        "Custom validation",
        "field",
        ErrorCodes.INVALID_PARAMETER
      );

      expect(error.code).toBe(ErrorCodes.INVALID_PARAMETER);
    });

    it("should handle undefined field parameter explicitly", () => {
      const error = new ValidationError("test", undefined);

      expect(error.field).toBeUndefined();
      expect(error).not.toHaveProperty("field"); // Should not have the property at all
    });

    it("should include field in JSON serialization when present", () => {
      const error = new ValidationError("test", "username");
      const json = error.toJSON();

      expect(json).toHaveProperty("field", "username");
      expect(json.code).toBe(ErrorCodes.VALIDATION_ERROR);
    });
  });

  describe("ApiError", () => {
    it("should create ApiError with all parameters", () => {
      const message = "API request failed";
      const statusCode = 400;
      const apiCode = "INVALID_REQUEST";
      const response = { error: "Bad Request" };

      const error = new ApiError(message, statusCode, apiCode, response);

      expect(error.message).toBe(message);
      expect(error.code).toBe(ErrorCodes.API_ERROR);
      expect(error.statusCode).toBe(statusCode);
      expect(error.apiCode).toBe(apiCode);
      expect(error.response).toEqual(response);
      expect(error).toBeInstanceOf(KoreaPublicSDKError);
    });

    it("should work with minimal parameters", () => {
      const message = "API error";
      const error = new ApiError(message);

      expect(error.message).toBe(message);
      expect(error.code).toBe(ErrorCodes.API_ERROR);
      expect(error.statusCode).toBeUndefined();
      expect(error.apiCode).toBeUndefined();
      expect(error.response).toBeUndefined();
    });

    it("should allow custom error codes", () => {
      const error = new ApiError(
        "Timeout",
        undefined,
        undefined,
        undefined,
        ErrorCodes.API_TIMEOUT
      );

      expect(error.code).toBe(ErrorCodes.API_TIMEOUT);
    });

    it("should handle undefined parameters explicitly", () => {
      const error = new ApiError("test", undefined, undefined, undefined);

      expect(error.statusCode).toBeUndefined();
      expect(error.apiCode).toBeUndefined();
      expect(error.response).toBeUndefined();
    });

    it("should include all properties in JSON when present", () => {
      const error = new ApiError("test", 500, "SERVER_ERROR", {
        details: "Internal error",
      });
      const json = error.toJSON();

      expect(json).toHaveProperty("statusCode", 500);
      expect(json).toHaveProperty("apiCode", "SERVER_ERROR");
      expect(json).toHaveProperty("response", { details: "Internal error" });
      expect(json.code).toBe(ErrorCodes.API_ERROR);
    });
  });

  describe("NetworkError", () => {
    it("should create NetworkError with original error", () => {
      const message = "Connection failed";
      const originalError = new Error("ECONNREFUSED");

      const error = new NetworkError(message, originalError);

      expect(error.message).toBe(message);
      expect(error.code).toBe(ErrorCodes.NETWORK_ERROR);
      expect(error.originalError).toBe(originalError);
      expect(error).toBeInstanceOf(KoreaPublicSDKError);
    });

    it("should work without original error", () => {
      const message = "Network timeout";
      const error = new NetworkError(message);

      expect(error.message).toBe(message);
      expect(error.code).toBe(ErrorCodes.NETWORK_ERROR);
      expect(error.originalError).toBeUndefined();
    });

    it("should allow custom error codes", () => {
      const error = new NetworkError(
        "DNS failed",
        undefined,
        ErrorCodes.DNS_RESOLUTION_FAILED
      );

      expect(error.code).toBe(ErrorCodes.DNS_RESOLUTION_FAILED);
    });

    it("should handle various types of original errors", () => {
      const axiosError = {
        name: "AxiosError",
        message: "timeout of 5000ms exceeded",
        code: "ECONNABORTED",
      };

      const error = new NetworkError("Request timeout", axiosError as Error);

      expect(error.originalError).toBe(axiosError);
    });

    it("should include original error in JSON serialization", () => {
      const originalError = new Error("Original error");
      const error = new NetworkError("Network failed", originalError);
      const json = error.toJSON();

      expect(json).toHaveProperty("originalError", originalError);
      expect(json.code).toBe(ErrorCodes.NETWORK_ERROR);
    });
  });

  describe("ConfigurationError", () => {
    it("should create ConfigurationError with config field", () => {
      const message = "Invalid configuration";
      const configField = "apiKey";

      const error = new ConfigurationError(message, configField);

      expect(error.message).toBe(message);
      expect(error.code).toBe(ErrorCodes.CONFIGURATION_ERROR);
      expect(error.configField).toBe(configField);
      expect(error).toBeInstanceOf(KoreaPublicSDKError);
    });

    it("should work without config field parameter", () => {
      const message = "Configuration error";
      const error = new ConfigurationError(message);

      expect(error.message).toBe(message);
      expect(error.code).toBe(ErrorCodes.CONFIGURATION_ERROR);
      expect(error.configField).toBeUndefined();
    });

    it("should allow custom error codes", () => {
      const error = new ConfigurationError(
        "Bad URL",
        "baseURL",
        ErrorCodes.INVALID_BASE_URL
      );

      expect(error.code).toBe(ErrorCodes.INVALID_BASE_URL);
    });

    it("should include configField in JSON when present", () => {
      const error = new ConfigurationError("Invalid baseURL", "baseURL");
      const json = error.toJSON();

      expect(json).toHaveProperty("configField", "baseURL");
      expect(json.code).toBe(ErrorCodes.CONFIGURATION_ERROR);
    });
  });

  describe("ServiceUnavailableError", () => {
    it("should create ServiceUnavailableError with service name", () => {
      const message = "Service is down";
      const serviceName = "KOELSA API";

      const error = new ServiceUnavailableError(message, serviceName);

      expect(error.message).toBe(message);
      expect(error.code).toBe(ErrorCodes.SERVICE_UNAVAILABLE);
      expect(error.serviceName).toBe(serviceName);
      expect(error).toBeInstanceOf(KoreaPublicSDKError);
    });

    it("should work without service name parameter", () => {
      const message = "Service unavailable";
      const error = new ServiceUnavailableError(message);

      expect(error.message).toBe(message);
      expect(error.code).toBe(ErrorCodes.SERVICE_UNAVAILABLE);
      expect(error.serviceName).toBeUndefined();
    });

    it("should allow custom error codes", () => {
      const error = new ServiceUnavailableError(
        "Maintenance",
        "API",
        ErrorCodes.SERVICE_MAINTENANCE
      );

      expect(error.code).toBe(ErrorCodes.SERVICE_MAINTENANCE);
    });

    it("should include serviceName in JSON when present", () => {
      const error = new ServiceUnavailableError(
        "Maintenance mode",
        "Elevator Service"
      );
      const json = error.toJSON();

      expect(json).toHaveProperty("serviceName", "Elevator Service");
      expect(json.code).toBe(ErrorCodes.SERVICE_UNAVAILABLE);
    });
  });

  describe("RateLimitError", () => {
    it("should create RateLimitError with retry after value", () => {
      const message = "Rate limit exceeded";
      const retryAfter = 60;

      const error = new RateLimitError(message, retryAfter);

      expect(error.message).toBe(message);
      expect(error.code).toBe(ErrorCodes.RATE_LIMIT_EXCEEDED);
      expect(error.retryAfter).toBe(retryAfter);
      expect(error).toBeInstanceOf(KoreaPublicSDKError);
    });

    it("should work without retry after parameter", () => {
      const message = "Too many requests";
      const error = new RateLimitError(message);

      expect(error.message).toBe(message);
      expect(error.code).toBe(ErrorCodes.RATE_LIMIT_EXCEEDED);
      expect(error.retryAfter).toBeUndefined();
    });

    it("should allow custom error codes", () => {
      const error = new RateLimitError(
        "Daily limit",
        undefined,
        ErrorCodes.DAILY_LIMIT_EXCEEDED
      );

      expect(error.code).toBe(ErrorCodes.DAILY_LIMIT_EXCEEDED);
    });

    it("should handle zero retry after value", () => {
      const error = new RateLimitError("Rate limited", 0);

      expect(error.retryAfter).toBe(0);
    });

    it("should include retryAfter in JSON when present", () => {
      const error = new RateLimitError("Rate limited", 120);
      const json = error.toJSON();

      expect(json).toHaveProperty("retryAfter", 120);
      expect(json.code).toBe(ErrorCodes.RATE_LIMIT_EXCEEDED);
    });
  });

  describe("common error behavior", () => {
    const errorClasses = [
      {
        Class: ValidationError,
        code: ErrorCodes.VALIDATION_ERROR,
        extraParam: "field",
      },
      { Class: ApiError, code: ErrorCodes.API_ERROR, extraParam: "statusCode" },
      {
        Class: NetworkError,
        code: ErrorCodes.NETWORK_ERROR,
        extraParam: "originalError",
      },
      {
        Class: ConfigurationError,
        code: ErrorCodes.CONFIGURATION_ERROR,
        extraParam: "configField",
      },
      {
        Class: ServiceUnavailableError,
        code: ErrorCodes.SERVICE_UNAVAILABLE,
        extraParam: "serviceName",
      },
      {
        Class: RateLimitError,
        code: ErrorCodes.RATE_LIMIT_EXCEEDED,
        extraParam: "retryAfter",
      },
    ];

    errorClasses.forEach(({ Class, code }) => {
      it(`${Class.name} should inherit from KoreaPublicSDKError`, () => {
        const error = new Class("test message");

        expect(error).toBeInstanceOf(KoreaPublicSDKError);
        expect(error).toBeInstanceOf(Error);
        expect(error.code).toBe(code);
        expect(error.timestamp).toBeInstanceOf(Date);
      });

      it(`${Class.name} should have correct name property`, () => {
        const error = new Class("test message");

        expect(error.name).toBe(Class.name);
      });

      it(`${Class.name} should be JSON serializable`, () => {
        const error = new Class("test message");

        expect(() => JSON.stringify(error)).not.toThrow();

        const json = error.toJSON();
        expect(json).toHaveProperty("name", Class.name);
        expect(json).toHaveProperty("message", "test message");
        expect(json).toHaveProperty("code", code);
        expect(json).toHaveProperty("timestamp");
        expect(json).toHaveProperty("category");
        expect(json).toHaveProperty("codeMessage");
      });
    });
  });

  describe("error chaining and debugging", () => {
    it("should maintain stack trace information", () => {
      function throwValidationError() {
        throw new ValidationError("Validation failed", "testField");
      }

      function throwApiError() {
        try {
          throwValidationError();
        } catch (error) {
          throw new ApiError("API call failed", 400, "VALIDATION_ERROR", error);
        }
      }

      try {
        throwApiError();
      } catch (error) {
        expect(error).toBeInstanceOf(ApiError);
        if (error instanceof ApiError) {
          expect(error.stack).toContain("throwApiError");
          expect(error.response).toBeInstanceOf(ValidationError);
        }
      }
    });

    it("should work with error instanceof checks in catch blocks", () => {
      const errors = [
        new ValidationError("validation"),
        new ApiError("api"),
        new NetworkError("network"),
        new ConfigurationError("config"),
        new ServiceUnavailableError("service"),
        new RateLimitError("rate"),
      ];

      errors.forEach((error) => {
        if (error instanceof ValidationError) {
          expect(error.code).toBe(ErrorCodes.VALIDATION_ERROR);
        } else if (error instanceof ApiError) {
          expect(error.code).toBe(ErrorCodes.API_ERROR);
        } else if (error instanceof NetworkError) {
          expect(error.code).toBe(ErrorCodes.NETWORK_ERROR);
        } else if (error instanceof ConfigurationError) {
          expect(error.code).toBe(ErrorCodes.CONFIGURATION_ERROR);
        } else if (error instanceof ServiceUnavailableError) {
          expect(error.code).toBe(ErrorCodes.SERVICE_UNAVAILABLE);
        } else if (error instanceof RateLimitError) {
          expect(error.code).toBe(ErrorCodes.RATE_LIMIT_EXCEEDED);
        }
      });
    });
  });

  describe("error code consistency", () => {
    it("should use correct numerical error codes", () => {
      expect(new ValidationError("test").code).toBe(101);
      expect(new ApiError("test").code).toBe(121);
      expect(new NetworkError("test").code).toBe(141);
      expect(new ConfigurationError("test").code).toBe(161);
      expect(new ServiceUnavailableError("test").code).toBe(181);
      expect(new RateLimitError("test").code).toBe(191);
    });

    it("should support custom error codes within ranges", () => {
      expect(
        new ValidationError("test", "field", ErrorCodes.INVALID_PARAMETER).code
      ).toBe(102);
      expect(
        new ApiError(
          "test",
          undefined,
          undefined,
          undefined,
          ErrorCodes.API_TIMEOUT
        ).code
      ).toBe(125);
      expect(
        new NetworkError("test", undefined, ErrorCodes.CONNECTION_FAILED).code
      ).toBe(142);
    });
  });
});
