import { KoreaPublicSDKError, ErrorCodes } from "./base";

/**
 * Error thrown when validation fails
 */
export class ValidationError extends KoreaPublicSDKError {
  public readonly field?: string;

  constructor(
    message: string,
    field?: string,
    code: ErrorCodes = ErrorCodes.VALIDATION_ERROR
  ) {
    super(message, code);
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
    response?: any,
    code: ErrorCodes = ErrorCodes.API_ERROR
  ) {
    super(message, code);
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

  constructor(
    message: string,
    originalError?: Error,
    code: ErrorCodes = ErrorCodes.NETWORK_ERROR
  ) {
    super(message, code);
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

  constructor(
    message: string,
    configField?: string,
    code: ErrorCodes = ErrorCodes.CONFIGURATION_ERROR
  ) {
    super(message, code);
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

  constructor(
    message: string,
    serviceName?: string,
    code: ErrorCodes = ErrorCodes.SERVICE_UNAVAILABLE
  ) {
    super(message, code);
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

  constructor(
    message: string,
    retryAfter?: number,
    code: ErrorCodes = ErrorCodes.RATE_LIMIT_EXCEEDED
  ) {
    super(message, code);
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
