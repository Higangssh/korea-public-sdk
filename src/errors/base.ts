/**
 * Error codes used across Korea Public SDK
 *
 * Error Code Classification:
 * 1xx - Common errors (validation, API, network, configuration, service, rate limiting)
 * 2xx - KOELSA (Korea Elevator Safety Agency) specific errors
 * 3xx-9xx - Reserved for future agencies
 */
export enum ErrorCodes {
  // 1xx - Common errors
  UNKNOWN_ERROR = 100,

  // Validation errors (101-120)
  VALIDATION_ERROR = 101,
  INVALID_PARAMETER = 102,
  MISSING_REQUIRED_FIELD = 103,
  INVALID_DATE_FORMAT = 104,
  INVALID_PAGE_NUMBER = 105,
  INVALID_SERVICE_KEY = 106,

  // API errors (121-140)
  API_ERROR = 121,
  API_REQUEST_FAILED = 122,
  API_RESPONSE_ERROR = 123,
  INVALID_API_RESPONSE = 124,
  API_TIMEOUT = 125,

  // Network errors (141-160)
  NETWORK_ERROR = 141,
  CONNECTION_FAILED = 142,
  DNS_RESOLUTION_FAILED = 143,
  SSL_ERROR = 144,

  // Configuration errors (161-180)
  CONFIGURATION_ERROR = 161,
  INVALID_BASE_URL = 162,
  INVALID_TIMEOUT = 163,
  MISSING_CONFIGURATION = 164,

  // Service availability errors (181-190)
  SERVICE_UNAVAILABLE = 181,
  SERVICE_MAINTENANCE = 182,
  SERVICE_DEPRECATED = 183,

  // Rate limiting errors (191-199)
  RATE_LIMIT_EXCEEDED = 191,
  QUOTA_EXCEEDED = 192,
  DAILY_LIMIT_EXCEEDED = 193,

  // 2xx - KOELSA (Korea Elevator Safety Agency) specific errors
  KOELSA_SERVICE_ERROR = 200,
  ELEVATOR_NOT_FOUND = 201,
  INVALID_ELEVATOR_NUMBER = 202,
  INVALID_INSPECTION_DATA = 203,
  INVALID_MANAGEMENT_CODE = 204,
  INSPECTION_DATA_NOT_AVAILABLE = 205,
  ELEVATOR_INSTALLATION_NOT_FOUND = 206,
  INVALID_ELEVATOR_TYPE = 207,
  MAINTENANCE_RECORD_NOT_FOUND = 208,

  // 3xx-9xx - Reserved for future agencies
  // Future error codes will be added here as new agencies are implemented
}

/**
 * Get human-readable error message for error code
 */
export function getErrorMessage(code: ErrorCodes): string {
  const messages: Record<ErrorCodes, string> = {
    // 1xx - Common errors
    [ErrorCodes.UNKNOWN_ERROR]: "Unknown error occurred",

    // Validation errors (101-120)
    [ErrorCodes.VALIDATION_ERROR]: "Validation failed",
    [ErrorCodes.INVALID_PARAMETER]: "Invalid parameter provided",
    [ErrorCodes.MISSING_REQUIRED_FIELD]: "Required field is missing",
    [ErrorCodes.INVALID_DATE_FORMAT]: "Invalid date format (expected YYYYMMDD)",
    [ErrorCodes.INVALID_PAGE_NUMBER]: "Invalid page number",
    [ErrorCodes.INVALID_SERVICE_KEY]: "Invalid service key",

    // API errors (121-140)
    [ErrorCodes.API_ERROR]: "API request failed",
    [ErrorCodes.API_REQUEST_FAILED]: "Failed to send API request",
    [ErrorCodes.API_RESPONSE_ERROR]: "API returned error response",
    [ErrorCodes.INVALID_API_RESPONSE]: "Invalid API response format",
    [ErrorCodes.API_TIMEOUT]: "API request timeout",

    // Network errors (141-160)
    [ErrorCodes.NETWORK_ERROR]: "Network connection failed",
    [ErrorCodes.CONNECTION_FAILED]: "Unable to connect to server",
    [ErrorCodes.DNS_RESOLUTION_FAILED]: "DNS resolution failed",
    [ErrorCodes.SSL_ERROR]: "SSL/TLS connection error",

    // Configuration errors (161-180)
    [ErrorCodes.CONFIGURATION_ERROR]: "Configuration error",
    [ErrorCodes.INVALID_BASE_URL]: "Invalid base URL",
    [ErrorCodes.INVALID_TIMEOUT]: "Invalid timeout value",
    [ErrorCodes.MISSING_CONFIGURATION]: "Missing required configuration",

    // Service availability errors (181-190)
    [ErrorCodes.SERVICE_UNAVAILABLE]: "Service is currently unavailable",
    [ErrorCodes.SERVICE_MAINTENANCE]: "Service is under maintenance",
    [ErrorCodes.SERVICE_DEPRECATED]: "Service has been deprecated",

    // Rate limiting errors (191-199)
    [ErrorCodes.RATE_LIMIT_EXCEEDED]: "Rate limit exceeded",
    [ErrorCodes.QUOTA_EXCEEDED]: "API quota exceeded",
    [ErrorCodes.DAILY_LIMIT_EXCEEDED]: "Daily request limit exceeded",

    // 2xx - KOELSA specific errors
    [ErrorCodes.KOELSA_SERVICE_ERROR]: "KOELSA service error",
    [ErrorCodes.ELEVATOR_NOT_FOUND]: "Elevator not found",
    [ErrorCodes.INVALID_ELEVATOR_NUMBER]: "Invalid elevator number format",
    [ErrorCodes.INVALID_INSPECTION_DATA]: "Invalid inspection data",
    [ErrorCodes.INVALID_MANAGEMENT_CODE]: "Invalid management code",
    [ErrorCodes.INSPECTION_DATA_NOT_AVAILABLE]: "Inspection data not available",
    [ErrorCodes.ELEVATOR_INSTALLATION_NOT_FOUND]:
      "Elevator installation not found",
    [ErrorCodes.INVALID_ELEVATOR_TYPE]: "Invalid elevator type",
    [ErrorCodes.MAINTENANCE_RECORD_NOT_FOUND]: "Maintenance record not found",
  };

  return messages[code] || "Unknown error";
}

/**
 * Get error category from error code
 */
export function getErrorCategory(code: ErrorCodes): string {
  const hundreds = Math.floor(code / 100);

  switch (hundreds) {
    case 1:
      return "Common Error";
    case 2:
      return "KOELSA Error";
    default:
      return "Future Agency Error";
  }
}

/**
 * Check if error code is a common error
 */
export function isCommonError(code: ErrorCodes): boolean {
  return code >= 100 && code < 200;
}

/**
 * Check if error code is platform-specific
 */
export function isPlatformError(code: ErrorCodes): boolean {
  return code >= 200 && code < 300; // Currently only KOELSA (2xx)
}

/**
 * Base error class for Korea Public SDK
 */
export abstract class KoreaPublicSDKError extends Error {
  public readonly code: ErrorCodes;
  public readonly timestamp: Date;

  constructor(message: string, code: ErrorCodes) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.timestamp = new Date();

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  /**
   * Get error details as a plain object
   */
  public toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      category: getErrorCategory(this.code),
      codeMessage: getErrorMessage(this.code),
      timestamp: this.timestamp.toISOString(),
      stack: this.stack,
    };
  }
}
