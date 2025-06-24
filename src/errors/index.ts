/**
 * Main error exports for Korea Public SDK
 *
 * This file serves as the central export point for all error classes.
 * Individual error types are defined in separate files for better organization:
 *
 * - base.ts: Base error class and error codes
 * - common.ts: Common error types used across all agencies
 * - koelsa.ts: KOELSA-specific error types
 */

// Base error and error codes
export {
  KoreaPublicSDKError,
  ErrorCodes,
  getErrorMessage,
  getErrorCategory,
  isCommonError,
  isPlatformError,
} from "./base";

// Common errors
export {
  ValidationError,
  ApiError,
  NetworkError,
  ConfigurationError,
  ServiceUnavailableError,
  RateLimitError,
} from "./common";

// KOELSA-specific errors
export {
  ElevatorNotFoundError,
  InvalidInspectionDataError,
  InvalidManagementCodeError,
  KOELSAServiceError,
} from "./koelsa";

// Future agency errors will be added here as they are implemented
// export { WeatherStationNotFoundError, WeatherDataNotFoundError } from './kma';
// export { VehicleNotFoundError, TransportDataNotAvailableError } from './kotsa';
