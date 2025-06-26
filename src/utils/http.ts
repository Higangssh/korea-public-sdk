import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { ClientConfig, RequestOptions } from "../types/common";
import { NetworkError, ApiError } from "../errors/common";
import { ErrorCodes } from "../errors/base";

/**
 * HTTP client utility class for handling API requests
 */
export class HttpClient {
  private readonly client: AxiosInstance;

  constructor(config: ClientConfig) {
    this.client = axios.create({
      baseURL: config.baseURL,
      timeout: config.timeout || 10000,
      headers: {
        "Content-Type": "application/json",
        ...config.headers,
      },
    });

    // Request interceptor - automatically add service key
    this.client.interceptors.request.use((axiosConfig) => {
      if (axiosConfig.params) {
        axiosConfig.params.serviceKey = config.serviceKey;
      } else {
        axiosConfig.params = { serviceKey: config.serviceKey };
      }
      return axiosConfig;
    });

    // Response interceptor - error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response) {
          // Determine appropriate error code based on status
          let errorCode = ErrorCodes.API_ERROR;
          if (error.response.status === 429) {
            errorCode = ErrorCodes.RATE_LIMIT_EXCEEDED;
          } else if (error.response.status >= 500) {
            errorCode = ErrorCodes.SERVICE_UNAVAILABLE;
          } else if (
            error.code === "ECONNABORTED" ||
            error.code === "TIMEOUT"
          ) {
            errorCode = ErrorCodes.API_TIMEOUT;
          }

          throw new ApiError(
            `API request failed: ${error.response.status} - ${
              error.response.data?.resultMsg || error.message
            }`,
            error.response.status,
            error.response.data?.resultCode,
            error.response.data,
            errorCode
          );
        } else if (error.request) {
          let errorCode = ErrorCodes.NETWORK_ERROR;
          if (error.code === "ENOTFOUND") {
            errorCode = ErrorCodes.DNS_RESOLUTION_FAILED;
          } else if (error.code === "ECONNREFUSED") {
            errorCode = ErrorCodes.CONNECTION_FAILED;
          }

          throw new NetworkError(
            "Network error: Unable to connect to server",
            error,
            errorCode
          );
        } else {
          throw new NetworkError(
            `Request configuration error: ${error.message}`,
            error,
            ErrorCodes.CONFIGURATION_ERROR
          );
        }
      }
    );
  }

  /**
   * Execute HTTP request
   */
  async request<T = any>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<AxiosResponse<T>> {
    const config: AxiosRequestConfig = {
      url: endpoint,
      method: options.method || "GET",
      ...(options.params && { params: options.params }),
      ...(options.data && { data: options.data }),
      ...(options.headers && { headers: options.headers }),
      ...(options.timeout && { timeout: options.timeout }),
    };

    return this.client.request<T>(config);
  }

  /**
   * Execute GET request
   */
  async get<T = any>(
    endpoint: string,
    params?: Record<string, any>,
    options?: Omit<RequestOptions, "method" | "params">
  ): Promise<AxiosResponse<T>> {
    const requestOptions: RequestOptions = { ...options, method: "GET" };
    if (params) {
      requestOptions.params = params;
    }
    return this.request<T>(endpoint, requestOptions);
  }

  /**
   * Execute POST request
   */
  async post<T = any>(
    endpoint: string,
    data?: any,
    options?: Omit<RequestOptions, "method" | "data">
  ): Promise<AxiosResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: "POST", data });
  }
}
