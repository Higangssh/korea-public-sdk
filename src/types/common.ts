/**
 * Common response interface
 */
export interface BaseResponse<T = any> {
  resultCode: string;
  resultMsg: string;
  data?: T;
}

/**
 * Pagination request parameters
 */
export interface PaginationParams {
  pageNo: number;
  numOfRows: number;
}

/**
 * Pagination response information
 */
export interface PaginationInfo {
  pageNo: number;
  numOfRows: number;
  totalCount: number;
}

/**
 * Common response format for public data APIs
 */
export interface PublicDataResponse<T = any> extends BaseResponse<T> {
  header: {
    resultCode: string;
    resultMsg: string;
  };
  body: {
    items?: T[];
    totalCount?: number;
    pageNo?: number;
    numOfRows?: number;
  };
}

/**
 * API client configuration
 */
export interface ClientConfig {
  baseURL: string;
  serviceKey: string;
  timeout?: number;
  headers?: Record<string, string>;
}

/**
 * HTTP method types
 */
export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

/**
 * Request options
 */
export interface RequestOptions {
  method?: HttpMethod;
  params?: Record<string, any> | undefined;
  data?: any;
  headers?: Record<string, string> | undefined;
  timeout?: number | undefined;
}
