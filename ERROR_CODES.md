# Korea Public SDK - Error Codes Reference

이 문서는 Korea Public SDK에서 사용되는 모든 에러 코드의 상세 설명과 해결 방법을 제공합니다.

## 에러 코드 분류 체계 (신규 개선)

에러 코드는 3자리 숫자로 구성되어 있으며, **플랫폼별로 앞자리가 구분**됩니다:

- **1xx**: 공통 에러 (모든 플랫폼에서 발생할 수 있는 에러)
- **2xx**: KOELSA (한국승강기안전공단) 관련 에러
- **3xx**: KMA (기상청) 관련 에러 (향후 지원)
- **4xx**: KOTSA (교통안전공단) 관련 에러 (향후 지원)
- **5xx-9xx**: 향후 추가될 기관들을 위한 예약 영역

## 에러 파일 구조

플랫폼별로 체계적으로 정리된 에러 파일 구조:

```
src/errors/
├── base.ts       # 기본 에러 클래스와 ErrorCodes enum
├── common.ts     # 공통 에러들 (1xx 범위)
├── koelsa.ts     # KOELSA 관련 에러들 (2xx 범위)
├── kma.ts        # KMA 관련 에러들 (3xx 범위)
├── kotsa.ts      # KOTSA 관련 에러들 (4xx 범위)
└── index.ts      # 중앙 집중식 export
```

### 각 파일별 역할

- **`base.ts`**: `KoreaPublicSDKError` 기본 클래스, `ErrorCodes` enum, 유틸리티 함수들
- **`common.ts`**: 모든 플랫폼에서 공통으로 사용되는 에러들
- **`koelsa.ts`**: 승강기안전공단 API 관련 전용 에러들
- **`kma.ts`**: 기상청 API 관련 전용 에러들 (향후 구현)
- **`kotsa.ts`**: 교통안전공단 API 관련 전용 에러들 (향후 구현)

## 1xx - 공통 에러

### 100 - UNKNOWN_ERROR

- **설명**: 알 수 없는 에러가 발생함
- **해결방법**: 에러 로그를 확인하고 지원팀에 문의하세요.

### 101-120: 유효성 검증 에러

#### 101 - VALIDATION_ERROR

- **설명**: 일반적인 유효성 검증 실패
- **해결방법**: 입력 매개변수를 확인하고 올바른 형식으로 수정하세요.

#### 102 - INVALID_PARAMETER

- **설명**: 잘못된 매개변수가 제공됨
- **해결방법**: API 문서를 참조하여 올바른 매개변수 형식을 확인하세요.

#### 103 - MISSING_REQUIRED_FIELD

- **설명**: 필수 필드가 누락됨
- **해결방법**: API 요구사항을 확인하고 필수 필드를 추가하세요.

#### 104 - INVALID_DATE_FORMAT

- **설명**: 날짜 형식이 잘못됨 (YYYYMMDD 형식 필요)
- **해결방법**: 날짜를 'YYYYMMDD' 형식으로 변경하세요. 예: '20240101'

#### 105 - INVALID_PAGE_NUMBER

- **설명**: 잘못된 페이지 번호
- **해결방법**: 페이지 번호는 1 이상의 정수여야 합니다.

#### 106 - INVALID_SERVICE_KEY

- **설명**: 잘못된 서비스 키
- **해결방법**: 공공데이터포털에서 발급받은 올바른 서비스 키를 사용하세요.

### 121-140: API 에러

#### 121 - API_ERROR

- **설명**: 일반적인 API 요청 실패
- **해결방법**: API 엔드포인트와 매개변수를 확인하세요.

#### 122 - API_REQUEST_FAILED

- **설명**: API 요청 전송 실패
- **해결방법**: 네트워크 연결을 확인하고 재시도하세요.

#### 123 - API_RESPONSE_ERROR

- **설명**: API가 에러 응답을 반환함
- **해결방법**: API 응답 메시지를 확인하고 요청 매개변수를 수정하세요.

#### 124 - INVALID_API_RESPONSE

