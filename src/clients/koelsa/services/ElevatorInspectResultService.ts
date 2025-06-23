import { BaseService } from "../../base/types";
import { HttpClient } from "../../../utils/http";
import { validatePageNo, validateNumOfRows } from "../../../utils/validation";
import {
  ElevatorInspectResultParams,
  ElevatorInspectResultResponse,
  ElevatorInspectResultInfo,
} from "../types";

/**
 * 승강기 검사신청결과 서비스
 */
export class ElevatorInspectResultService implements BaseService {
  public readonly serviceName = "ElevatorInspectResultService";

  constructor(private httpClient: HttpClient) {}

  /**
   * 승강기 검사신청결과 조회
   *
   * @param params 조회 파라미터
   * @returns 검사신청결과 목록
   */
  async getInspectResultList(
    params: ElevatorInspectResultParams
  ): Promise<ElevatorInspectResultInfo[]> {
    // 파라미터 유효성 검사
    this.validateParams(params);

    const response = await this.httpClient.get<ElevatorInspectResultResponse>(
      "/openapi/service/ElevatorInspectResultService/getInspectResultListV1",
      params
    );

    // 응답 검증
    if (response.data.resultCode !== "00") {
      throw new Error(`API 오류: ${response.data.resultMsg}`);
    }

    return response.data.items || [];
  }

  /**
   * 승강기 검사신청결과 조회 (페이징 정보 포함)
   *
   * @param params 조회 파라미터
   * @returns 검사신청결과와 페이징 정보
   */
  async getInspectResultListWithPagination(
    params: ElevatorInspectResultParams
  ): Promise<ElevatorInspectResultResponse> {
    // 파라미터 유효성 검사
    this.validateParams(params);

    const response = await this.httpClient.get<ElevatorInspectResultResponse>(
      "/openapi/service/ElevatorInspectResultService/getInspectResultListV1",
      params
    );

    // 응답 검증
    if (response.data.resultCode !== "00") {
      throw new Error(`API 오류: ${response.data.resultMsg}`);
    }

    return response.data;
  }

  /**
   * 특정 관리코드의 검사신청결과 조회
   *
   * @param managementCode 현장관리코드 또는 승강기관리코드
   * @param responseType 응답 데이터 형식 (xml/json)
   * @returns 검사신청결과 정보
   */
  async getInspectResultByCode(
    managementCode: string,
    responseType: "xml" | "json" = "json"
  ): Promise<ElevatorInspectResultInfo[]> {
    const params: ElevatorInspectResultParams = {
      pageNo: 1,
      numOfRows: 1000,
      elvtrmngno_mngno: managementCode,
      _type: responseType,
    };

    return this.getInspectResultList(params);
  }

  /**
   * 파라미터 유효성 검사
   */
  private validateParams(params: ElevatorInspectResultParams): void {
    validatePageNo(params.pageNo);
    validateNumOfRows(params.numOfRows);

    if (!params.elvtrmngno_mngno || params.elvtrmngno_mngno.trim() === "") {
      throw new Error("현장관리코드 또는 승강기관리코드가 필요합니다.");
    }

    if (params.elvtrmngno_mngno.length > 100) {
      throw new Error("관리코드는 최대 100자까지 입력 가능합니다.");
    }
  }
}
