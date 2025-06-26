# Error Codes Reference

Korea Public SDK에서 사용되는 모든 에러 코드의 완전한 참조 가이드입니다.

## 에러 코드 분류 체계

```
1xx - 공통 에러 (모든 기관에서 공통으로 사용)
2xx - KOELSA (한국승강기안전공단) 전용 에러
3xx-9xx - 향후 기관을 위해 예약됨
```

## 📚 목차

- [1xx - 공통 에러](#1xx---공통-에러)
  - [101-120: 검증 에러](#101-120-검증-에러)
  - [121-140: API 에러](#121-140-api-에러)
  - [141-160: 네트워크 에러](#141-160-네트워크-에러)
  - [161-180: 설정 에러](#161-180-설정-에러)
  - [181-190: 서비스 가용성 에러](#181-190-서비스-가용성-에러)
  - [191-199: 사용량 제한 에러](#191-199-사용량-제한-에러)
- [2xx - KOELSA 에러](#2xx---koelsa-에러)
- [향후 확장 계획](#향후-확장-계획)

---

## 1xx - 공통 에러

모든 API 클라이언트에서 공통으로 발생할 수 있는 에러들입니다. **파일 위치**: `src/errors/common.ts`

### 기본 에러

| 코드 | 이름          | 설명                 | 해결 방법                     |
| ---- | ------------- | -------------------- | ----------------------------- |
| 100  | UNKNOWN_ERROR | 알 수 없는 에러 발생 | 로그를 확인하고 개발팀에 문의 |

### 101-120: 검증 에러

입력 값 검증과 관련된 에러들입니다.

| 코드 | 이름                   | 설명               | 해결 방법                                          |
| ---- | ---------------------- | ------------------ | -------------------------------------------------- |
| 101  | VALIDATION_ERROR       | 검증 실패          | 입력 값의 형식과 유효성을 확인하세요               |
| 102  | INVALID_PARAMETER      | 잘못된 매개변수    | 매개변수 타입과 값을 확인하세요                    |
| 103  | MISSING_REQUIRED_FIELD | 필수 필드 누락     | 모든 필수 필드가 제공되었는지 확인하세요           |
| 104  | INVALID_DATE_FORMAT    | 잘못된 날짜 형식   | YYYYMMDD 형식으로 날짜를 입력하세요                |
| 105  | INVALID_PAGE_NUMBER    | 잘못된 페이지 번호 | 1 이상의 정수를 입력하세요                         |
| 106  | INVALID_SERVICE_KEY    | 잘못된 서비스 키   | 공공데이터포털에서 발급받은 서비스 키를 확인하세요 |

### 121-140: API 에러

API 요청 및 응답과 관련된 에러들입니다.

| 코드 | 이름                 | 설명                 | 해결 방법                                     |
| ---- | -------------------- | -------------------- | --------------------------------------------- |
| 121  | API_ERROR            | API 요청 실패        | API 서버 상태를 확인하세요                    |
| 122  | API_REQUEST_FAILED   | API 요청 전송 실패   | 네트워크 연결을 확인하세요                    |
| 123  | API_RESPONSE_ERROR   | API 에러 응답        | API 응답의 에러 메시지를 확인하세요           |
| 124  | INVALID_API_RESPONSE | 잘못된 API 응답 형식 | API 응답 형식이 변경되었을 수 있습니다        |
| 125  | API_TIMEOUT          | API 요청 시간 초과   | 타임아웃 값을 늘리거나 나중에 다시 시도하세요 |

### 141-160: 네트워크 에러

네트워크 연결과 관련된 에러들입니다.

| 코드 | 이름                  | 설명               | 해결 방법                     |
| ---- | --------------------- | ------------------ | ----------------------------- |
| 141  | NETWORK_ERROR         | 네트워크 연결 실패 | 인터넷 연결을 확인하세요      |
| 142  | CONNECTION_FAILED     | 서버 연결 실패     | 서버 주소와 포트를 확인하세요 |
| 143  | DNS_RESOLUTION_FAILED | DNS 해석 실패      | DNS 설정을 확인하세요         |
| 144  | SSL_ERROR             | SSL/TLS 연결 에러  | 인증서 설정을 확인하세요      |

### 161-180: 설정 에러

클라이언트 설정과 관련된 에러들입니다.

| 코드 | 이름                  | 설명               | 해결 방법                                |
| ---- | --------------------- | ------------------ | ---------------------------------------- |
| 161  | CONFIGURATION_ERROR   | 설정 에러          | 클라이언트 설정을 확인하세요             |
| 162  | INVALID_BASE_URL      | 잘못된 기본 URL    | 올바른 URL 형식인지 확인하세요           |
| 163  | INVALID_TIMEOUT       | 잘못된 타임아웃 값 | 양수 값을 입력하세요                     |
| 164  | MISSING_CONFIGURATION | 필수 설정 누락     | 모든 필수 설정이 제공되었는지 확인하세요 |

### 181-190: 서비스 가용성 에러

API 서비스의 가용성과 관련된 에러들입니다.

| 코드 | 이름                | 설명             | 해결 방법                    |
| ---- | ------------------- | ---------------- | ---------------------------- |
| 181  | SERVICE_UNAVAILABLE | 서비스 이용 불가 | 잠시 후 다시 시도하세요      |
| 182  | SERVICE_MAINTENANCE | 서비스 점검 중   | 점검 완료 후 다시 시도하세요 |
| 183  | SERVICE_DEPRECATED  | 서비스 종료됨    | 새로운 API 버전을 사용하세요 |

### 191-199: 사용량 제한 에러

API 사용량 제한과 관련된 에러들입니다.

| 코드 | 이름                 | 설명                | 해결 방법                                |
| ---- | -------------------- | ------------------- | ---------------------------------------- |
| 191  | RATE_LIMIT_EXCEEDED  | 요청 속도 제한 초과 | 요청 간격을 늘리세요                     |
| 192  | QUOTA_EXCEEDED       | API 할당량 초과     | 할당량을 늘리거나 다음 주기를 기다리세요 |
| 193  | DAILY_LIMIT_EXCEEDED | 일일 요청 한도 초과 | 내일 다시 시도하세요                     |

---

## 2xx - KOELSA 에러

한국승강기안전공단(KOELSA) API 전용 에러들입니다. **파일 위치**: `src/errors/koelsa.ts`

### 기본 KOELSA 에러

| 코드 | 이름                 | 설명               | 해결 방법                       |
| ---- | -------------------- | ------------------ | ------------------------------- |
| 200  | KOELSA_SERVICE_ERROR | KOELSA 서비스 에러 | KOELSA 서비스 상태를 확인하세요 |

### 승강기 관련 에러

| 코드 | 이름                            | 설명                            | 해결 방법                              |
| ---- | ------------------------------- | ------------------------------- | -------------------------------------- |
| 201  | ELEVATOR_NOT_FOUND              | 승강기를 찾을 수 없음           | 승강기 번호를 확인하세요               |
| 202  | INVALID_ELEVATOR_NUMBER         | 잘못된 승강기 번호 형식         | 올바른 승강기 번호 형식인지 확인하세요 |
| 206  | ELEVATOR_INSTALLATION_NOT_FOUND | 승강기 설치 정보를 찾을 수 없음 | 설치 날짜나 지역을 확인하세요          |
| 207  | INVALID_ELEVATOR_TYPE           | 잘못된 승강기 유형              | 지원되는 승강기 유형인지 확인하세요    |

### 검사 관련 에러

| 코드 | 이름                          | 설명                         | 해결 방법                       |
| ---- | ----------------------------- | ---------------------------- | ------------------------------- |
| 203  | INVALID_INSPECTION_DATA       | 잘못된 검사 데이터           | 검사 데이터 형식을 확인하세요   |
| 205  | INSPECTION_DATA_NOT_AVAILABLE | 검사 데이터를 사용할 수 없음 | 다른 날짜나 승강기로 시도하세요 |

### 관리 관련 에러

| 코드 | 이름                         | 설명                         | 해결 방법                       |
| ---- | ---------------------------- | ---------------------------- | ------------------------------- |
| 204  | INVALID_MANAGEMENT_CODE      | 잘못된 관리 코드             | 올바른 관리 코드인지 확인하세요 |
| 208  | MAINTENANCE_RECORD_NOT_FOUND | 유지보수 기록을 찾을 수 없음 | 날짜나 승강기 번호를 확인하세요 |

---

## 향후 확장 계획

### 3xx - 기상청 (KMA) 에러 (개발 예정)

```typescript
// 향후 추가될 예정:
// 300: KMA_SERVICE_ERROR
// 301: WEATHER_DATA_NOT_FOUND
// 302: INVALID_LOCATION_CODE
// ... 기타 기상청 관련 에러들
```

### 4xx - 교통안전공단 (KOTSA) 에러 (개발 예정)

```typescript
// 향후 추가될 예정:
// 400: KOTSA_SERVICE_ERROR
// 401: VEHICLE_NOT_FOUND
// 402: INVALID_VEHICLE_NUMBER
// ... 기타 교통안전공단 관련 에러들
```

### 5xx-9xx - 기타 기관들 (개발 예정)

```typescript
// 향후 300+ 정부기관 지원 예정
// 5xx: 환경부 (MOE)
// 6xx: 국토교통부 (MOLIT)
// 7xx: 통계청 (KOSIS)
// 8xx: 정보화진흥원 (NIA)
// 9xx: 기타 기관들
```

---

## 사용 예시

### TypeScript/JavaScript

```typescript
import { ErrorCodes, getErrorMessage, getErrorCategory } from "korea-public-sdk";

try {
  // API 호출
  const result = await client.someMethod();
} catch (error) {
  if (error.code === ErrorCodes.ELEVATOR_NOT_FOUND) {
    console.log("승강기를 찾을 수 없습니다:", getErrorMessage(error.code));
    console.log("카테고리:", getErrorCategory(error.code)); // "KOELSA Error"
  }
}
```

### 에러 정보 확인

```typescript
import { isCommonError, isPlatformError } from "korea-public-sdk";

if (isCommonError(error.code)) {
  console.log("모든 기관에서 공통으로 발생하는 에러입니다");
} else if (isPlatformError(error.code)) {
  console.log("특정 기관의 전용 에러입니다");
}
```

---

## 문의

에러 코드에 대한 추가 정보나 새로운 에러 코드 제안은
[GitHub Issues](https://github.com/your-repo/korea-public-sdk/issues)를 통해 문의해 주세요.
