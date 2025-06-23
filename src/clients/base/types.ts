/**
 * Base service interface
 */
export interface BaseService {
  readonly serviceName: string;
}

/**
 * Public API provider information
 */
export interface ApiProviderInfo {
  name: string;
  description: string;
  baseURL: string;
  websiteURL?: string;
  documentationURL?: string;
}
