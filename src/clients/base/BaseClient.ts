import { HttpClient } from "../../utils/http";
import { ClientConfig } from "../../types/common";
import { validateServiceKey } from "../../utils/validation";

/**
 * Base class for all public API clients
 */
export abstract class BaseClient {
  protected httpClient: HttpClient;
  protected config: ClientConfig;

  constructor(config: ClientConfig) {
    // Validate service key
    validateServiceKey(config.serviceKey);

    this.config = config;
    this.httpClient = new HttpClient(config);
  }

  /**
   * Get client configuration information
   */
  public getConfig(): Readonly<ClientConfig> {
    return Object.freeze({ ...this.config });
  }

  /**
   * Update service key
   */
  public updateServiceKey(serviceKey: string): void {
    validateServiceKey(serviceKey);
    this.config.serviceKey = serviceKey;
    // Recreate HttpClient
    this.httpClient = new HttpClient(this.config);
  }
}