- **설명**: 잘못된 API 응답 형식
- **해결방법**: API 서비스 상태를 확인하고 잠시 후 재시도하세요.

#### 125 - API_TIMEOUT

- **설명**: API 요청 시간 초과
- **해결방법**: 더 큰 timeout 값으로 설정하거나 요청을 단순화하세요.

### 141-160: 네트워크 에러

#### 141 - NETWORK_ERROR

- **설명**: 일반적인 네트워크 연결 실패
- **해결방법**: 인터넷 연결을 확인하고 재시도하세요.

#### 142 - CONNECTION_FAILED

- **설명**: 서버 연결 실패
- **해결방법**: 방화벽 설정을 확인하고 서버 상태를 점검하세요.

#### 143 - DNS_RESOLUTION_FAILED

- **설명**: DNS 해석 실패
- **해결방법**: DNS 설정을 확인하고 다른 네트워크에서 시도해보세요.

#### 144 - SSL_ERROR

- **설명**: SSL/TLS 연결 에러
- **해결방법**: SSL 인증서 문제일 수 있습니다. 네트워크 관리자에게 문의하세요.

### 161-180: 설정 에러

#### 161 - CONFIGURATION_ERROR

- **설명**: 일반적인 설정 에러
- **해결방법**: 클라이언트 설정을 확인하고 수정하세요.

#### 162 - INVALID_BASE_URL

- **설명**: 잘못된 기본 URL
- **해결방법**: 올바른 API 기본 URL을 사용하세요.

#### 163 - INVALID_TIMEOUT

- **설명**: 잘못된 타임아웃 값
- **해결방법**: 양수 값의 타임아웃을 설정하세요 (밀리초 단위).

#### 164 - MISSING_CONFIGURATION

- **설명**: 필수 설정이 누락됨
- **해결방법**: 모든 필수 설정값을 제공하세요.

### 181-190: 서비스 가용성 에러

#### 181 - SERVICE_UNAVAILABLE

- **설명**: 서비스가 현재 사용 불가능
- **해결방법**: 잠시 후 재시도하거나 서비스 상태를 확인하세요.

#### 182 - SERVICE_MAINTENANCE

- **설명**: 서비스 점검 중
- **해결방법**: 점검 완료 후 재시도하세요.

#### 183 - SERVICE_DEPRECATED

- **설명**: 서비스가 더 이상 지원되지 않음
- **해결방법**: 최신 버전의 API를 사용하세요.

### 191-199: 사용량 제한 에러

#### 191 - RATE_LIMIT_EXCEEDED

- **설명**: 요청 빈도 제한 초과
- **해결방법**: 요청 간격을 늘리고 잠시 후 재시도하세요.

#### 192 - QUOTA_EXCEEDED

- **설명**: API 할당량 초과
- **해결방법**: 할당량이 재설정될 때까지 기다리거나 추가 할당량을 요청하세요.

#### 193 - DAILY_LIMIT_EXCEEDED

- **설명**: 일일 요청 한도 초과
- **해결방법**: 다음 날까지 기다리거나 추가 할당량을 요청하세요.

## 2xx - KOELSA (한국승강기안전공단) 관련 에러

> **파일 위치**: `src/errors/koelsa.ts`

### 200 - KOELSA_SERVICE_ERROR

- **설명**: KOELSA 서비스 일반 에러
- **해결방법**: KOELSA 서비스 상태를 확인하고 잠시 후 재시도하세요.

### 201 - ELEVATOR_NOT_FOUND

- **설명**: 해당 승강기를 찾을 수 없음
- **해결방법**: 승강기 번호를 확인하고 올바른 번호를 사용하세요.

### 202 - INVALID_ELEVATOR_NUMBER

- **설명**: 잘못된 승강기 번호 형식
- **해결방법**: 올바른 승강기 번호 형식을 사용하세요.

### 203 - INVALID_INSPECTION_DATA

- **설명**: 잘못된 검사 데이터
- **해결방법**: 검사 데이터 형식을 확인하고 필수 필드를 포함시키세요.

