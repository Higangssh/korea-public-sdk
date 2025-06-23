import { BaseService } from "../../base/types";
import { HttpClient } from "../../../utils/http";
import {
  validatePageNo,
  validateNumOfRows,
  validateDateFormat,
  validateElevatorNo,
} from "../../../utils/validation";
import {
  ElevatorInstallationParams,
  ElevatorInstallationResponse,
  ElevatorInstallationInfo,
} from "../types";

/**
 * Elevator installation information service
 */
export class ElevatorInstallationService implements BaseService {
  public readonly serviceName = "ElevatorInstallationService";

  constructor(private httpClient: HttpClient) {}

  /**
   * Get elevator installation information list
   *
   * @param params Query parameters
   * @returns List of elevator installation information
   */
  async getInstallationList(
    params: ElevatorInstallationParams
  ): Promise<ElevatorInstallationInfo[]> {
    // 파라미터 유효성 검사
    this.validateParams(params);

    const response = await this.httpClient.get<ElevatorInstallationResponse>(
      "/openapi/service/ElevatorInstallationService/getInstallationElvtrListV2",
      params
    );

    // 응답 검증
    if (response.data.resultCode !== "00") {
      throw new Error(`API 오류: ${response.data.resultMsg}`);
    }

    return response.data.items || [];
  }

  /**
   * 승강기 설치정보 조회 (페이징 정보 포함)
   *
   * @param params 조회 파라미터
   * @returns 승강기 설치정보와 페이징 정보
   */
  async getInstallationListWithPagination(
    params: ElevatorInstallationParams
  ): Promise<ElevatorInstallationResponse> {
    // 파라미터 유효성 검사
    this.validateParams(params);

    const response = await this.httpClient.get<ElevatorInstallationResponse>(
      "/openapi/service/ElevatorInstallationService/getInstallationElvtrListV2",
      params
    );

    // 응답 검증
    if (response.data.resultCode !== "00") {
      throw new Error(`API 오류: ${response.data.resultMsg}`);
    }

    return response.data;
  }

  /**
   * 특정 승강기의 설치정보 조회
   *
   * @param elevatorNo 승강기 고유번호
   * @param startDate 조회 시작일 (YYYYMMDD)
   * @param endDate 조회 종료일 (YYYYMMDD)
   * @returns 승강기 설치정보
   */
  async getElevatorInstallationInfo(
    elevatorNo: string,
    startDate: string,
    endDate: string
  ): Promise<ElevatorInstallationInfo | null> {
    const params: ElevatorInstallationParams = {
      pageNo: 1,
      numOfRows: 1,
      Installation_sdt: startDate,
      Installation_edt: endDate,
      elevator_no: elevatorNo,
    };

    const items = await this.getInstallationList(params);
    return items.length > 0 ? items[0] : null;
  }

  /**
   * 파라미터 유효성 검사
   */
  private validateParams(params: ElevatorInstallationParams): void {
    validatePageNo(params.pageNo);
    validateNumOfRows(params.numOfRows);
    validateDateFormat(params.Installation_sdt, "자료생성일자(시작일)");
    validateDateFormat(params.Installation_edt, "자료생성일자(종료일)");

    if (params.elevator_no) {
      validateElevatorNo(params.elevator_no);
    }

    // 시작일이 종료일보다 늦지 않은지 확인
    if (params.Installation_sdt > params.Installation_edt) {
      throw new Error("시작일이 종료일보다 늦을 수 없습니다.");
    }
  }
}
