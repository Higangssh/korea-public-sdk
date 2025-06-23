# Error Handling Guide

Korea Public SDK provides comprehensive error handling with specific error classes for different failure scenarios. This guide covers all error types and best practices for handling them.

## Error Architecture

### Base Error Class

All SDK errors inherit from `KoreaPublicSDKError`, which provides:

- **Error code**: Unique identifier for the error type
- **Timestamp**: When the error occurred
- **JSON serialization**: For logging and debugging
- **Stack trace**: Full error stack for debugging

```typescript
abstract class KoreaPublicSDKError extends Error {
  public readonly code: string;
  public readonly timestamp: Date;

  public toJSON(): object; // Serializable error information
}
```

## Error Categories

### 1. Common Errors

These errors can occur across all API operations:

#### ValidationError

Thrown when input parameters fail validation.

```typescript
import { ValidationError } from "korea-public-sdk";

try {
  await client.installation.getInstallationList({
    pageNo: 0, // Invalid: must be >= 1
    numOfRows: 10,
    Installation_sdt: "20240101",
    Installation_edt: "20241231",
  });
} catch (error) {
  if (error instanceof ValidationError) {
    console.log(`Field: ${error.field}`); // "pageNo"
    console.log(`Message: ${error.message}`); // Descriptive error
    console.log(`Code: ${error.code}`); // "VALIDATION_ERROR"
  }
}
```

#### ApiError

Thrown when the API returns an error response.

```typescript
import { ApiError } from "korea-public-sdk";

try {
  await client.installation.getInstallationList(params);
} catch (error) {
  if (error instanceof ApiError) {
    console.log(`Status: ${error.statusCode}`); // HTTP status code
    console.log(`API Code: ${error.apiCode}`); // API-specific error code
    console.log(`Response: ${error.response}`); // Full API response

    // Handle specific API errors
    switch (error.statusCode) {
      case 401:
        console.log("Authentication failed");
        break;
      case 429:
        console.log("Rate limit exceeded");
        break;
      case 500:
        console.log("Server error");
        break;
    }
  }
}
```

#### NetworkError

Thrown when network-level errors occur.

```typescript
import { NetworkError } from "korea-public-sdk";

try {
  await client.installation.getInstallationList(params);
} catch (error) {
  if (error instanceof NetworkError) {
    console.log(`Original error: ${error.originalError}`);

    // Common network error types
    if (error.message.includes("timeout")) {
      console.log("Request timed out");
    } else if (error.message.includes("ECONNREFUSED")) {
      console.log("Connection refused");
    }
  }
}
```

#### ConfigurationError

Thrown when client configuration is invalid.

```typescript
import { ConfigurationError } from "korea-public-sdk";

try {
  const client = new KOELSAClient(""); // Empty service key
} catch (error) {
  if (error instanceof ConfigurationError) {
    console.log(`Config field: ${error.configField}`); // "serviceKey"
    console.log(`Message: ${error.message}`);
  }
}
```

#### ServiceUnavailableError

Thrown when a service is temporarily unavailable.

```typescript
import { ServiceUnavailableError } from "korea-public-sdk";

try {
  await client.installation.getInstallationList(params);
} catch (error) {
  if (error instanceof ServiceUnavailableError) {
    console.log(`Service: ${error.serviceName}`);
    console.log("Service is temporarily unavailable");
  }
}
```

#### RateLimitError

Thrown when API rate limits are exceeded.

```typescript
import { RateLimitError } from "korea-public-sdk";

try {
  await client.installation.getInstallationList(params);
} catch (error) {
  if (error instanceof RateLimitError) {
    console.log(`Retry after: ${error.retryAfter} seconds`);

    // Implement retry logic
    setTimeout(() => {
      // Retry the request
    }, error.retryAfter * 1000);
  }
}
```

### 2. KOELSA-Specific Errors

These errors are specific to KOELSA API operations:

#### ElevatorNotFoundError

Thrown when a specific elevator cannot be found.

```typescript
import { ElevatorNotFoundError } from "korea-public-sdk";

try {
  const elevator = await client.installation.getElevatorInstallationInfo(
    "INVALID_ELEVATOR_ID",
    "20240101",
    "20241231"
  );
} catch (error) {
  if (error instanceof ElevatorNotFoundError) {
    console.log(`Elevator number: ${error.elevatorNo}`);
    console.log("Elevator not found in the system");
  }
}
```

#### InvalidInspectionDataError

Thrown when inspection data is invalid or incomplete.

```typescript
import { InvalidInspectionDataError } from "korea-public-sdk";

try {
  await client.inspectResult.getInspectResultList(params);
} catch (error) {
  if (error instanceof InvalidInspectionDataError) {
    console.log(`Inspection ID: ${error.inspectionId}`);
    console.log(`Data field: ${error.dataField}`);
    console.log("Inspection data is invalid");
  }
}
```

#### InvalidManagementCodeError

Thrown when management code format is invalid.

```typescript
import { InvalidManagementCodeError } from "korea-public-sdk";

try {
  await client.inspectResult.getInspectResultList({
    pageNo: 1,
    numOfRows: 10,
    elvtrmngno_mngno: "INVALID_FORMAT",
  });
} catch (error) {
  if (error instanceof InvalidManagementCodeError) {
    console.log(`Management code: ${error.managementCode}`);
    console.log("Management code format is invalid");
  }
}
```

#### KOELSAServiceError

Thrown when KOELSA service has specific issues.

```typescript
import { KOELSAServiceError } from "korea-public-sdk";

try {
  await client.installation.getInstallationList(params);
} catch (error) {
  if (error instanceof KOELSAServiceError) {
    console.log(`Service endpoint: ${error.serviceEndpoint}`);
    if (error.maintenanceUntil) {
      console.log(`Maintenance until: ${error.maintenanceUntil}`);
    }
  }
}
```