### 204 - INVALID_MANAGEMENT_CODE

- **설명**: 잘못된 관리번호 형식
- **해결방법**: 올바른 관리번호 형식을 사용하세요.

### 205 - INSPECTION_DATA_NOT_AVAILABLE

- **설명**: 검사 데이터를 사용할 수 없음
- **해결방법**: 다른 날짜 범위로 시도하거나 나중에 다시 시도하세요.

### 206 - ELEVATOR_INSTALLATION_NOT_FOUND

- **설명**: 승강기 설치정보를 찾을 수 없음
- **해결방법**: 설치일자 범위를 넓혀서 다시 검색해보세요.

### 207 - INVALID_ELEVATOR_TYPE

- **설명**: 잘못된 승강기 유형
- **해결방법**: 지원되는 승강기 유형을 확인하고 올바른 값을 사용하세요.

### 208 - MAINTENANCE_RECORD_NOT_FOUND

- **설명**: 유지보수 기록을 찾을 수 없음
- **해결방법**: 다른 날짜 범위나 검색 조건으로 시도해보세요.

## 3xx - KMA (기상청) 관련 에러 (향후 지원)

> **파일 위치**: `src/errors/kma.ts`

### 300 - KMA_SERVICE_ERROR

- **설명**: KMA 서비스 에러
- **해결방법**: KMA 서비스 상태를 확인하세요.

### 301 - WEATHER_DATA_NOT_FOUND

- **설명**: 날씨 데이터를 찾을 수 없음
- **해결방법**: 올바른 지역 코드와 날짜를 사용하세요.

### 302 - INVALID_LOCATION_CODE

- **설명**: 잘못된 지역 코드
- **해결방법**: 유효한 지역 코드를 사용하세요.

### 303 - INVALID_WEATHER_DATE

- **설명**: 잘못된 날씨 조회 날짜
- **해결방법**: 올바른 날짜 형식과 범위를 사용하세요.

### 304 - FORECAST_NOT_AVAILABLE

- **설명**: 예보 데이터를 사용할 수 없음
- **해결방법**: 다른 시간이나 지역으로 시도해보세요.

### 305 - WEATHER_STATION_NOT_FOUND

- **설명**: 기상관측소를 찾을 수 없음
- **해결방법**: 올바른 관측소 코드를 사용하세요.

## 4xx - KOTSA (교통안전공단) 관련 에러 (향후 지원)

> **파일 위치**: `src/errors/kotsa.ts`

### 400 - KOTSA_SERVICE_ERROR

- **설명**: KOTSA 서비스 에러
- **해결방법**: KOTSA 서비스 상태를 확인하세요.

### 401 - VEHICLE_NOT_FOUND

- **설명**: 차량을 찾을 수 없음
- **해결방법**: 올바른 차량 번호를 사용하세요.

### 402 - INVALID_VEHICLE_NUMBER

- **설명**: 잘못된 차량 번호 형식
- **해결방법**: 올바른 차량 번호 형식을 사용하세요.

### 403 - TRANSPORT_DATA_NOT_AVAILABLE

- **설명**: 교통 데이터를 사용할 수 없음
- **해결방법**: 다른 조건이나 시간으로 시도해보세요.

### 404 - INVALID_ROUTE_CODE

- **설명**: 잘못된 노선 코드
- **해결방법**: 유효한 노선 코드를 사용하세요.

### 405 - BUS_STOP_NOT_FOUND

- **설명**: 버스정류장을 찾을 수 없음
- **해결방법**: 올바른 정류장 ID나 좌표를 사용하세요.

## 사용 예시

