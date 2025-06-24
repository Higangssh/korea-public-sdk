/**
 * Main error exports for Korea Public SDK
 *
 * This file serves as the central export point for all error classes.
 * Individual error types are defined in separate files for better organization:
 *
 * - base.ts: Base error class
 * - common.ts: Common error types used across all agencies
 * - clients/[agency]/errors.ts: Agency-specific error types
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

// KMA specific errors (future)
export {
  WeatherStationNotFoundError,
  WeatherDataNotFoundError,
  InvalidLocationCodeError,
  KMAServiceError,
} from "./kma";

// KOTSA specific errors (future)
export {
  VehicleNotFoundError,
  InvalidVehicleNumberError,
  TransportDataNotAvailableError,
  KOTSAServiceError,
} from "./kotsa";

// Future agency errors can be exported here as they are implemented
// export { WeatherStationNotFoundError, WeatherDataUnavailableError } from './future-agencies';
// export { InvalidVehicleRegistrationError, TransportationDataRestrictedError } from './future-agencies';
