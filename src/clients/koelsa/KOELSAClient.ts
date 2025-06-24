import { BaseClient } from "../base/BaseClient";
import { ApiProviderInfo } from "../base/types";
import { ClientConfig } from "../../types/common";
import { ElevatorInstallationService } from "./services/ElevatorInstallationService";
import { ElevatorInspectResultService } from "./services/ElevatorInspectResultService";
import { 
  ValidationError, 
  ApiError, 
  NetworkError, 
  ServiceUnavailableError,
  KOELSAServiceError
} from "../../errors";

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
  public readonly inspection: ElevatorInspectResultService;

  /**
   * API provider information
   */
  public static readonly providerInfo: ApiProviderInfo = {
    name: "Korea Elevator Safety Agency",
    description:
      "Public agency responsible for elevator safety management and inspection",
    baseURL: "https://apis.data.go.kr/",
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
    this.inspection = new ElevatorInspectResultService(this.httpClient);
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
      services: [this.installation.serviceName, this.inspection.serviceName],
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
      // 구체적인 에러 타입별 처리
      if (error instanceof ValidationError) {
        console.warn("KOELSA health check - 유효성 검사 실패:", error.message, error.field);
      } else if (error instanceof ApiError) {
        console.warn("KOELSA health check - API 오류:", error.message, "상태코드:", error.statusCode);
      } else if (error instanceof NetworkError) {
        console.warn("KOELSA health check - 네트워크 오류:", error.message);
      } else if (error instanceof ServiceUnavailableError) {
        console.warn("KOELSA health check - 서비스 이용 불가:", error.message);
      } else if (error instanceof KOELSAServiceError) {
        console.warn("KOELSA health check - KOELSA 서비스 오류:", error.message, "엔드포인트:", error.serviceEndpoint);
      } else {
        console.warn("KOELSA health check - 알 수 없는 오류:", error);
      }
      return false;
    }
  }
}