```typescript
import {
  KOELSAClient,
  ErrorCodes,
  getErrorMessage,
  getErrorCategory,
  isCommonError,
  isPlatformError,
  // Platform-specific errors
  ElevatorNotFoundError,
  WeatherStationNotFoundError,
  VehicleNotFoundError,
} from "korea-public-sdk";

try {
  const client = new KOELSAClient("your-service-key");
  const result = await client.installation.getInstallationList(params);
} catch (error) {
  // 플랫폼별 에러 타입으로 처리
  if (error instanceof ElevatorNotFoundError) {
    console.log(`KOELSA: Elevator ${error.elevatorNo} not found`);
  } else if (error instanceof WeatherStationNotFoundError) {
    console.log(`KMA: Weather station ${error.stationId} not found`);
  } else if (error instanceof VehicleNotFoundError) {
    console.log(`KOTSA: Vehicle ${error.vehicleNumber} not found`);
  }

  // 에러 코드별 처리
  switch (error.code) {
    case ErrorCodes.ELEVATOR_NOT_FOUND:
      console.log("승강기를 찾을 수 없습니다.");
      break;
    case ErrorCodes.RATE_LIMIT_EXCEEDED:
      console.log("요청 한도를 초과했습니다. 잠시 후 재시도하세요.");
      break;
    case ErrorCodes.INVALID_DATE_FORMAT:
      console.log("날짜 형식이 잘못되었습니다. YYYYMMDD 형식을 사용하세요.");
      break;
    default:
      console.log(`에러 ${error.code}: ${getErrorMessage(error.code)}`);
  }

  // 에러 카테고리 확인
  console.log("에러 카테고리:", getErrorCategory(error.code));

  // 공통 에러인지 확인
  if (isCommonError(error.code)) {
    console.log("모든 플랫폼에서 발생할 수 있는 공통 에러입니다.");
  }

  // 플랫폼 특화 에러인지 확인
  if (isPlatformError(error.code)) {
    console.log("특정 플랫폼에서만 발생하는 에러입니다.");
  }
}
```

## 에러 처리 모범 사례

1. **에러 코드 기반 처리**: switch문을 사용하여 각 에러 코드에 맞는 처리 로직을 구현하세요.
2. **플랫폼별 에러 타입 활용**: `instanceof`를 사용하여 플랫폼별 특화된 에러 처리를 구현하세요.
3. **카테고리별 처리**: `getErrorCategory()`를 사용하여 플랫폼별 공통 처리를 구현하세요.
4. **재시도 로직**: 일시적인 에러(181-199)에 대해서는 지수 백오프와 함께 재시도를 구현하세요.
5. **로깅**: 에러 발생 시 에러 코드, 카테고리, 발생 시간 등을 포함한 충분한 정보를 로그에 기록하세요.
6. **사용자 친화적 메시지**: `getErrorMessage()`를 활용하여 사용자가 이해하기 쉬운 메시지를 제공하세요.

## 새로운 플랫폼 추가 시 가이드

새로운 정부 기관 API를 추가할 때는 다음 단계를 따르세요:

1. **에러 코드 범위 할당**: 5xx-9xx 범위에서 새로운 백의 자리 선택
2. **에러 파일 생성**: `src/errors/[agency].ts` 파일 생성
3. **에러 클래스 구현**: 해당 기관 전용 에러 클래스들 구현
4. **ErrorCodes enum 확장**: `base.ts`에 새로운 에러 코드들 추가
5. **Export 업데이트**: `index.ts`에서 새로운 에러들을 export
6. **문서 업데이트**: 이 문서에 새로운 에러 코드들 추가

## 확장성

현재 에러 코드 체계는 다음과 같이 확장됩니다:

- **1xx**: 모든 기관에서 공통으로 사용할 수 있는 에러 (99개)
- **2xx**: KOELSA 전용 에러 (99개)
- **3xx**: KMA 전용 에러 (99개)
- **4xx**: KOTSA 전용 에러 (99개)
- **5xx-9xx**: 향후 추가될 기관들을 위한 예약 영역 (500개)

각 기관마다 99개의 에러 코드를 사용할 수 있어 충분한 확장성을 제공합니다.

## 추가 도움말

에러 관련 추가 도움이 필요하시면 다음을 참조하세요:

- [사용 가이드](./docs/USAGE_GUIDE.md)
- [GitHub Issues](https://github.com/your-repo/issues)
- [공공데이터포털 문의](https://www.data.go.kr)
