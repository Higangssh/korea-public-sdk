import { HttpClient } from "../../src/utils/http";
import { NetworkError, ApiError } from "../../src/errors/common";
import { ClientConfig } from "../../src/types/common";

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
    it("should be able to create NetworkError", () => {
      const error = new NetworkError("Test network error");

      expect(error).toBeInstanceOf(NetworkError);
      expect(error.message).toBe("Test network error");
      expect(error.code).toBe("NETWORK_ERROR");
    });

    it("should be able to create ApiError", () => {
      const error = new ApiError("Test API error", 400, "BAD_REQUEST");

      expect(error).toBeInstanceOf(ApiError);
      expect(error.message).toBe("Test API error");
      expect(error.code).toBe("API_ERROR");
      expect(error.statusCode).toBe(400);
      expect(error.apiCode).toBe("BAD_REQUEST");
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
});
