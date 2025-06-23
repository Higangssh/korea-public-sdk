import { KoreaPublicSDKError } from "./base";

/**
 * Error thrown when validation fails
 */
export class ValidationError extends KoreaPublicSDKError {
  public readonly field?: string;

  constructor(message: string, field?: string) {
    super(message, "VALIDATION_ERROR");
    if (field !== undefined) {
      this.field = field;
    }
  }

  public toJSON() {
    const base = super.toJSON();
    if (this.field !== undefined) {
      return { ...base, field: this.field };
    }
    return base;
  }
}

/**
 * Error thrown when API request fails
 */
export class ApiError extends KoreaPublicSDKError {
  public readonly statusCode?: number;
  public readonly apiCode?: string;
  public readonly response?: any;

  constructor(
    message: string,
    statusCode?: number,
    apiCode?: string,
    response?: any
  ) {
    super(message, "API_ERROR");
    if (statusCode !== undefined) {
      this.statusCode = statusCode;
    }
    if (apiCode !== undefined) {
      this.apiCode = apiCode;
    }
    if (response !== undefined) {
      this.response = response;
    }
  }

  public toJSON() {
    const base = super.toJSON();
    const result: any = { ...base };
    if (this.statusCode !== undefined) {
      result.statusCode = this.statusCode;
    }
    if (this.apiCode !== undefined) {
      result.apiCode = this.apiCode;
    }
    if (this.response !== undefined) {
      result.response = this.response;
    }
    return result;
  }
}

/**
 * Error thrown when network request fails
 */
export class NetworkError extends KoreaPublicSDKError {
  public readonly originalError?: Error;

  constructor(message: string, originalError?: Error) {
    super(message, "NETWORK_ERROR");
    if (originalError !== undefined) {
      this.originalError = originalError;
    }
  }

  public toJSON() {
    const base = super.toJSON();
    const result: any = { ...base };
    if (this.originalError !== undefined) {
      result.originalError = this.originalError;
    }
    return result;
  }
}

/**
 * Error thrown when configuration is invalid
 */
export class ConfigurationError extends KoreaPublicSDKError {
  public readonly configField?: string;

  constructor(message: string, configField?: string) {
    super(message, "CONFIGURATION_ERROR");
    if (configField !== undefined) {
      this.configField = configField;
    }
  }

  public toJSON() {
    const base = super.toJSON();
    const result: any = { ...base };
    if (this.configField !== undefined) {
      result.configField = this.configField;
    }
    return result;
  }
}

/**
 * Error thrown when service is unavailable
 */
export class ServiceUnavailableError extends KoreaPublicSDKError {
  public readonly serviceName?: string;

  constructor(message: string, serviceName?: string) {
    super(message, "SERVICE_UNAVAILABLE");
    if (serviceName !== undefined) {
      this.serviceName = serviceName;
    }
  }

  public toJSON() {
    const base = super.toJSON();
    const result: any = { ...base };
    if (this.serviceName !== undefined) {
      result.serviceName = this.serviceName;
    }
    return result;
  }
}

/**
 * Error thrown when rate limit is exceeded
 */
export class RateLimitError extends KoreaPublicSDKError {
  public readonly retryAfter?: number;

  constructor(message: string, retryAfter?: number) {
    super(message, "RATE_LIMIT_EXCEEDED");
    if (retryAfter !== undefined) {
      this.retryAfter = retryAfter;
    }
  }

  public toJSON() {
    const base = super.toJSON();
    const result: any = { ...base };
    if (this.retryAfter !== undefined) {
      result.retryAfter = this.retryAfter;
    }
    return result;
  }
}
