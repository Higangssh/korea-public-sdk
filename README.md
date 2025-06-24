# Korea Public SDK

_Read this in [한국어](README.ko.md)_

A comprehensive TypeScript SDK for accessing Korean public APIs, starting with the Korea Elevator Safety Agency (KOELSA) and designed for seamless expansion to other government agencies.

## Overview

Korea Public SDK provides a unified, type-safe interface for interacting with Korean public data APIs. Built with modern TypeScript, it offers robust error handling, comprehensive validation, and excellent developer experience.

### Key Features

- **Type Safety**: Full TypeScript support with strict type checking
- **Comprehensive Error Handling**: Detailed error classes with rich context information
- **Input Validation**: Robust parameter validation for all API calls
- **Extensible Architecture**: Modular design ready for additional government agencies
- **Developer Experience**: Rich IntelliSense support and clear documentation
- **Production Ready**: Thoroughly tested with comprehensive test coverage

### Currently Supported APIs

- **KOELSA (Korea Elevator Safety Agency)**: Complete access to elevator installation and inspection data

## Installation

```bash
npm install korea-public-sdk
```

## Quick Start

```typescript
import { createKOELSAClient } from "korea-public-sdk";

// Initialize client with your service key
const client = createKOELSAClient("your-service-key-from-data.go.kr");

// Get elevator installation information
try {
  const installations = await client.installation.getInstallationList({
    pageNo: 1,
    numOfRows: 10,
    Installation_sdt: "20240101",
    Installation_edt: "20241231",
  });

  console.log(`Found ${installations.length} installations`);
} catch (error) {
  if (error instanceof ValidationError) {
    console.error("Invalid parameters:", error.field);
  } else if (error instanceof ElevatorNotFoundError) {
    console.error("Elevator not found:", error.elevatorNo);
  }
}
```

## API Documentation

### KOELSA Client

#### Installation Information Service

```typescript
// Get paginated installation list
const result = await client.installation.getInstallationListWithPagination({
  pageNo: 1,
  numOfRows: 100,
  Installation_sdt: "20240101",
  Installation_edt: "20241231",
  elevator_no: "optional-elevator-number",
});

// Get specific elevator information
const elevator = await client.installation.getElevatorInstallationInfo(
  "ELEVATOR123",
  "20240101",
  "20241231"
);
```

#### Inspection Result Service

```typescript
// Get inspection results
const inspections = await client.inspectResult.getInspectResultList({
  pageNo: 1,
  numOfRows: 50,
  elvtrmngno_mngno: "management-code",
});
```

## Error Handling

The SDK provides detailed error information with **platform-specific numerical error codes** for robust error handling:

```typescript
import {
  ValidationError,
  ApiError,
  NetworkError,
  ElevatorNotFoundError,
  WeatherStationNotFoundError,
  VehicleNotFoundError,
  ErrorCodes,
  getErrorMessage,
  getErrorCategory,
  isCommonError,
  isPlatformError,
} from "korea-public-sdk";

try {
  await client.installation.getInstallationList(params);
} catch (error) {
  // Handle by error code
  switch (error.code) {
    case ErrorCodes.ELEVATOR_NOT_FOUND:
      console.log(`Elevator ${error.elevatorNo} not found`);
      break;
    case ErrorCodes.RATE_LIMIT_EXCEEDED:
      console.log("Rate limit exceeded. Please retry later.");
      break;
    case ErrorCodes.INVALID_DATE_FORMAT:
      console.log("Invalid date format. Use YYYYMMDD format.");
      break;
    default:
      console.log(`Error ${error.code}: ${getErrorMessage(error.code)}`);
  }

  // Handle by category
  const category = getErrorCategory(error.code);
  console.log(`Error category: ${category}`);

  // Check if common error (affects all platforms)
  if (isCommonError(error.code)) {
    console.log("This is a common error that can occur on any platform");
  }

  // Check if platform-specific error
  if (isPlatformError(error.code)) {
    console.log("This is a platform-specific error");
  }

  // Handle by platform-specific error type
  if (error instanceof ElevatorNotFoundError) {
    console.log(`KOELSA: Elevator ${error.elevatorNo} not found`);
  } else if (error instanceof WeatherStationNotFoundError) {
    console.log(`KMA: Weather station ${error.stationId} not found`);
  } else if (error instanceof VehicleNotFoundError) {
    console.log(`KOTSA: Vehicle ${error.vehicleNumber} not found`);
  }

  // Handle by error type (legacy support)
  if (error instanceof ValidationError) {
    console.log(`Validation failed for field: ${error.field}`);
  } else if (error instanceof ApiError) {
    console.log(`API error ${error.statusCode}: ${error.message}`);
  } else if (error instanceof NetworkError) {
    console.log("Network error:", error.originalError);
  }
}
```

