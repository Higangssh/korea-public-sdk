# Korea Public SDK

_[English](README.md)로 읽기_

한국 공공 API 접근을 위한 포괄적인 TypeScript SDK입니다. 한국승강기안전공단(KOELSA)부터 시작하여 다른 정부 기관으로의 확장을 염두에 두고 설계되었습니다.

## 개요

Korea Public SDK는 한국 공공 데이터 API와 상호작용하기 위한 통합된 타입 안전 인터페이스를 제공합니다. 현대적인 TypeScript로 구축되어 강력한 에러 처리, 포괄적인 검증, 그리고 뛰어난 개발자 경험을 제공합니다.

### 주요 기능

- **타입 안전성**: 엄격한 타입 검사를 지원하는 완전한 TypeScript 지원
- **포괄적인 에러 처리**: 풍부한 컨텍스트 정보를 제공하는 상세한 에러 클래스
- **입력 검증**: 모든 API 호출에 대한 강력한 매개변수 검증
- **확장 가능한 아키텍처**: 추가 정부 기관을 위한 모듈형 설계
- **개발자 경험**: 풍부한 IntelliSense 지원과 명확한 문서화
- **프로덕션 준비**: 포괄적인 테스트 커버리지로 철저히 테스트됨

### 현재 지원하는 API

- **KOELSA (한국승강기안전공단)**: 승강기 설치 및 검사 데이터에 대한 완전한 접근

## 설치

```bash
npm install korea-public-sdk
```

## 빠른 시작

```typescript
import { createKOELSAClient } from "korea-public-sdk";

// 서비스키로 클라이언트 초기화
const client = createKOELSAClient("your-service-key-from-data.go.kr");

// 승강기 설치 정보 조회
try {
  const installations = await client.installation.getInstallationList({
    pageNo: 1,
    numOfRows: 10,
    Installation_sdt: "20240101",
    Installation_edt: "20241231",
  });

  console.log(`${installations.length}개의 설치 정보를 찾았습니다`);
} catch (error) {
  if (error instanceof ValidationError) {
    console.error("잘못된 매개변수:", error.field);
  } else if (error instanceof ElevatorNotFoundError) {
    console.error("승강기를 찾을 수 없습니다:", error.elevatorNo);
  }
}
```

## API 문서

### KOELSA 클라이언트

#### 설치 정보 서비스

```typescript
// 페이지네이션된 설치 목록 조회
const result = await client.installation.getInstallationListWithPagination({
  pageNo: 1,
  numOfRows: 100,
  Installation_sdt: "20240101",
  Installation_edt: "20241231",
  elevator_no: "optional-elevator-number",
});

// 특정 승강기 정보 조회
const elevator = await client.installation.getElevatorInstallationInfo(
  "ELEVATOR123",
  "20240101",
  "20241231"
);
```

#### 검사 결과 서비스

```typescript
// 검사 결과 조회
const inspections = await client.inspectResult.getInspectResultList({
  pageNo: 1,
  numOfRows: 50,
  elvtrmngno_mngno: "management-code",
});
```

## 에러 처리

SDK는 강력한 에러 처리를 위한 상세한 에러 정보를 제공합니다:

```typescript
import {
  ValidationError,
  ApiError,
  NetworkError,
  ElevatorNotFoundError,
} from "korea-public-sdk";

try {
  await client.installation.getInstallationList(params);
} catch (error) {
  if (error instanceof ValidationError) {
    // 검증 에러 처리
    console.log(`필드 검증 실패: ${error.field}`);
  } else if (error instanceof ElevatorNotFoundError) {
    // 승강기 관련 에러 처리
    console.log(`승강기 ${error.elevatorNo}를 찾을 수 없습니다`);
  } else if (error instanceof ApiError) {
    // API 에러 처리
    console.log(`API 에러 ${error.statusCode}: ${error.message}`);
  } else if (error instanceof NetworkError) {
    // 네트워크 에러 처리
    console.log("네트워크 에러:", error.originalError);
  }
}
```

## 설정

### 클라이언트 설정

```typescript
import { KOELSAClient } from "korea-public-sdk";

const client = new KOELSAClient("your-service-key", {
  timeout: 30000,
  headers: {
    "User-Agent": "MyApp/1.0.0",
  },
});
```

### 환경 변수

서비스키를 환경 변수로 설정할 수 있습니다:

```bash
export KOREA_PUBLIC_API_KEY=your-service-key
```

## 개발

### 사전 요구사항

- Node.js 16 이상
- TypeScript 5.0 이상

### 소스에서 빌드

```bash
git clone https://github.com/Higangssh/korea-public-sdk.git
cd korea-public-sdk
npm install
npm run build
```

### 테스트 실행

```bash
# 모든 테스트 실행
npm test

# 커버리지와 함께 테스트 실행
npm run test:coverage

# 특정 테스트 스위트 실행
npm test tests/utils/validation.test.ts
```

## 기여하기

기여를 환영합니다! 자세한 내용은 [기여 가이드](CONTRIBUTING.md)를 참조해주세요.

### 개발 설정

1. 저장소를 포크합니다
2. 기능 브랜치를 생성합니다
3. 테스트와 함께 변경사항을 작성합니다
4. 모든 테스트가 통과하는지 확인합니다
5. 풀 리퀘스트를 제출합니다

## API 키 요구사항

이 SDK를 사용하려면 한국 공공데이터포털에서 서비스키를 발급받아야 합니다:

1. [data.go.kr](https://www.data.go.kr) 방문
2. 계정 등록
3. 원하는 서비스의 API 접근 신청
4. 제공된 서비스키를 이 SDK와 함께 사용

## 향후 로드맵

- 기상청(KMA) API
- 교통안전공단(KOTSA) API
- 추가 정부 기관 API
- 향상된 캐싱 메커니즘
- 속도 제한 지원

## 라이선스

MIT License - 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.

## 지원

- **문서**: [사용 가이드](docs/USAGE_GUIDE.md)
- **이슈**: [GitHub Issues](https://github.com/Higangssh/korea-public-sdk/issues)
- **토론**: [GitHub Discussions](https://github.com/Higangssh/korea-public-sdk/discussions)

## 인정

이 프로젝트는 한국 공공 데이터 접근을 용이하게 하기 위해 구축되었으며, 한국 정부 기관과 공식적으로 제휴되어 있지 않습니다.
