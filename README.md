# Korea Public SDK

[![npm version](https://img.shields.io/npm/v/korea-public-sdk)](https://www.npmjs.com/package/korea-public-sdk)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-16.0+-green.svg)](https://nodejs.org/)

**Professional TypeScript SDK for Korean Public Data Portal APIs**

Korea Public SDK provides a comprehensive, type-safe interface for accessing Korean government agency APIs. Built with modern TypeScript and designed for enterprise-grade applications, it offers robust error handling, comprehensive validation, and seamless integration capabilities.

## Table of Contents

- [Features](#features)
- [Supported Agencies](#supported-agencies)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [API Documentation](#api-documentation)
- [Error Handling](#error-handling)
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

| Agency                                | Client         | Description                               | APIs |
| ------------------------------------- | -------------- | ----------------------------------------- | ---- |
| Korea Elevator Safety Agency (KOELSA) | `KOELSAClient` | Elevator installation and inspection data | 2    |

### Available APIs

**KOELSA (Korea Elevator Safety Agency)**

- **Elevator Installation Information**: Regional and temporal elevator installation data
- **Elevator Inspection Results**: Safety inspection results and maintenance history

## Installation

```bash
npm install korea-public-sdk
```

**Requirements:**

- Node.js 16.0 or higher
- TypeScript 5.0 or higher (for TypeScript projects)

## Quick Start

### 1. Service Key Registration

Obtain a service key from the [Korean Public Data Portal](https://www.data.go.kr):

1. Register for an account at data.go.kr
2. Apply for API access to desired services
3. Obtain the service key for your application

### 2. Basic Implementation

```typescript
import { KOELSAClient } from "korea-public-sdk";

// Initialize client
const client = new KOELSAClient("your-service-key");

// Query elevator installation information
const installations = await client.installation.getInstallationList({
  siDo: "서울특별시",
  siGunGu: "강남구",
  pageNo: 1,
  numOfRows: 10,
});

// Query elevator inspection results
const inspections = await client.inspection.getInspectionResults({
  siDo: "서울특별시",
  elevatorNo: "EL123456789",
  pageNo: 1,
  numOfRows: 10,
});
```

### 3. Convenience Functions

```typescript
import { createKOELSAClient } from "korea-public-sdk";

const client = createKOELSAClient("your-service-key");
const result = await client.installation.getInstallationList(params);
```

## API Documentation

### KOELSA (Korea Elevator Safety Agency)

#### Elevator Installation Information Service

```typescript
interface ElevatorInstallationParams {
  siDo?: string; // Administrative region (optional)
  siGunGu?: string; // Sub-administrative region (optional)
  installStartDate?: string; // Installation start date (optional, YYYYMMDD)
  installEndDate?: string; // Installation end date (optional, YYYYMMDD)
  pageNo?: number; // Page number (default: 1)
  numOfRows?: number; // Records per page (default: 10, max: 1000)
}

const result = await client.installation.getInstallationList(params);
```

#### Elevator Inspection Results Service

```typescript
interface ElevatorInspectResultParams {
  siDo?: string; // Administrative region (optional)
  siGunGu?: string; // Sub-administrative region (optional)
  elevatorNo?: string; // Elevator number (optional)
  inspectStartDate?: string; // Inspection start date (optional, YYYYMMDD)
  inspectEndDate?: string; // Inspection end date (optional, YYYYMMDD)
  pageNo?: number; // Page number (default: 1)
  numOfRows?: number; // Records per page (default: 10, max: 1000)
}

const result = await client.inspection.getInspectionResults(params);
```

## Error Handling

Korea Public SDK implements a comprehensive error handling system with systematic error classification.

### Error Code Classification

- **1xx**: Common errors (shared across all agencies)
- **2xx**: KOELSA-specific errors
- **3xx-9xx**: Reserved for future agencies

### Error Handling Implementation

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
  // Type-based error handling
  if (error instanceof ValidationError) {
    console.error("Validation failed:", error.message);
  } else if (error instanceof ElevatorNotFoundError) {
    console.error("Elevator not found:", error.elevatorNo);
  }

  // Code-based error handling
  switch (error.code) {
    case ErrorCodes.INVALID_SERVICE_KEY:
      console.error("Invalid service key provided");
      break;
    case ErrorCodes.RATE_LIMIT_EXCEEDED:
      console.error("Rate limit exceeded, please retry later");
      break;
    case ErrorCodes.ELEVATOR_NOT_FOUND:
      console.error("Specified elevator not found");
      break;
  }

  // Error categorization
  if (isCommonError(error.code)) {
    console.log("Common error:", getErrorMessage(error.code));
    console.log("Category:", getErrorCategory(error.code));
  }
}
```

### Error Information Utilities

```typescript
import {
  getErrorMessage,
  getErrorCategory,
  isCommonError,
  isPlatformError,
} from "korea-public-sdk";

// Get human-readable error messages
const message = getErrorMessage(ErrorCodes.ELEVATOR_NOT_FOUND);

// Categorize errors
const category = getErrorCategory(error.code);

// Check error scope
if (isCommonError(error.code)) {
  // Handle common errors affecting all agencies
} else if (isPlatformError(error.code)) {
  // Handle agency-specific errors
}
```

For comprehensive error code documentation, refer to [ERROR_CODES.md](./ERROR_CODES.md).

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

### Environment Variables

```bash
# Optional: Set service key as environment variable
export KOREA_PUBLIC_API_KEY=your-service-key
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
npm run test           # Run test suite
npm run test:coverage  # Run tests with coverage
npm run lint           # Run ESLint
npm run format         # Format code with Prettier
```

### Testing

The SDK includes comprehensive test coverage:

```bash
# Run all tests
npm test

# Run specific test categories
npm test tests/errors/
npm test tests/utils/
npm test tests/clients/
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

We welcome contributions to Korea Public SDK. Please read our [Contributing Guide](./CONTRIBUTING.md) for details on our development process, coding standards, and submission guidelines.

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

This project is an independent implementation and is not officially affiliated with any Korean government agency. Use in accordance with the terms of service of the respective government APIs.
