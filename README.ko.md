# Korea Public SDK

[![npm version](https://img.shields.io/npm/v/korea-public-sdk)](https://www.npmjs.com/package/korea-public-sdk)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-16.0+-green.svg)](https://nodejs.org/)

**한국 공공데이터포털 API를 위한 전문적인 TypeScript SDK**

Korea Public SDK는 한국 정부기관 API에 대한 포괄적이고 타입 안전한 인터페이스를 제공합니다. 현대적인 TypeScript로 구축되었으며 엔터프라이즈급 애플리케이션을 위해 설계되어 강력한 오류 처리, 포괄적인 검증, 원활한 통합 기능을 제공합니다.

## 목차

- [특징](#특징)
- [지원 기관](#지원-기관)
- [설치](#설치)
- [서비스 키 설정](#서비스-키-설정)
- [빠른 시작](#빠른-시작)
- [API 문서](#api-문서)
- [오류 처리](#오류-처리)
- [API 상태 모니터링](#api-상태-모니터링)
- [설정](#설정)
- [개발](#개발)
- [기여하기](#기여하기)
- [라이선스](#라이선스)

## 특징

- **타입 안전성**: 엄격한 타입 검사와 포괄적인 인터페이스 정의를 통한 완전한 TypeScript 지원
- **강력한 오류 처리**: 상세한 오류 코드와 컨텍스트 정보를 포함한 체계적인 오류 분류
- **입력 검증**: 자동 타입 변환과 정제를 포함한 포괄적인 매개변수 검증
- **모듈식 아키텍처**: 격리된 구현으로 여러 정부기관을 지원하는 확장 가능한 설계
- **성능 최적화**: 연결 풀링과 요청 최적화를 포함한 효율적인 HTTP 클라이언트
- **프로덕션 준비**: 포괄적인 테스트 커버리지와 엔터프라이즈급 안정성을 통한 철저한 검증
- **개발자 경험**: 풍부한 IntelliSense 지원, 상세한 문서화, 직관적인 API 설계

## 지원 기관

### 현재 지원 중

| 기관                        | 클라이언트     | 설명                       | API 수 |
| --------------------------- | -------------- | -------------------------- | ------ |
| 한국승강기안전공단 (KOELSA) | `KOELSAClient` | 승강기 설치 및 검사 데이터 | 2      |

### 지원 API

**KOELSA (한국승강기안전공단)**

- **승강기 설치정보**: 지역별 및 기간별 승강기 설치 데이터
- **승강기 검사결과**: 안전 검사 결과 및 유지보수 이력

## 설치

```bash
npm install korea-public-sdk
```

**요구사항:**

- Node.js 16.0 이상
- TypeScript 5.0 이상 (TypeScript 프로젝트의 경우)

## 서비스 키 설정

이 SDK를 사용하려면 공공데이터포털에서 서비스 키를 발급받아야 합니다.

### 1단계: 계정 등록

1. [공공데이터포털](https://www.data.go.kr) 방문
2. 무료 계정 생성
3. 본인인증 완료

### 2단계: API 신청

1. 사용하고자 하는 API 검색:
   - "승강기 설치정보" 검색 → 승강기 설치정보 서비스
   - "승강기 검사신청결과" 검색 → 승강기 검사신청결과 서비스
2. 각 API에 대해 "활용신청" 클릭
3. 신청서 작성:
   - 활용목적
   - 사용기간
   - 예상 트래픽량

### 3단계: 승인 과정

- 신청 후 1-2일 이내 승인 (영업일 기준)
- 승인 상태는 이메일로 통지
- 일부 API는 추가 서류가 필요할 수 있음

### 4단계: 서비스 키 확인

1. "마이페이지" → "개발계정" 이동
2. 승인된 API 목록에서 서비스 키 복사
3. 각 API별로 고유한 서비스 키 발급

### 사용 제한사항

- **호출 한도**: 대부분의 API는 일일 호출 한도가 있음 (보통 1,000-10,000회)
- **키 보안**: 공개 저장소에 서비스 키를 노출하지 말 것
- **이용약관**: 각 API별로 명시된 이용약관 준수

## 빠른 시작

### 1. 기본 구현

```typescript
import { KOELSAClient } from "korea-public-sdk";

// 서비스 키로 클라이언트 초기화
const client = new KOELSAClient("your-service-key");

// 승강기 설치정보 조회
const installations = await client.installation.getInstallationList({
  Installation_sdt: "20240101",
  Installation_edt: "20240131",
  pageNo: 1,
  numOfRows: 10,
});

// 승강기 검사결과 조회
const inspections = await client.inspection.getInspectionResults({
  elvtrmngno_mngno: "관리코드",
  pageNo: 1,
  numOfRows: 10,
});
```

### 2. 환경 변수 사용

```bash
# 서비스 키를 환경 변수로 설정
export KOELSA_SERVICE_KEY=your-service-key
```

```typescript
// 환경 변수 사용
const client = new KOELSAClient(process.env.KOELSA_SERVICE_KEY);
```

### 3. 오류 처리

```typescript
import { ApiError, ValidationError } from "korea-public-sdk";

try {
  const result = await client.installation.getInstallationList(params);
  console.log("성공:", result);
} catch (error) {
  if (error instanceof ValidationError) {
    console.error("검증 오류:", error.message);
  } else if (error instanceof ApiError) {
    console.error("API 요청 실패:", error.statusCode, error.message);
  } else {
    console.error("알 수 없는 오류:", error);
  }
}
```

## API 문서

### KOELSA (한국승강기안전공단)

#### 승강기 설치정보 서비스

```typescript
interface ElevatorInstallationParams {
  Installation_sdt: string; // 시작일 (YYYYMMDD 형식, 필수)
  Installation_edt: string; // 종료일 (YYYYMMDD 형식, 필수)
  elevator_no?: string; // 승강기번호 (선택사항)
  pageNo?: number; // 페이지 번호 (기본값: 1)
  numOfRows?: number; // 페이지당 건수 (기본값: 10, 최대: 1000)
}

const result = await client.installation.getInstallationList(params);
```

#### 승강기 검사결과 서비스

```typescript
interface ElevatorInspectResultParams {
  elvtrmngno_mngno: string; // 관리코드 (필수)
  pageNo?: number; // 페이지 번호 (기본값: 1)
  numOfRows?: number; // 페이지당 건수 (기본값: 10, 최대: 1000)
  _type?: "xml" | "json"; // 응답 형식 (기본값: xml)
}

const result = await client.inspection.getInspectionResults(params);
```

## 오류 처리

Korea Public SDK는 체계적인 오류 분류를 통한 포괄적인 오류 처리 시스템을 구현합니다.

### 오류 코드 분류

- **1xx**: 공통 오류 (모든 기관에서 공유)
- **2xx**: KOELSA 전용 오류
- **3xx-9xx**: 향후 기관을 위해 예약됨

### 오류 타입

```typescript
import {
  ErrorCodes,
  ValidationError,
  ApiError,
  NetworkError,
  ElevatorNotFoundError,
  KOELSAServiceError,
} from "korea-public-sdk";

try {
  const result = await client.installation.getInstallationList(params);
} catch (error) {
  switch (error.constructor) {
    case ValidationError:
      console.error("매개변수 검증 실패:", error.message);
      break;
    case ApiError:
      console.error("API 요청 실패:", error.statusCode, error.message);
      break;
    case NetworkError:
      console.error("네트워크 연결 실패:", error.message);
      break;
    case ElevatorNotFoundError:
      console.error("승강기를 찾을 수 없음:", error.elevatorNo);
      break;
    case KOELSAServiceError:
      console.error("KOELSA 서비스 오류:", error.serviceEndpoint);
      break;
  }
}
```

## API 상태 모니터링

공공 API는 예고 없이 변경될 수 있습니다. 간단한 테스트를 통해 API 상태를 확인할 수 있습니다.

### 자동 테스트

GitHub Actions를 통해 주간 단위로 API 상태를 자동 확인합니다.

```bash
# 수동 API 상태 확인
npm run test:integration

# 유닛 테스트만 실행
npm run test:unit
```

### 로컬 테스트 설정

```bash
# 환경 변수 설정
export KOELSA_SERVICE_KEY=your-service-key

# API 테스트 실행
npm run test:integration
```

테스트는 다음 항목들을 확인합니다:
- API 호출이 정상적으로 작동하는지
- 기본 응답 구조(`resultCode`, `resultMsg`)가 유지되는지
- SDK의 오류 처리가 올바르게 작동하는지

## 설정

### 클라이언트 설정

```typescript
import { KOELSAClient } from "korea-public-sdk";

const client = new KOELSAClient("your-service-key", {
  timeout: 30000,
  baseURL: "custom-base-url",
  headers: {
    "User-Agent": "MyApplication/1.0.0",
  },
});
```

### 상태 확인

```typescript
// KOELSA API 접근 가능 여부 확인
const isHealthy = await client.healthCheck();
console.log("서비스 상태:", isHealthy);

// 클라이언트 정보 확인
const info = client.getClientInfo();
console.log("제공자:", info.provider.name);
console.log("사용 가능한 서비스:", info.services);
```

## 개발

### 개발 환경 설정

```bash
git clone https://github.com/your-username/korea-public-sdk.git
cd korea-public-sdk
npm install
npm run build
npm test
```

### 빌드 스크립트

```bash
npm run build          # TypeScript 컴파일
npm run test           # 모든 테스트 실행
npm run test:unit      # 유닛 테스트만 실행
npm run test:integration # 통합 테스트 실행
npm run test:coverage  # 커버리지와 함께 테스트 실행
npm run lint           # ESLint 실행
npm run format         # Prettier로 코드 포맷팅
```

### 테스트

```bash
# 모든 테스트 실행
npm test

# 통합 테스트 실행 (서비스 키 필요)
KOELSA_SERVICE_KEY=your-key npm run test:integration
```

## 향후 로드맵

다음 정부기관들이 향후 구현 예정입니다:

### 기상청 (KMA)

```typescript
// 계획된 구현
const kmaClient = new KMAClient("service-key");
const weather = await kmaClient.weather.getCurrentWeather(params);
const forecast = await kmaClient.forecast.getForecast(params);
```

### 교통안전공단 (KOTSA)

```typescript
// 계획된 구현
const kotsaClient = new KOTSAClient("service-key");
const vehicles = await kotsaClient.vehicle.getVehicleInfo(params);
const recalls = await kotsaClient.recall.getRecallList(params);
```

### 추가 기관

목표: 다음을 포함한 300+ 정부기관:

- 환경부 (MOE)
- 국토교통부 (MOLIT)
- 통계청 (KOSIS)
- 정보화진흥원 (NIA)

## 기여하기

Korea Public SDK에 대한 기여를 환영합니다. 개발 프로세스, 코딩 표준, 제출 가이드라인에 대한 자세한 내용은 [기여 가이드](./CONTRIBUTING.md)를 읽어보세요.

### 개발 워크플로

1. 리포지토리를 포크하세요
2. 기능 브랜치를 생성하세요 (`git checkout -b feature/new-agency`)
3. 포괄적인 테스트와 함께 변경사항을 구현하세요
4. 모든 테스트가 통과하고 코드가 품질 표준을 충족하는지 확인하세요
5. 상세한 설명과 함께 풀 리퀘스트를 제출하세요

## 라이선스

이 프로젝트는 MIT 라이선스 하에 라이선스됩니다 - 자세한 내용은 [LICENSE](./LICENSE) 파일을 참조하세요.

## 리소스

- **문서**: [사용 가이드](./docs/USAGE_GUIDE.md)
- **API 참조**: [오류 코드](./ERROR_CODES.md)
- **이슈**: [GitHub 이슈](https://github.com/your-username/korea-public-sdk/issues)
- **공공데이터포털**: [data.go.kr](https://www.data.go.kr)

## 면책조항

이 프로젝트는 독립적인 구현이며 한국 정부기관과 공식적으로 제휴되어 있지 않습니다. 해당 정부 API의 서비스 약관에 따라 사용하세요.
