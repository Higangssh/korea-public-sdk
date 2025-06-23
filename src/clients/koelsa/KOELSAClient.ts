import { BaseClient } from "../base/BaseClient";
import { ApiProviderInfo } from "../base/types";
import { ClientConfig } from "../../types/common";
import { ElevatorInstallationService } from "./services/ElevatorInstallationService";
import { ElevatorInspectResultService } from "./services/ElevatorInspectResultService";

/**
 * Korea Elevator Safety Agency (KOELSA) API client
 */
export class KOELSAClient extends BaseClient {
  /**
   * Elevator installation information service
   */
  public readonly installation: ElevatorInstallationService;

  /**
   * Elevator inspection result service
   */
  public readonly inspectResult: ElevatorInspectResultService;

  /**
   * API provider information
   */
  public static readonly providerInfo: ApiProviderInfo = {
    name: "Korea Elevator Safety Agency",
    description:
      "Public agency responsible for elevator safety management and inspection",
    baseURL: "http://openapi.elevator.go.kr",
    websiteURL: "https://home.koelsa.or.kr",
    documentationURL: "https://www.data.go.kr",
  };

  constructor(serviceKey: string, options?: Partial<ClientConfig>) {
    const config: ClientConfig = {
      baseURL: KOELSAClient.providerInfo.baseURL,
      serviceKey,
      timeout: 30000,
      ...options,
    };

    super(config);

    // Create service instances
    this.installation = new ElevatorInstallationService(this.httpClient);
    this.inspectResult = new ElevatorInspectResultService(this.httpClient);
  }

  /**
   * Get client information
   */
  public getClientInfo(): {
    provider: ApiProviderInfo;
    services: string[];
    config: Readonly<ClientConfig>;
  } {
    return {
      provider: KOELSAClient.providerInfo,
      services: [this.installation.serviceName, this.inspectResult.serviceName],
      config: this.getConfig(),
    };
  }

  /**
   * Check service health
   */
  public async healthCheck(): Promise<boolean> {
    try {
      // Simple API call to check service status
      await this.installation.getInstallationList({
        pageNo: 1,
        numOfRows: 1,
        Installation_sdt: "20240101",
        Installation_edt: "20240101",
      });
      return true;
    } catch (error) {
      console.warn("KOELSA API health check failed:", error);
      return false;
    }
  }
}
