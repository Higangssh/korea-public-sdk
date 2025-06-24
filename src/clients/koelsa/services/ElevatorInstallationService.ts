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
import { 
  ApiError, 
  ValidationError,
  ElevatorNotFoundError,
  KOELSAServiceError 
} from "../../../errors";
import { ErrorCodes } from "../../../errors/base";

/**
 * Elevator installation information service
 */
export class ElevatorInstallationService implements BaseService {
  public readonly serviceName: string;

  constructor(private httpClient: HttpClient) {
    this.serviceName = this.constructor.name;
  }

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

    // 응답 검증 및 적절한 에러 처리
    const resultCode = response.data.response?.header?.resultCode;
    const resultMsg = response.data.response?.header?.resultMsg;
    
    if (resultCode !== "00") {
      // API 응답 코드에 따른 구체적인 에러 처리
      if (resultCode === "03") {
        throw new KOELSAServiceError(
          `KOELSA 서비스 오류: ${resultMsg}`,
          "/openapi/service/ElevatorInstallationService/getInstallationElvtrListV2"
        );
      } else if (resultCode === "04") {
        throw new ElevatorNotFoundError(
          `승강기 설치 정보를 찾을 수 없습니다: ${resultMsg}`
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

    // 응답 검증 및 적절한 에러 처리
    const resultCode = response.data.response?.header?.resultCode;
    const resultMsg = response.data.response?.header?.resultMsg;
    
    if (resultCode !== "00") {
      // API 응답 코드에 따른 구체적인 에러 처리
      if (resultCode === "03") {
        throw new KOELSAServiceError(
          `KOELSA 서비스 오류: ${resultMsg}`,
          "/openapi/service/ElevatorInstallationService/getInstallationElvtrListV2"
        );
      } else if (resultCode === "04") {
        throw new ElevatorNotFoundError(
          `승강기 설치 정보를 찾을 수 없습니다: ${resultMsg}`
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
    if (params.Installation_sdt && params.Installation_edt && params.Installation_sdt > params.Installation_edt) {
      throw new ValidationError(
        "시작일이 종료일보다 늦을 수 없습니다.",
        "Installation_sdt",
        ErrorCodes.INVALID_DATE_FORMAT
      );
    }
  }
}
