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
- [빠른 시작](#빠른-시작)
- [API 문서](#api-문서)
- [오류 처리](#오류-처리)
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

## 빠른 시작

### 1. 서비스 키 등록

[공공데이터포털](https://www.data.go.kr)에서 서비스 키를 발급받으세요:

1. data.go.kr에서 계정을 등록하세요
2. 원하는 서비스에 대한 API 접근을 신청하세요
3. 애플리케이션용 서비스 키를 발급받으세요

### 2. 기본 구현

```typescript
import { KOELSAClient } from "korea-public-sdk";

// 클라이언트 초기화
const client = new KOELSAClient("your-service-key");

// 승강기 설치정보 조회
const installations = await client.installation.getInstallationList({
  siDo: "서울특별시",
  siGunGu: "강남구",
  pageNo: 1,
  numOfRows: 10,
});

// 승강기 검사결과 조회
const inspections = await client.inspection.getInspectionResults({
  siDo: "서울특별시",
  elevatorNo: "EL123456789",
  pageNo: 1,
  numOfRows: 10,
});
```

### 3. 편의 함수

```typescript
import { createKOELSAClient } from "korea-public-sdk";

const client = createKOELSAClient("your-service-key");
const result = await client.installation.getInstallationList(params);
```

## API 문서

### KOELSA (한국승강기안전공단)

#### 승강기 설치정보 서비스

```typescript
interface ElevatorInstallationParams {
  siDo?: string; // 시도명 (선택사항)
  siGunGu?: string; // 시군구명 (선택사항)
  installStartDate?: string; // 설치시작일 (선택사항, YYYYMMDD)
  installEndDate?: string; // 설치종료일 (선택사항, YYYYMMDD)
  pageNo?: number; // 페이지 번호 (기본값: 1)
  numOfRows?: number; // 페이지당 건수 (기본값: 10, 최대: 1000)
}

const result = await client.installation.getInstallationList(params);
```

#### 승강기 검사결과 서비스

```typescript
interface ElevatorInspectResultParams {
  siDo?: string; // 시도명 (선택사항)
  siGunGu?: string; // 시군구명 (선택사항)
  elevatorNo?: string; // 승강기번호 (선택사항)
  inspectStartDate?: string; // 검사시작일 (선택사항, YYYYMMDD)
  inspectEndDate?: string; // 검사종료일 (선택사항, YYYYMMDD)
  pageNo?: number; // 페이지 번호 (기본값: 1)
  numOfRows?: number; // 페이지당 건수 (기본값: 10, 최대: 1000)
}

const result = await client.inspection.getInspectionResults(params);
```

## 오류 처리

Korea Public SDK는 체계적인 오류 분류를 통한 포괄적인 오류 처리 시스템을 구현합니다.

### 오류 코드 분류

- **1xx**: 공통 오류 (모든 기관에서 공유)
- **2xx**: KOELSA 전용 오류
- **3xx-9xx**: 향후 기관을 위해 예약됨

### 오류 처리 구현

```typescript
import {
  ErrorCodes,
  ValidationError,
  ElevatorNotFoundError,
  getErrorMessage,
  getErrorCategory,
  isCommonError,
} from "korea-public-sdk";

try {
  const result = await client.installation.getInstallationList(params);
} catch (error) {
  // 타입 기반 오류 처리
  if (error instanceof ValidationError) {
    console.error("검증 실패:", error.message);
  } else if (error instanceof ElevatorNotFoundError) {
    console.error("승강기를 찾을 수 없음:", error.elevatorNo);
  }

  // 코드 기반 오류 처리
  switch (error.code) {
    case ErrorCodes.INVALID_SERVICE_KEY:
      console.error("잘못된 서비스 키가 제공됨");
      break;
    case ErrorCodes.RATE_LIMIT_EXCEEDED:
      console.error("요청 한도 초과, 나중에 다시 시도하세요");
      break;
    case ErrorCodes.ELEVATOR_NOT_FOUND:
      console.error("지정된 승강기를 찾을 수 없음");
      break;
  }

  // 오류 분류
  if (isCommonError(error.code)) {
    console.log("공통 오류:", getErrorMessage(error.code));
    console.log("카테고리:", getErrorCategory(error.code));
  }
}
```

### 오류 정보 유틸리티

```typescript
import {
  getErrorMessage,
  getErrorCategory,
  isCommonError,
  isPlatformError,
} from "korea-public-sdk";

// 사람이 읽을 수 있는 오류 메시지 가져오기
const message = getErrorMessage(ErrorCodes.ELEVATOR_NOT_FOUND);

// 오류 분류
const category = getErrorCategory(error.code);

// 오류 범위 확인
if (isCommonError(error.code)) {
  // 모든 기관에 영향을 주는 공통 오류 처리
} else if (isPlatformError(error.code)) {
  // 기관별 특화 오류 처리
}
```

포괄적인 오류 코드 문서는 [ERROR_CODES.md](./ERROR_CODES.md)를 참조하세요.

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

### 환경 변수

```bash
# 선택사항: 서비스 키를 환경 변수로 설정
export KOREA_PUBLIC_API_KEY=your-service-key
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
npm run test           # 테스트 스위트 실행
npm run test:coverage  # 커버리지와 함께 테스트 실행
npm run lint           # ESLint 실행
npm run format         # Prettier로 코드 포맷팅
```

### 테스트

SDK는 포괄적인 테스트 커버리지를 포함합니다:

```bash
# 모든 테스트 실행
npm test

# 특정 테스트 카테고리 실행
npm test tests/errors/
npm test tests/utils/
npm test tests/clients/
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
