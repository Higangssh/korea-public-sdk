# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-06-23

### Added

#### Core Features

- Complete TypeScript SDK for Korean public APIs
- Full KOELSA (Korea Elevator Safety Agency) API integration
- Extensible architecture for future government agency APIs
- Comprehensive input validation system
- Advanced error handling with specific error classes

#### KOELSA API Support

- Elevator installation information service
- Elevator inspection result service
- Complete type definitions for all API responses
- Pagination support for large datasets
- Health check functionality

#### Error Handling System

- Base `KoreaPublicSDKError` class with JSON serialization
- Common error types: `ValidationError`, `ApiError`, `NetworkError`, `ConfigurationError`, `ServiceUnavailableError`, `RateLimitError`
- KOELSA-specific errors: `ElevatorNotFoundError`, `InvalidInspectionDataError`, `InvalidManagementCodeError`, `KOELSAServiceError`
- Rich error context with timestamps and detailed information

#### Developer Experience

- Full TypeScript support with strict type checking
- Comprehensive JSDoc documentation
- IntelliSense support for all APIs
- Factory functions for easy client creation
- Detailed usage examples and guides

#### Testing Infrastructure

- Jest-based testing framework
- Unit tests for all validation functions (24 tests)
- Error class testing with full coverage (15 tests)
- HTTP client testing (10 tests)
- Test coverage reporting

#### Documentation

- Comprehensive README with quick start guide
- Detailed usage guide with advanced examples
- Error handling guide with best practices
- Contributing guidelines for open source development
- Changelog following standard conventions

### Technical Details

#### Architecture

- Modular client design with base classes
- HTTP client with axios for reliable network operations
- Request/response interceptors for automatic service key injection
- Configurable timeout and custom headers support

#### Validation System

- Service key format validation
- Page number and size validation (1-1000 range)
- Date format validation (YYYYMMDD with range checks)
- Elevator number format validation
- Comprehensive parameter validation for all API calls

#### Type Safety

- Complete TypeScript type definitions
- Strict null checks and type safety
- Generic type support for API responses
- Union types for API status codes and responses

#### Build and Distribution

- TypeScript compilation with source maps
- ES2020 target with CommonJS modules
- NPM package with proper exports
- Development and production build configurations

### Dependencies

- `axios ^1.6.0` for HTTP client functionality
- Development dependencies: TypeScript, Jest, ESLint

### Breaking Changes

- Initial release - no breaking changes

### Security

- No known security vulnerabilities
- Service key validation to prevent empty or invalid keys
- Input sanitization for all API parameters

### Performance

- Efficient HTTP client with connection reuse
- Minimal bundle size with tree-shaking support
- Optimized TypeScript compilation
- Lazy loading of service modules

---

## Development Notes

This changelog will be updated with each release. For unreleased changes, see the [GitHub repository](https://github.com/Higangssh/korea-public-sdk).

### Future Roadmap

- Korea Meteorological Administration (KMA) APIs
- Korea Transportation Safety Authority (KOTSA) APIs
- Enhanced caching mechanisms
- Rate limiting and retry strategies
- Additional Korean government agency integrations