### Error Code Reference

For a complete list of error codes and their descriptions, see the [Error Codes Reference](ERROR_CODES.md).

**New Error Code System (Platform-Based):**

- **1xx**: Common errors (validation, API, network, configuration, service, rate limiting)
- **2xx**: KOELSA (Korea Elevator Safety Agency) specific errors
- **3xx**: KMA (Korea Meteorological Administration) specific errors (future)
- **4xx**: KOTSA (Korea Transportation Safety Authority) specific errors (future)
- **5xx-9xx**: Reserved for future agencies

**Error Organization:**

```
src/errors/
├── base.ts       # Base error class and ErrorCodes enum
├── common.ts     # Common errors (1xx range)
├── koelsa.ts     # KOELSA specific errors (2xx range)
├── kma.ts        # KMA specific errors (3xx range)
├── kotsa.ts      # KOTSA specific errors (4xx range)
└── index.ts      # Centralized exports
```

**Key Benefits:**

- **Platform Isolation**: Each agency gets 99 dedicated error codes (e.g., KOELSA: 200-299)
- **Scalability**: Easy to add new agencies without conflicts
- **Categorization**: Quickly identify error source by first digit
- **Type Safety**: Full TypeScript enum support with helper functions
- **Organized Structure**: Platform-specific errors grouped in dedicated files

## Configuration

### Client Configuration

```typescript
import { KOELSAClient } from "korea-public-sdk";

const client = new KOELSAClient("your-service-key", {
  timeout: 30000,
  headers: {
    "User-Agent": "MyApp/1.0.0",
  },
});
```

### Environment Variables

You can set your service key as an environment variable:

```bash
export KOREA_PUBLIC_API_KEY=your-service-key
```

## Development

### Prerequisites

- Node.js 16 or higher
- TypeScript 5.0 or higher

### Building from Source

```bash
git clone https://github.com/Higangssh/korea-public-sdk.git
cd korea-public-sdk
npm install
npm run build
```

### Running Tests

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run specific test suites
npm test tests/utils/validation.test.ts
```

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup

1. Fork the repository
2. Create a feature branch
3. Make your changes with tests
4. Ensure all tests pass
5. Submit a pull request

## API Key Requirements

To use this SDK, you need to obtain a service key from the Korean Public Data Portal:

1. Visit [data.go.kr](https://www.data.go.kr)
2. Register for an account
3. Apply for API access to the desired services
4. Use the provided service key with this SDK

## Future Roadmap

- Korea Meteorological Administration (KMA) APIs
- Korea Transportation Safety Authority (KOTSA) APIs
- Additional government agency APIs
- Enhanced caching mechanisms
- Rate limiting support

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Support

- **Documentation**: [Usage Guide](docs/USAGE_GUIDE.md)
- **Issues**: [GitHub Issues](https://github.com/Higangssh/korea-public-sdk/issues)
- **Discussions**: [GitHub Discussions](https://github.com/Higangssh/korea-public-sdk/discussions)

## Acknowledgments

This project is built to facilitate access to Korean public data and is not officially affiliated with any Korean government agency.
