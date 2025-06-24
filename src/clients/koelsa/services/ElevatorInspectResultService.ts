import { BaseService } from "../../base/types";
import { HttpClient } from "../../../utils/http";
import { validatePageNo, validateNumOfRows } from "../../../utils/validation";
import {
  ElevatorInspectResultParams,
  ElevatorInspectResultResponse,
  ElevatorInspectResultInfo,
} from "../types";
import { 
  ApiError, 
  ValidationError,
  ElevatorNotFoundError,
  KOELSAServiceError,
  InvalidManagementCodeError 
} from "../../../errors";
import { ErrorCodes } from "../../../errors/base";

/**
 * 승강기 검사신청결과 서비스
 */
export class ElevatorInspectResultService implements BaseService {
  public readonly serviceName: string;

  constructor(private httpClient: HttpClient) {
    this.serviceName = this.constructor.name;
  }

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

    // 응답 검증 및 적절한 에러 처리
    const resultCode = response.data.response?.header?.resultCode;
    const resultMsg = response.data.response?.header?.resultMsg;
    
    if (resultCode !== "00") {
      // API 응답 코드에 따른 구체적인 에러 처리
      if (resultCode === "03") {
        throw new KOELSAServiceError(
          `KOELSA 서비스 오류: ${resultMsg}`,
          "/openapi/service/ElevatorInspectResultService/getInspectResultListV1"
        );
      } else if (resultCode === "04") {
        throw new ElevatorNotFoundError(
          `검사 결과를 찾을 수 없습니다: ${resultMsg}`
        );
      } else {
        throw new ApiError(
          `API 요청 실패: ${resultMsg}`,
          200,
          resultCode,
          response.data,
          ErrorCodes.API_RESPONSE_ERROR
        );
      }
    }

    const items = response.data.response?.body?.items;
    // 실제 데이터는 items.item 배열에 있음
    if (items && typeof items === 'object' && Array.isArray(items.item)) {
      return items.item;
    }
    // 데이터가 없으면 빈 배열
    return [];
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

    // 응답 검증 및 적절한 에러 처리
    const resultCode = response.data.response?.header?.resultCode;
    const resultMsg = response.data.response?.header?.resultMsg;
    
    if (resultCode !== "00") {
      // API 응답 코드에 따른 구체적인 에러 처리
      if (resultCode === "03") {
        throw new KOELSAServiceError(
          `KOELSA 서비스 오류: ${resultMsg}`,
          "/openapi/service/ElevatorInspectResultService/getInspectResultListV1"
        );
      } else if (resultCode === "04") {
        throw new ElevatorNotFoundError(
          `검사 결과를 찾을 수 없습니다: ${resultMsg}`
        );
      } else {
        throw new ApiError(
          `API 요청 실패: ${resultMsg}`,
          200,
          resultCode,
          response.data,
          ErrorCodes.API_RESPONSE_ERROR
        );
      }
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
   * 
   * @param params 조회 파라미터
   * @returns 검사신청결과 목록
   */
  async getInspectionResults(
    params: ElevatorInspectResultParams
  ): Promise<ElevatorInspectResultInfo[]> {
    return this.getInspectResultList(params);
  }

  /**
   * 파라미터 유효성 검사
   */
  private validateParams(params: ElevatorInspectResultParams): void {
    validatePageNo(params.pageNo);
    validateNumOfRows(params.numOfRows);

    if (!params.elvtrmngno_mngno || params.elvtrmngno_mngno.trim() === "") {
      throw new ValidationError(
        "현장관리코드 또는 승강기관리코드가 필요합니다.",
        "elvtrmngno_mngno",
        ErrorCodes.MISSING_REQUIRED_FIELD
      );
    }

    if (params.elvtrmngno_mngno.length > 100) {
      throw new InvalidManagementCodeError(
        "관리코드는 최대 100자까지 입력 가능합니다.",
        params.elvtrmngno_mngno
      );
    }
  }
}
