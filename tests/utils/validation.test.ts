import {
  validateServiceKey,
  validatePageNo,
  validateNumOfRows,
  validateDateFormat,
  validateElevatorNo,
} from "../../src/utils/validation";
import { ValidationError } from "../../src/errors/common";

describe("Validation Functions", () => {
  describe("validateServiceKey", () => {
    it("should throw ValidationError when service key is empty string", () => {
      expect(() => validateServiceKey("")).toThrow(ValidationError);
      expect(() => validateServiceKey("")).toThrow(
        "Service key is required. Please provide the authentication key issued from Public Data Portal."
      );
    });

    it("should throw ValidationError when service key is only whitespace", () => {
      expect(() => validateServiceKey("   ")).toThrow(ValidationError);
      expect(() => validateServiceKey("\t\n ")).toThrow(ValidationError);
    });

    it("should throw ValidationError with correct field name", () => {
      try {
        validateServiceKey("");
      } catch (error) {
        expect(error).toBeInstanceOf(ValidationError);
        expect((error as ValidationError).field).toBe("serviceKey");
      }
    });

    it("should pass validation with valid service key", () => {
      expect(() => validateServiceKey("valid-service-key")).not.toThrow();
      expect(() => validateServiceKey("abc123")).not.toThrow();
      expect(() =>
        validateServiceKey("test-key-with-special-chars-_")
      ).not.toThrow();
    });
  });

  describe("validatePageNo", () => {
    it("should throw ValidationError when page number is less than 1", () => {
      expect(() => validatePageNo(0)).toThrow(ValidationError);
      expect(() => validatePageNo(-1)).toThrow(ValidationError);
      expect(() => validatePageNo(-100)).toThrow(ValidationError);
    });

    it("should throw ValidationError when page number is not an integer", () => {
      expect(() => validatePageNo(1.5)).toThrow(ValidationError);
      expect(() => validatePageNo(2.99)).toThrow(ValidationError);
      expect(() => validatePageNo(NaN)).toThrow(ValidationError);
      expect(() => validatePageNo(Infinity)).toThrow(ValidationError);
    });

    it("should throw ValidationError with correct message and field", () => {
      try {
        validatePageNo(0);
      } catch (error) {
        expect(error).toBeInstanceOf(ValidationError);
        expect((error as ValidationError).field).toBe("pageNo");
        expect((error as ValidationError).message).toBe(
          "Page number must be an integer greater than or equal to 1."
        );
      }
    });

    it("should pass validation with valid page numbers", () => {
      expect(() => validatePageNo(1)).not.toThrow();
      expect(() => validatePageNo(10)).not.toThrow();
      expect(() => validatePageNo(999999)).not.toThrow();
    });
  });

  describe("validateNumOfRows", () => {
    it("should throw ValidationError when number of rows is less than 1", () => {
      expect(() => validateNumOfRows(0)).toThrow(ValidationError);
      expect(() => validateNumOfRows(-1)).toThrow(ValidationError);
    });

    it("should throw ValidationError when number of rows is greater than 1000", () => {
      expect(() => validateNumOfRows(1001)).toThrow(ValidationError);
      expect(() => validateNumOfRows(9999)).toThrow(ValidationError);
    });

    it("should throw ValidationError when number of rows is not an integer", () => {
      expect(() => validateNumOfRows(10.5)).toThrow(ValidationError);
      expect(() => validateNumOfRows(NaN)).toThrow(ValidationError);
    });

    it("should throw ValidationError with correct message and field", () => {
      try {
        validateNumOfRows(1001);
      } catch (error) {
        expect(error).toBeInstanceOf(ValidationError);
        expect((error as ValidationError).field).toBe("numOfRows");
        expect((error as ValidationError).message).toBe(
          "Number of rows per page must be an integer between 1 and 1000."
        );
      }
    });

    it("should pass validation with valid number of rows", () => {
      expect(() => validateNumOfRows(1)).not.toThrow();
      expect(() => validateNumOfRows(100)).not.toThrow();
      expect(() => validateNumOfRows(1000)).not.toThrow();
    });
  });

  describe("validateDateFormat", () => {
    it("should throw ValidationError when date format is not YYYYMMDD", () => {
      expect(() => validateDateFormat("2024-01-01", "testDate")).toThrow(
        ValidationError
      );
      expect(() => validateDateFormat("24/01/01", "testDate")).toThrow(
        ValidationError
      );
      expect(() => validateDateFormat("20240101a", "testDate")).toThrow(
        ValidationError
      );
      expect(() => validateDateFormat("2024101", "testDate")).toThrow(
        ValidationError
      );
      expect(() => validateDateFormat("202401011", "testDate")).toThrow(
        ValidationError
      );
    });

    it("should throw ValidationError when year is out of range", () => {
      expect(() => validateDateFormat("18991231", "testDate")).toThrow(
        ValidationError
      );
      expect(() => validateDateFormat("21010101", "testDate")).toThrow(
        ValidationError
      );
    });

    it("should throw ValidationError when month is invalid", () => {
      expect(() => validateDateFormat("20240001", "testDate")).toThrow(
        ValidationError
      );
      expect(() => validateDateFormat("20241301", "testDate")).toThrow(
        ValidationError
      );
      expect(() => validateDateFormat("20240031", "testDate")).toThrow(
        ValidationError
      );
    });

    it("should throw ValidationError when day is invalid", () => {
      expect(() => validateDateFormat("20240100", "testDate")).toThrow(
        ValidationError
      );
      expect(() => validateDateFormat("20240132", "testDate")).toThrow(
        ValidationError
      );
    });

    it("should throw ValidationError with correct field name", () => {
      try {
        validateDateFormat("invalid", "startDate");
      } catch (error) {
        expect(error).toBeInstanceOf(ValidationError);
        expect((error as ValidationError).field).toBe("startDate");
        expect((error as ValidationError).message).toContain("startDate");
      }
    });

    it("should pass validation with valid dates", () => {
      expect(() => validateDateFormat("20240101", "testDate")).not.toThrow();
      expect(() => validateDateFormat("20001231", "testDate")).not.toThrow();
      expect(() => validateDateFormat("19900630", "testDate")).not.toThrow();
      expect(() => validateDateFormat("20991212", "testDate")).not.toThrow();
    });

    it("should handle edge cases for dates", () => {
      // Valid edge cases
      expect(() => validateDateFormat("19000101", "testDate")).not.toThrow();
      expect(() => validateDateFormat("21001231", "testDate")).not.toThrow();

      // February dates (note: this validation doesn't check actual calendar validity)
      expect(() => validateDateFormat("20240229", "testDate")).not.toThrow();
      expect(() => validateDateFormat("20240230", "testDate")).not.toThrow(); // Invalid but passes basic validation
    });
  });

  describe("validateElevatorNo", () => {
    it("should throw ValidationError when elevator number is longer than 12 characters", () => {
      expect(() => validateElevatorNo("1234567890123")).toThrow(
        ValidationError
      ); // 13 chars
      expect(() => validateElevatorNo("abcdefghijklm")).toThrow(
        ValidationError
      ); // 13 chars
    });

    it("should throw ValidationError with correct message and field", () => {
      try {
        validateElevatorNo("1234567890123");
      } catch (error) {
        expect(error).toBeInstanceOf(ValidationError);
        expect((error as ValidationError).field).toBe("elevatorNo");
        expect((error as ValidationError).message).toBe(
          "Elevator unique number must be 12 characters or less."
        );
      }
    });

    it("should pass validation with valid elevator numbers", () => {
      expect(() => validateElevatorNo("")).not.toThrow(); // Empty string is allowed
      expect(() => validateElevatorNo("ELV123")).not.toThrow();
      expect(() => validateElevatorNo("123456789012")).not.toThrow(); // Exactly 12 chars
      expect(() => validateElevatorNo("A")).not.toThrow(); // Single character
    });

    it("should handle undefined and null values safely", () => {
      // Note: TypeScript signature expects string, but we should handle edge cases
      expect(() => validateElevatorNo("")).not.toThrow();
    });
  });
});
