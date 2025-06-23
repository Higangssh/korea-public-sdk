import { PaginationParams, PaginationInfo } from "../../types/common";

/**
 * Request parameters for elevator installation information query
 */
export interface ElevatorInstallationParams extends PaginationParams {
  /**
   * Data creation date (start) - YYYYMMDD format
   */
  Installation_sdt: string;

  /**
   * Data creation date (end) - YYYYMMDD format
   */
  Installation_edt: string;

  /**
   * Elevator unique number (optional)
   */
  elevator_no?: string;
}

/**
 * Elevator installation information response data
 */
export interface ElevatorInstallationInfo {
  /**
   * Elevator unique number
   */
  elevatorNo: string;

  /**
   * 건물명
   */
  buldNm: string;

  /**
   * 건물주소1
   */
  address1: string;

  /**
   * 건물주소2
   */
  address2: string;

  /**
   * 시도명
   */
  sido: string;

  /**
   * 시군구명
   */
  sigungu: string;

  /**
   * 승강기호기
   */
  elvtrAsignNo: string;

  /**
   * 승강기구분
   */
  elvtrDiv: string;

  /**
   * 승강기형식
   */
  elvtrForm: string;

  /**
   * 승강기세부형식
   */
  elvtrDetailForm: string;

  /**
   * 승강기종류
   */
  elvtrKindNm: string;

  /**
   * 설치장소
   */
  installationPlace: string;

  /**
   * 운행층수
   */
  shuttleFloorCnt: string;

  /**
   * 정격속도(m/s)
   */
  ratedSpeed: string;

  /**
   * 적재하중(kg)
   */
  liveLoad: string;

  /**
   * 최대정원(인승)
   */
  ratedCap: string;

  /**
   * 제조업체명
   */
  companyNm: string;

  /**
   * 최초설치일자
   */
  frstInstallationDe: string;

  /**
   * 설치일자
   */
  installationDe: string;

  /**
   * 국가건물관리번호
   */
  bdmgtSn: string;

  /**
   * 건물용도(대분류)
   */
  buldPrposLclas: string;

  /**
   * 건물용도(소분류)
   */
  buldPrposSclas: string;
}

/**
 * 승강기 설치정보 응답
 */
export interface ElevatorInstallationResponse extends PaginationInfo {
  resultCode: string;
  resultMsg: string;
  items: ElevatorInstallationInfo[];
}

/**
 * 승강기 검사신청결과 조회 요청 파라미터
 */
export interface ElevatorInspectResultParams extends PaginationParams {
  /**
   * 신청업체 현장관리코드 또는 신청업체 승강기관리코드
   */
  elvtrmngno_mngno: string;

  /**
   * 응답자료형식 (xml/json) - 기본값: xml
   */
  _type?: "xml" | "json";
}

/**
 * 승강기 검사신청결과 정보
 */
export interface ElevatorInspectResultInfo {
  /**
   * 신청업체현장관리코드
   */
  mngNo?: string;

  /**
   * 신청업체승강기관리코드
   */
  elvtrMngNo?: string;

  /**
   * 신청일자
   */
  reqstDe: string;

  /**
   * 신청당시건물명
   */
  reqstBuldNm: string;

  /**
   * 신청당시건물주소
   */
  reqstBuldAdress: string;

  /**
   * 신청당시검사종류
   */
  reqstInspctKindNm: string;

  /**
   * 신청당시검사대수
   */
  reqstCnt?: string;

  /**
   * 설치수시구분
   */
  installationDivNm?: string;

  /**
   * 공단측건물명
   */
  buldNm?: string;

  /**
   * 공단측건물주소
   */
  address?: string;

  /**
   * 호기
   */
  elvtrAsignNo?: string;

  /**
   * 승강기고유번호
   */
  elvtrUniqueNo?: string;

  /**
   * 승강기구분
   */
  elvtrDivNm?: string;

  /**
   * 승강기형식
   */
  elvtrForm?: string;

  /**
   * 승강기세부형식
   */
  elvtrDetailForm?: string;

  /**
   * 승강기종류
   */
  elvtrKindNm?: string;

  /**
   * 설치장소
   */
  installationPlace?: string;

  /**
   * 승강기모델
   */
  elvtrModel?: string;

  /**
   * 제조업체
   */
  mnfcturCpnyNm?: string;

  /**
   * 유지관리업체
   */
  mntCpnyCd?: string;

  /**
   * 최초설치일자
   */
  frstInstallationDe?: string;

  /**
   * 설치일자
   */
  installationDe?: string;

  /**
   * 접수일자
   */
  recptnDe?: string;

  /**
   * 고객안내번호
   */
  cstmrGuidanceNo?: string;

  /**
   * 검사종류
   */
  inspctKindNm?: string;

  /**
   * 접수검사대수
   */
  inspctCnt?: string;

  /**
   * 총검사수수료
   */
  inspctFee?: string;

  /**
   * 검사기관
   */
  inspctCompanyNm?: string;

  /**
   * 검사예정일자
   */
  asignDe?: string;

  /**
   * 검사예정시간
   */
  arrivalTime?: string;

  /**
   * 검사일자
   */
  inspctDe?: string;

  /**
   * 판정결과
   */
  inspctResult?: string;

  /**
   * 검사자1
   */
  mainInspctrNm?: string;

  /**
   * 검사자2
   */
  subInspctrNm?: string;

  /**
   * 확인검사일자
   */
  cnfinspctDe?: string;

  /**
   * 확인검사판정결과
   */
  cnfinspctResult?: string;

  /**
   * 확인검사자1
   */
  cnfmainInspctrNm?: string;

  /**
   * 확인검사자2
   */
  cnfsubInspctrNm?: string;

  /**
   * 보완기간(from)
   */
  conditionalBeDt?: string;

  /**
   * 보완기간(to)
   */
  conditionalEnDt?: string;

  /**
   * 검사유효기간(from)
   */
  applcFromDt?: string;

  /**
   * 검사유효기간(to)
   */
  applcToDt?: string;

  /**
   * 부적합검색KEY
   */
  failCd1?: string;

  /**
   * 부적합검색KEY2
   */
  cnfinspctFailCd2?: string;

  /**
   * 접수번호
   */
  recptnMgtNo?: string;
}

/**
 * 승강기 검사신청결과 응답
 */
export interface ElevatorInspectResultResponse extends PaginationInfo {
  resultCode: string;
  resultMsg: string;
  items: ElevatorInspectResultInfo[];
}
