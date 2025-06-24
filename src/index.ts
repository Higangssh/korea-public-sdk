// 클라이언트 관련 (clients/*, base/*, koelsa/*)
export * from "./clients";

// 에러 관련 (errors/*)
export * from "./errors";

// 타입 정의 (types/*)
export * from "./types";

// 유틸리티 함수 (utils/*)
export * from "./utils";

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
