# Contributing to Korea Public SDK

Thank you for your interest in contributing to Korea Public SDK! This document provides guidelines and information for contributors.

## Code of Conduct

This project adheres to a code of conduct. By participating, you are expected to uphold this code. Please report unacceptable behavior to the project maintainers.

## How to Contribute

### Reporting Issues

Before creating an issue, please:

1. Check existing issues to avoid duplicates
2. Use the issue templates when available
3. Provide clear, detailed information including:
   - SDK version
   - Node.js version
   - Operating system
   - Steps to reproduce
   - Expected vs actual behavior

### Suggesting Features

We welcome feature suggestions! Please:

1. Check if the feature has already been requested
2. Create a detailed feature request with:
   - Clear description of the feature
   - Use case and benefits
   - Proposed implementation approach (if applicable)

### Pull Requests

#### Before You Start

1. Fork the repository
2. Create a new branch from `main`
3. Ensure you have Node.js 16+ installed

#### Development Setup

```bash
# Clone your fork
git clone https://github.com/your-username/korea-public-sdk.git
cd korea-public-sdk

# Install dependencies
npm install

# Run tests to ensure everything works
npm test

# Build the project
npm run build
```

#### Making Changes

1. **Code Style**: Follow the existing code style and conventions
2. **TypeScript**: Use strict TypeScript with proper typing
3. **Testing**: Add tests for new functionality
4. **Documentation**: Update documentation for API changes

#### Commit Guidelines

Follow conventional commit format:

```
type(scope): description

Examples:
feat(koelsa): add new inspection result service
fix(validation): handle edge case in date validation
docs(readme): update installation instructions
test(utils): add validation tests for edge cases
```

#### Testing Requirements

All contributions must include appropriate tests:

```bash
# Run all tests
npm test

# Run tests with coverage (should maintain >90%)
npm run test:coverage

# Run specific test files
npm test tests/utils/validation.test.ts
```

#### Pull Request Process

1. Update documentation if needed
2. Add/update tests for your changes
3. Ensure all tests pass
4. Update CHANGELOG.md if applicable
5. Create a pull request with:
   - Clear title and description
   - Reference to related issues
   - Screenshots/examples if applicable

## Development Guidelines

### Project Structure

```
src/
├── clients/           # API client implementations
│   ├── base/         # Base classes and interfaces
│   └── koelsa/       # KOELSA-specific implementation
├── errors/           # Error class definitions
├── types/            # TypeScript type definitions
└── utils/            # Utility functions

tests/
├── utils/            # Utility function tests
├── errors/           # Error class tests
└── clients/          # Client implementation tests
```

### Adding New APIs

When adding support for a new Korean government API:

1. Create a new directory under `src/clients/`
2. Implement the client following the base client pattern
3. Add comprehensive error classes for the API
4. Include full TypeScript types
5. Add thorough tests
6. Update documentation

### Error Handling Standards

- Use specific error classes for different failure modes
- Include relevant context in error objects
- Ensure errors are JSON serializable
- Provide clear, actionable error messages

### Testing Standards

- Aim for >90% test coverage
- Test both success and failure scenarios
- Include edge cases and boundary conditions
- Use descriptive test names
- Mock external dependencies appropriately

## Documentation

### Code Documentation

- Use JSDoc comments for public APIs
- Include examples in documentation
- Document parameters, return values, and exceptions
- Keep comments up-to-date with code changes

### README Updates

When updating the README:

- Keep examples current and tested
- Maintain professional tone
- Include practical use cases
- Update version compatibility information

## Release Process

Releases are handled by maintainers:

1. Version bump following semantic versioning
2. Update CHANGELOG.md
3. Create release notes
4. Publish to npm

## Questions and Support

- **General questions**: Use GitHub Discussions
- **Bug reports**: Create GitHub Issues
- **Feature requests**: Create GitHub Issues
- **Development questions**: Comment on relevant PRs/issues

## Recognition

Contributors will be recognized in:

- Release notes for significant contributions
- Contributors section (if we add one)
- Special mentions for major features

Thank you for contributing to Korea Public SDK!
