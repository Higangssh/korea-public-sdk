import {
  ValidationError,
  ApiError,
  NetworkError,
  ConfigurationError,
  ServiceUnavailableError,
  RateLimitError,
} from "../../src/errors/common";
import { KoreaPublicSDKError } from "../../src/errors/base";

describe("Common Error Classes", () => {
  describe("ValidationError", () => {
    it("should create ValidationError with correct properties", () => {
      const message = "Invalid input";
      const field = "email";
      const error = new ValidationError(message, field);

      expect(error.message).toBe(message);
      expect(error.code).toBe("VALIDATION_ERROR");
      expect(error.field).toBe(field);
      expect(error.name).toBe("ValidationError");
      expect(error).toBeInstanceOf(KoreaPublicSDKError);
    });

    it("should work without field parameter", () => {
      const message = "Validation failed";
      const error = new ValidationError(message);

      expect(error.message).toBe(message);
      expect(error.code).toBe("VALIDATION_ERROR");
      expect(error.field).toBeUndefined();
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
      expect(error.code).toBe("API_ERROR");
      expect(error.statusCode).toBe(statusCode);
      expect(error.apiCode).toBe(apiCode);
      expect(error.response).toEqual(response);
      expect(error).toBeInstanceOf(KoreaPublicSDKError);
    });

    it("should work with minimal parameters", () => {
      const message = "API error";
      const error = new ApiError(message);

      expect(error.message).toBe(message);
      expect(error.code).toBe("API_ERROR");
      expect(error.statusCode).toBeUndefined();
      expect(error.apiCode).toBeUndefined();
      expect(error.response).toBeUndefined();
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
    });
  });

  describe("NetworkError", () => {
    it("should create NetworkError with original error", () => {
      const message = "Connection failed";
      const originalError = new Error("ECONNREFUSED");

      const error = new NetworkError(message, originalError);

      expect(error.message).toBe(message);
      expect(error.code).toBe("NETWORK_ERROR");
      expect(error.originalError).toBe(originalError);
      expect(error).toBeInstanceOf(KoreaPublicSDKError);
    });

    it("should work without original error", () => {
      const message = "Network timeout";
      const error = new NetworkError(message);

      expect(error.message).toBe(message);
      expect(error.code).toBe("NETWORK_ERROR");
      expect(error.originalError).toBeUndefined();
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
    });
  });

  describe("ConfigurationError", () => {
    it("should create ConfigurationError with config field", () => {
      const message = "Invalid configuration";
      const configField = "apiKey";

      const error = new ConfigurationError(message, configField);

      expect(error.message).toBe(message);
      expect(error.code).toBe("CONFIGURATION_ERROR");
      expect(error.configField).toBe(configField);
      expect(error).toBeInstanceOf(KoreaPublicSDKError);
    });

    it("should work without config field parameter", () => {
      const message = "Configuration error";
      const error = new ConfigurationError(message);

      expect(error.message).toBe(message);
      expect(error.code).toBe("CONFIGURATION_ERROR");
      expect(error.configField).toBeUndefined();
    });

    it("should include configField in JSON when present", () => {
      const error = new ConfigurationError("Invalid baseURL", "baseURL");
      const json = error.toJSON();

      expect(json).toHaveProperty("configField", "baseURL");
    });
  });

  describe("ServiceUnavailableError", () => {
    it("should create ServiceUnavailableError with service name", () => {
      const message = "Service is down";
      const serviceName = "KOELSA API";

      const error = new ServiceUnavailableError(message, serviceName);

      expect(error.message).toBe(message);
      expect(error.code).toBe("SERVICE_UNAVAILABLE");
      expect(error.serviceName).toBe(serviceName);
      expect(error).toBeInstanceOf(KoreaPublicSDKError);
    });

    it("should work without service name parameter", () => {
      const message = "Service unavailable";
      const error = new ServiceUnavailableError(message);

      expect(error.message).toBe(message);
      expect(error.code).toBe("SERVICE_UNAVAILABLE");
      expect(error.serviceName).toBeUndefined();
    });

    it("should include serviceName in JSON when present", () => {
      const error = new ServiceUnavailableError(
        "Maintenance mode",
        "Elevator Service"
      );
      const json = error.toJSON();

      expect(json).toHaveProperty("serviceName", "Elevator Service");
    });
  });

  describe("RateLimitError", () => {
    it("should create RateLimitError with retry after value", () => {
      const message = "Rate limit exceeded";
      const retryAfter = 60;

      const error = new RateLimitError(message, retryAfter);

      expect(error.message).toBe(message);
      expect(error.code).toBe("RATE_LIMIT_EXCEEDED");
      expect(error.retryAfter).toBe(retryAfter);
      expect(error).toBeInstanceOf(KoreaPublicSDKError);
    });

    it("should work without retry after parameter", () => {
      const message = "Too many requests";
      const error = new RateLimitError(message);

      expect(error.message).toBe(message);
      expect(error.code).toBe("RATE_LIMIT_EXCEEDED");
      expect(error.retryAfter).toBeUndefined();
    });

    it("should handle zero retry after value", () => {
      const error = new RateLimitError("Rate limited", 0);

      expect(error.retryAfter).toBe(0);
    });

    it("should include retryAfter in JSON when present", () => {
      const error = new RateLimitError("Rate limited", 120);
      const json = error.toJSON();

      expect(json).toHaveProperty("retryAfter", 120);
    });
  });

  describe("common error behavior", () => {
    const errorClasses = [
      { Class: ValidationError, code: "VALIDATION_ERROR", extraParam: "field" },
      { Class: ApiError, code: "API_ERROR", extraParam: "statusCode" },
      {
        Class: NetworkError,
        code: "NETWORK_ERROR",
        extraParam: "originalError",
      },
      {
        Class: ConfigurationError,
        code: "CONFIGURATION_ERROR",
        extraParam: "configField",
      },
      {
        Class: ServiceUnavailableError,
        code: "SERVICE_UNAVAILABLE",
        extraParam: "serviceName",
      },
      {
        Class: RateLimitError,
        code: "RATE_LIMIT_EXCEEDED",
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
          expect(error.code).toBe("VALIDATION_ERROR");
        } else if (error instanceof ApiError) {
          expect(error.code).toBe("API_ERROR");
        } else if (error instanceof NetworkError) {
          expect(error.code).toBe("NETWORK_ERROR");
        } else if (error instanceof ConfigurationError) {
          expect(error.code).toBe("CONFIGURATION_ERROR");
        } else if (error instanceof ServiceUnavailableError) {
          expect(error.code).toBe("SERVICE_UNAVAILABLE");
        } else if (error instanceof RateLimitError) {
          expect(error.code).toBe("RATE_LIMIT_EXCEEDED");
        }
      });
    });
  });
});
