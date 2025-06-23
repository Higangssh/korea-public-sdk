// Client exports
export { KOELSAClient } from "./clients/koelsa/KOELSAClient";
export { BaseClient } from "./clients/base/BaseClient";

// Error exports
export {
  KoreaPublicSDKError,
  ValidationError,
  ApiError,
  NetworkError,
  ConfigurationError,
  ServiceUnavailableError,
  RateLimitError,
} from "./errors";

// Type exports
export type {
  ClientConfig,
  PaginationParams,
  PaginationInfo,
} from "./types/common";
export type { BaseService, ApiProviderInfo } from "./clients/base/types";

// KOELSA type exports
export type {
  ElevatorInstallationParams,
  ElevatorInstallationInfo,
  ElevatorInstallationResponse,
  ElevatorInspectResultParams,
  ElevatorInspectResultInfo,
  ElevatorInspectResultResponse,
} from "./clients/koelsa/types";

// Service exports
export { ElevatorInstallationService } from "./clients/koelsa/services/ElevatorInstallationService";
export { ElevatorInspectResultService } from "./clients/koelsa/services/ElevatorInspectResultService";

// Utility exports
export { HttpClient } from "./utils/http";
export {
  validateServiceKey,
  validatePageNo,
  validateNumOfRows,
  validateDateFormat,
  validateElevatorNo,
} from "./utils/validation";

/**
 * SDK version information
 */
export const SDK_VERSION = "1.0.0";

/**
 * Supported API provider list
 */
export const SUPPORTED_PROVIDERS = {
  KOELSA: "Korea Elevator Safety Agency",
} as const;

/**
 * Convenience function: Create KOELSA client
 *
 * @param serviceKey Service key issued from Public Data Portal
 * @returns KOELSAClient instance
 */
export function createKOELSAClient(serviceKey: string) {
  const { KOELSAClient } = require("./clients/koelsa/KOELSAClient");
  return new KOELSAClient(serviceKey);
}