## Best Practices

### 1. Comprehensive Error Handling

```typescript
async function robustApiCall() {
  try {
    return await client.installation.getInstallationList(params);
  } catch (error) {
    // Log error details for debugging
    console.error("API Error Details:", {
      name: error.name,
      message: error.message,
      code: error.code,
      timestamp: error.timestamp,
      stack: error.stack,
    });

    // Handle specific error types
    if (error instanceof ValidationError) {
      throw new Error(`Invalid ${error.field}: ${error.message}`);
    } else if (error instanceof ElevatorNotFoundError) {
      return null; // Return null for not found
    } else if (error instanceof RateLimitError) {
      // Implement retry with backoff
      await new Promise((resolve) =>
        setTimeout(resolve, (error.retryAfter || 60) * 1000)
      );
      return robustApiCall(); // Retry
    } else if (error instanceof NetworkError) {
      throw new Error("Network connectivity issue");
    } else {
      throw error; // Re-throw unknown errors
    }
  }
}
```

### 2. Error Logging

```typescript
function logError(error: any, context: string) {
  const logEntry = {
    timestamp: new Date().toISOString(),
    context,
    error: error.toJSON
      ? error.toJSON()
      : {
          name: error.name,
          message: error.message,
          stack: error.stack,
        },
  };

  // Send to logging service
  console.error("SDK Error:", JSON.stringify(logEntry, null, 2));

  // Additional logging based on error type
  if (error instanceof ApiError && error.statusCode >= 500) {
    // Alert for server errors
    console.error("SERVER ERROR ALERT:", logEntry);
  }
}
```

### 3. Retry Strategies

#### Exponential Backoff

```typescript
async function withExponentialBackoff<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      // Only retry on specific errors
      if (
        error instanceof NetworkError ||
        (error instanceof ApiError && error.statusCode >= 500) ||
        error instanceof RateLimitError
      ) {
        if (attempt === maxRetries - 1) {
          throw error; // Last attempt failed
        }

        const delay = baseDelay * Math.pow(2, attempt);
        console.log(`Retrying in ${delay}ms... (attempt ${attempt + 1})`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      } else {
        throw error; // Don't retry validation or not found errors
      }
    }
  }

  throw new Error("Max retries exceeded");
}

// Usage
const result = await withExponentialBackoff(() =>
  client.installation.getInstallationList(params)
);
```

#### Circuit Breaker Pattern

```typescript
class CircuitBreaker {
  private failureCount = 0;
  private lastFailureTime = 0;
  private readonly threshold = 5;
  private readonly timeout = 60000; // 1 minute
  private state: "CLOSED" | "OPEN" | "HALF_OPEN" = "CLOSED";

  async execute<T>(operation: () => Promise<T>): Promise<T> {
    if (this.state === "OPEN") {
      if (Date.now() - this.lastFailureTime > this.timeout) {
        this.state = "HALF_OPEN";
      } else {
        throw new Error("Circuit breaker is OPEN");
      }
    }

    try {
      const result = await operation();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  private onSuccess(): void {
    this.failureCount = 0;
    this.state = "CLOSED";
  }

  private onFailure(): void {
    this.failureCount++;
    this.lastFailureTime = Date.now();

    if (this.failureCount >= this.threshold) {
      this.state = "OPEN";
    }
  }
}
```

### 4. Error Recovery

```typescript
class ErrorRecoveryManager {
  async handleApiError(error: any, operation: () => Promise<any>) {
    if (error instanceof RateLimitError) {
      // Wait and retry for rate limits
      await this.waitForRateLimit(error.retryAfter);
      return operation();
    }

    if (error instanceof NetworkError) {
      // Check network connectivity
      const isOnline = await this.checkConnectivity();
      if (!isOnline) {
        throw new Error("No network connectivity");
      }
      // Retry with exponential backoff
      return this.retryWithBackoff(operation);
    }

    if (error instanceof ValidationError) {
      // Attempt to fix common validation issues
      return this.attemptValidationFix(error, operation);
    }

    // For other errors, just re-throw
    throw error;
  }

  private async waitForRateLimit(retryAfter?: number): Promise<void> {
    const delay = (retryAfter || 60) * 1000;
    console.log(`Rate limited. Waiting ${delay / 1000} seconds...`);
    await new Promise((resolve) => setTimeout(resolve, delay));
  }

  private async checkConnectivity(): Promise<boolean> {
    try {
      // Simple connectivity check
      const response = await fetch("https://httpbin.org/status/200", {
        method: "HEAD",
        timeout: 5000,
      });
      return response.ok;
    } catch {
      return false;
    }
  }
}
```

## Testing Error Handling

```typescript
// Test error handling in your application
describe("Error Handling", () => {
  it("should handle validation errors", async () => {
    try {
      await client.installation.getInstallationList({
        pageNo: -1, // Invalid
        numOfRows: 10,
        Installation_sdt: "20240101",
        Installation_edt: "20241231",
      });
      fail("Should have thrown ValidationError");
    } catch (error) {
      expect(error).toBeInstanceOf(ValidationError);
      expect(error.field).toBe("pageNo");
    }
  });

  it("should handle network errors with retry", async () => {
    // Mock network failure
    const mockError = new NetworkError("Connection failed");
    jest.spyOn(client, "makeRequest").mockRejectedValueOnce(mockError);

    const result = await withExponentialBackoff(() =>
      client.installation.getInstallationList(params)
    );

    expect(result).toBeDefined();
  });
});
```

This comprehensive error handling approach ensures your application can gracefully handle all possible error scenarios while providing meaningful feedback to users and detailed information for debugging.
