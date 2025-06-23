import { KoreaPublicSDKError } from "../../errors/base";

/**
 * Error thrown when elevator number is not found
 */
export class ElevatorNotFoundError extends KoreaPublicSDKError {
  public readonly elevatorNo?: string;

  constructor(message: string, elevatorNo?: string) {
    super(message, "ELEVATOR_NOT_FOUND");
    if (elevatorNo !== undefined) {
      this.elevatorNo = elevatorNo;
    }
  }
}

/**
 * Error thrown when inspection data is invalid or incomplete
 */
export class InvalidInspectionDataError extends KoreaPublicSDKError {
  public readonly inspectionId?: string;
  public readonly dataField?: string;

  constructor(message: string, inspectionId?: string, dataField?: string) {
    super(message, "INVALID_INSPECTION_DATA");
    if (inspectionId !== undefined) {
      this.inspectionId = inspectionId;
    }
    if (dataField !== undefined) {
      this.dataField = dataField;
    }
  }

  public toJSON() {
    const base = super.toJSON();
    const result: any = { ...base };
    if (this.inspectionId !== undefined) {
      result.inspectionId = this.inspectionId;
    }
    if (this.dataField !== undefined) {
      result.dataField = this.dataField;
    }
    return result;
  }
}

/**
 * Error thrown when management code format is invalid
 */
export class InvalidManagementCodeError extends KoreaPublicSDKError {
  public readonly managementCode?: string;

  constructor(message: string, managementCode?: string) {
    super(message, "INVALID_MANAGEMENT_CODE");
    if (managementCode !== undefined) {
      this.managementCode = managementCode;
    }
  }
}

/**
 * Error thrown when KOELSA service is temporarily unavailable
 */
export class KOELSAServiceError extends KoreaPublicSDKError {
  public readonly serviceEndpoint?: string;
  public readonly maintenanceUntil?: Date;

  constructor(
    message: string,
    serviceEndpoint?: string,
    maintenanceUntil?: Date
  ) {
    super(message, "KOELSA_SERVICE_ERROR");
    if (serviceEndpoint !== undefined) {
      this.serviceEndpoint = serviceEndpoint;
    }
    if (maintenanceUntil !== undefined) {
      this.maintenanceUntil = maintenanceUntil;
    }
  }
}
