import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { ClientConfig, RequestOptions } from "../types/common";
import { NetworkError, ApiError } from "../errors/common";

/**
 * HTTP client utility class for handling API requests
 */
export class HttpClient {
  private client: AxiosInstance;

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
          throw new ApiError(
            `API request failed: ${error.response.status} - ${
              error.response.data?.resultMsg || error.message
            }`,
            error.response.status,
            error.response.data?.resultCode,
            error.response.data
          );
        } else if (error.request) {
          throw new NetworkError(
            "Network error: Unable to connect to server",
            error
          );
        } else {
          throw new NetworkError(
            `Request configuration error: ${error.message}`,
            error
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
