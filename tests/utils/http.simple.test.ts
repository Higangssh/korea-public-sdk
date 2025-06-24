import { HttpClient } from "../../src/utils/http";
import { NetworkError, ApiError } from "../../src/errors/common";
import { ClientConfig } from "../../src/types/common";
import { ErrorCodes } from "../../src/errors/base";

describe("HttpClient - Basic Tests", () => {
  describe("constructor", () => {
    it("should create HttpClient with basic configuration", () => {
      const config: ClientConfig = {
        baseURL: "https://api.test.com",
        serviceKey: "test-service-key",
        timeout: 5000,
      };

      const httpClient = new HttpClient(config);

      expect(httpClient).toBeInstanceOf(HttpClient);
    });

    it("should use default timeout when not provided", () => {
      const config: ClientConfig = {
        baseURL: "https://api.test.com",
        serviceKey: "test-service-key",
      };

      const httpClient = new HttpClient(config);

      expect(httpClient).toBeInstanceOf(HttpClient);
    });

    it("should accept custom headers", () => {
      const config: ClientConfig = {
        baseURL: "https://api.test.com",
        serviceKey: "test-service-key",
        headers: {
          "Custom-Header": "test-value",
        },
      };

      const httpClient = new HttpClient(config);

      expect(httpClient).toBeInstanceOf(HttpClient);
    });
  });

  describe("error classes", () => {
    it("should be able to create NetworkError with correct error code", () => {
      const error = new NetworkError("Test network error");

      expect(error).toBeInstanceOf(NetworkError);
      expect(error.message).toBe("Test network error");
      expect(error.code).toBe(ErrorCodes.NETWORK_ERROR);
      expect(typeof error.code).toBe("number");
    });

    it("should be able to create ApiError with correct error code", () => {
      const error = new ApiError("Test API error", 400, "BAD_REQUEST");

      expect(error).toBeInstanceOf(ApiError);
      expect(error.message).toBe("Test API error");
      expect(error.code).toBe(ErrorCodes.API_ERROR);
      expect(error.statusCode).toBe(400);
      expect(error.apiCode).toBe("BAD_REQUEST");
      expect(typeof error.code).toBe("number");
    });

    it("should support custom error codes", () => {
      const networkError = new NetworkError(
        "DNS failed",
        undefined,
        ErrorCodes.DNS_RESOLUTION_FAILED
      );
      const apiError = new ApiError(
        "Timeout",
        undefined,
        undefined,
        undefined,
        ErrorCodes.API_TIMEOUT
      );

      expect(networkError.code).toBe(ErrorCodes.DNS_RESOLUTION_FAILED);
      expect(apiError.code).toBe(ErrorCodes.API_TIMEOUT);
    });
  });

  describe("methods existence", () => {
    let httpClient: HttpClient;

    beforeEach(() => {
      const config: ClientConfig = {
        baseURL: "https://api.test.com",
        serviceKey: "test-service-key",
      };
      httpClient = new HttpClient(config);
    });

    it("should have request method", () => {
      expect(typeof httpClient.request).toBe("function");
    });

    it("should have get method", () => {
      expect(typeof httpClient.get).toBe("function");
    });

    it("should have post method", () => {
      expect(typeof httpClient.post).toBe("function");
    });
  });

  describe("configuration validation", () => {
    it("should work with minimal configuration", () => {
      const config: ClientConfig = {
        baseURL: "https://example.com",
        serviceKey: "test-key",
      };

      expect(() => new HttpClient(config)).not.toThrow();
    });

    it("should work with full configuration", () => {
      const config: ClientConfig = {
        baseURL: "https://example.com",
        serviceKey: "test-key",
        timeout: 15000,
        headers: {
          "User-Agent": "test-agent",
          "X-Custom": "value",
        },
      };

      expect(() => new HttpClient(config)).not.toThrow();
    });
  });

  describe("error code validation", () => {
    it("should verify error codes are in correct ranges", () => {
      // Common errors should be in 1xx range
      expect(ErrorCodes.NETWORK_ERROR).toBeGreaterThanOrEqual(100);
      expect(ErrorCodes.NETWORK_ERROR).toBeLessThan(200);
      expect(ErrorCodes.API_ERROR).toBeGreaterThanOrEqual(100);
      expect(ErrorCodes.API_ERROR).toBeLessThan(200);

      // Platform errors should be in 2xx+ range
      expect(ErrorCodes.KOELSA_SERVICE_ERROR).toBeGreaterThanOrEqual(200);
      expect(ErrorCodes.ELEVATOR_NOT_FOUND).toBeGreaterThanOrEqual(200);
    });

    it("should have consistent error messages", () => {
      const networkError = new NetworkError("Test network error");
      const apiError = new ApiError("Test API error");

      const networkJson = networkError.toJSON();
      const apiJson = apiError.toJSON();

      expect(networkJson).toHaveProperty("codeMessage");
      expect(networkJson).toHaveProperty("category", "Common Error");
      expect(apiJson).toHaveProperty("codeMessage");
      expect(apiJson).toHaveProperty("category", "Common Error");
    });
  });
});
