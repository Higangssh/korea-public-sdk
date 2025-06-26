# Korea Public SDK

[![npm version](https://img.shields.io/npm/v/korea-public-sdk)](https://www.npmjs.com/package/korea-public-sdk)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-16.0+-green.svg)](https://nodejs.org/)

**Professional TypeScript SDK for Korean Public Data Portal APIs**

Korea Public SDK provides a comprehensive, type-safe interface for accessing Korean government agency APIs. Built with
modern TypeScript and designed for enterprise-grade applications, it offers robust error handling, comprehensive
validation, and seamless integration capabilities.

## Table of Contents

- [Features](#features)
- [Supported Agencies](#supported-agencies)
- [Installation](#installation)
- [Service Key Setup](#service-key-setup)
- [Quick Start](#quick-start)
- [API Documentation](#api-documentation)
- [Error Handling](#error-handling)
- [API Status Monitoring](#api-status-monitoring)
- [Configuration](#configuration)
- [Development](#development)
- [Contributing](#contributing)
- [License](#license)

## Features

- **Type Safety**: Complete TypeScript support with strict type checking and comprehensive interface definitions
- **Robust Error Handling**: Systematic error classification with detailed error codes and contextual information
- **Input Validation**: Comprehensive parameter validation with automatic type conversion and sanitization
- **Modular Architecture**: Extensible design supporting multiple government agencies with isolated implementations
- **Performance Optimized**: Efficient HTTP client with connection pooling and request optimization
- **Production Ready**: Thoroughly tested with comprehensive test coverage and enterprise-grade reliability
- **Developer Experience**: Rich IntelliSense support, detailed documentation, and intuitive API design

## Supported Agencies

### Currently Available

| Agency                                | Client         | Description                               | Methods |
| ------------------------------------- | -------------- | ----------------------------------------- | ------- |
| Korea Elevator Safety Agency (KOELSA) | `KOELSAClient` | Elevator installation and inspection data | 9       |

### Available APIs

**KOELSA (Korea Elevator Safety Agency)**

- **Elevator Installation Information**: Regional and temporal elevator installation data (3 methods)
- **Elevator Inspection Results**: Safety inspection results and maintenance history (4 methods, requires valid
  management codes)
- **Health Check & Client Info**: Service status and client information (2 methods)

## Installation

```bash
npm install korea-public-sdk
```

**Requirements:**

- Node.js 16.0 or higher
- TypeScript 5.0 or higher (for TypeScript projects)

## Service Key Setup

To use this SDK, you need to obtain service keys from the Korean Public Data Portal.

### Step 1: Account Registration

1. Visit [Korean Public Data Portal](https://www.data.go.kr)
2. Create a free account
3. Complete identity verification

### Step 2: API Application

1. Search for APIs you want to use:
   - Search "승강기 설치정보" for Elevator Installation Information
   - Search "승강기 검사신청결과" for Elevator Inspection Results
2. Click "활용신청" (Apply for Use) for each API
3. Fill out the application form with:
   - Purpose of use
   - Usage period
   - Expected traffic volume

### Step 3: Approval Process

- Applications are typically approved within 1-2 business days
- You will receive email notifications for approval status
- Some APIs may require additional documentation

### Step 4: Service Key Access

1. Go to "마이페이지" (My Page) → "개발계정" (Developer Account)
2. Find your approved APIs and copy the service keys
3. Each API has its own unique service key

### Usage Limitations

- **Rate Limits**: Most APIs have daily request limits (typically 1,000-10,000 calls)
- **Key Security**: Never expose service keys in public repositories
- **Terms of Service**: Follow the usage terms specified for each API

## Quick Start

### 1. Basic Implementation

```typescript
import { KOELSAClient } from "korea-public-sdk";

// Initialize client with your service key
const client = new KOELSAClient("your-service-key");

// Query elevator installation information
const installations = await client.installation.getInstallationList({
  Installation_sdt: "20240101",
  Installation_edt: "20240131",
  pageNo: 1,
  numOfRows: 10,
});

// Query elevator inspection results (requires valid management code)
const inspections = await client.inspection.getInspectResultList({
  elvtrmngno_mngno: "valid-management-code",
  pageNo: 1,
  numOfRows: 10,
});
```

### 2. Environment Variables

```bash
# Set service key as environment variable
export KOELSA_SERVICE_KEY=your-service-key
```

```typescript
// Use environment variable
const client = new KOELSAClient(process.env.KOELSA_SERVICE_KEY);
```

### 3. Error Handling

```typescript
import { ApiError, ValidationError } from "korea-public-sdk";

try {
  const result = await client.installation.getInstallationList(params);
  console.log("Success:", result);
} catch (error) {
  if (error instanceof ValidationError) {
    console.error("Validation error:", error.message);
  } else if (error instanceof ApiError) {
    console.error("API error:", error.message, error.statusCode);
  } else {
    console.error("Unknown error:", error);
  }
}
```

## API Documentation

### KOELSA (Korea Elevator Safety Agency)

#### Elevator Installation Information Service

```typescript
interface ElevatorInstallationParams {
  Installation_sdt: string; // Start date (YYYYMMDD format, required)
  Installation_edt: string; // End date (YYYYMMDD format, required)
  elevator_no?: string; // Elevator number (optional)
  pageNo?: number; // Page number (default: 1)
  numOfRows?: number; // Records per page (default: 10, max: 1000)
}

const result = await client.installation.getInstallationList(params);
```

#### Elevator Inspection Results Service

```typescript
interface ElevatorInspectResultParams {
  elvtrmngno_mngno: string; // Management code (required - must be valid site or elevator management code)
  pageNo?: number; // Page number (default: 1)
  numOfRows?: number; // Records per page (default: 10, max: 1000)
  _type?: "xml" | "json"; // Response format (default: xml)
}

// Available methods:
const result = await client.inspection.getInspectResultList(params);
const resultWithPaging = await client.inspection.getInspectResultListWithPagination(params);
const resultByCode = await client.inspection.getInspectResultByCode("management-code");
```

## Error Handling

Korea Public SDK implements a comprehensive error handling system with systematic error classification.

### Error Code Classification

- **1xx**: Common errors (shared across all agencies)
- **2xx**: KOELSA-specific errors
- **3xx-9xx**: Reserved for future agencies

### Error Types

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
      console.error("Parameter validation failed:", error.message);
      break;
    case ApiError:
      console.error("API request failed:", error.statusCode, error.message);
      break;
    case NetworkError:
      console.error("Network connection failed:", error.message);
      break;
    case ElevatorNotFoundError:
      console.error("Elevator not found:", error.elevatorNo);
      break;
    case KOELSAServiceError:
      console.error("KOELSA service error:", error.serviceEndpoint);
      break;
  }
}
```

## API Status Monitoring

Public APIs can change without notice. Simple tests help monitor API status.

### Automated Testing

GitHub Actions automatically checks API status weekly.

```bash
# Manual API status check
npm run test:integration

# Unit tests only
npm run test:unit
```

### Local Testing Setup

```bash
# Set environment variable
export KOELSA_SERVICE_KEY=your-service-key

# Run API tests
npm run test:integration
```

The tests verify:

- API calls execute successfully with real data
- Standard public data API response structure (`response.header.resultCode`, `response.body`) is maintained
- SDK error handling works correctly
- TypeScript type safety with actual API responses

## Configuration

### Client Configuration

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

### Health Check

```typescript
// Check if KOELSA API is accessible
const isHealthy = await client.healthCheck();
console.log("Service status:", isHealthy);

// Get client information
const info = client.getClientInfo();
console.log("Provider:", info.provider.name);
console.log("Available services:", info.services);
```

## Development

### Development Environment Setup

```bash
git clone https://github.com/your-username/korea-public-sdk.git
cd korea-public-sdk
npm install
npm run build
npm test
```

### Build Scripts

```bash
npm run build          # Compile TypeScript
npm run test           # Run all tests
npm run test:unit      # Run unit tests only
npm run test:integration # Run integration tests
npm run test:coverage  # Run tests with coverage
npm run lint           # Run ESLint
npm run format         # Format code with Prettier
```

### Testing

```bash
# Run all tests
npm test

# Run integration tests (requires service key)
KOELSA_SERVICE_KEY=your-key npm run test:integration
```

## Future Roadmap

The following government agencies are planned for future implementation:

### Korea Meteorological Administration (KMA)

```typescript
// Planned implementation
const kmaClient = new KMAClient("service-key");
const weather = await kmaClient.weather.getCurrentWeather(params);
const forecast = await kmaClient.forecast.getForecast(params);
```

### Korea Transportation Safety Authority (KOTSA)

```typescript
// Planned implementation
const kotsaClient = new KOTSAClient("service-key");
const vehicles = await kotsaClient.vehicle.getVehicleInfo(params);
const recalls = await kotsaClient.recall.getRecallList(params);
```

### Additional Agencies

Target: 300+ government agencies including:

- Ministry of Environment (MOE)
- Ministry of Land, Infrastructure and Transport (MOLIT)
- Korea National Statistical Office (KOSIS)
- National Information Society Agency (NIA)

## Contributing

We welcome contributions to Korea Public SDK. Please read our [Contributing Guide](./CONTRIBUTING.md) for details on our
development process, coding standards, and submission guidelines.

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-agency`)
3. Implement changes with comprehensive tests
4. Ensure all tests pass and code meets quality standards
5. Submit a pull request with detailed description

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## Resources

- **Documentation**: [Usage Guide](./docs/USAGE_GUIDE.md)
- **API Reference**: [Error Codes](./ERROR_CODES.md)
- **Issues**: [GitHub Issues](https://github.com/your-username/korea-public-sdk/issues)
- **Korean Public Data Portal**: [data.go.kr](https://www.data.go.kr)

## Disclaimer

This project is an independent implementation and is not officially affiliated with any Korean government agency. Use in
accordance with the terms of service of the respective government APIs.
