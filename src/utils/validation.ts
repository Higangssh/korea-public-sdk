import { ValidationError } from "../errors/common";

/**
 * Validates service key format and presence
 */
export function validateServiceKey(serviceKey: string): void {
  if (!serviceKey || serviceKey.trim() === "") {
    throw new ValidationError(
      "Service key is required. Please provide the authentication key issued from Public Data Portal.",
      "serviceKey"
    );
  }
}

/**
 * Validates page number format
 */
export function validatePageNo(pageNo: number): void {
  if (!Number.isInteger(pageNo) || pageNo < 1) {
    throw new ValidationError(
      "Page number must be an integer greater than or equal to 1.",
      "pageNo"
    );
  }
}

/**
 * Validates number of rows per page
 */
export function validateNumOfRows(numOfRows: number): void {
  if (!Number.isInteger(numOfRows) || numOfRows < 1 || numOfRows > 1000) {
    throw new ValidationError(
      "Number of rows per page must be an integer between 1 and 1000.",
      "numOfRows"
    );
  }
}

/**
 * Validates date format (YYYYMMDD)
 */
export function validateDateFormat(date: string, fieldName: string): void {
  const dateRegex = /^\d{8}$/;
  if (!dateRegex.test(date)) {
    throw new ValidationError(
      `${fieldName} must be in YYYYMMDD format. (e.g., 20240101)`,
      fieldName
    );
  }

  const year = parseInt(date.substring(0, 4));
  const month = parseInt(date.substring(4, 6));
  const day = parseInt(date.substring(6, 8));

  if (year < 1900 || year > 2100) {
    throw new ValidationError(
      `Invalid year in ${fieldName}. Year must be between 1900 and 2100.`,
      fieldName
    );
  }

  if (month < 1 || month > 12) {
    throw new ValidationError(
      `Invalid month in ${fieldName}. Month must be between 01 and 12.`,
      fieldName
    );
  }

  if (day < 1 || day > 31) {
    throw new ValidationError(
      `Invalid day in ${fieldName}. Day must be between 01 and 31.`,
      fieldName
    );
  }
}

/**
 * Validates elevator unique number format
 */
export function validateElevatorNo(elevatorNo: string): void {
  if (elevatorNo && elevatorNo.length > 12) {
    throw new ValidationError(
      "Elevator unique number must be 12 characters or less.",
      "elevatorNo"
    );
  }
}
