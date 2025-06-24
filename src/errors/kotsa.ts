import { KoreaPublicSDKError, ErrorCodes } from "./base";

/**
 * KOTSA (Korea Transportation Safety Authority) specific errors
 * 교통안전공단 관련 에러들
 */

/**
 * Error thrown when vehicle is not found
 */
export class VehicleNotFoundError extends KoreaPublicSDKError {
  public readonly vehicleNumber?: string;

  constructor(message: string, vehicleNumber?: string) {
    super(message, ErrorCodes.VEHICLE_NOT_FOUND);
    if (vehicleNumber !== undefined) {
      this.vehicleNumber = vehicleNumber;
    }
  }

  public toJSON() {
    const base = super.toJSON();
    const result: any = { ...base };
    if (this.vehicleNumber !== undefined) {
      result.vehicleNumber = this.vehicleNumber;
    }
    return result;
  }
}

/**
 * Error thrown when invalid vehicle number is provided
 */
export class InvalidVehicleNumberError extends KoreaPublicSDKError {
  public readonly vehicleNumber?: string;
  public readonly vehicleType?: string;

  constructor(message: string, vehicleNumber?: string, vehicleType?: string) {
    super(message, ErrorCodes.INVALID_VEHICLE_NUMBER);
    if (vehicleNumber !== undefined) {
      this.vehicleNumber = vehicleNumber;
    }
    if (vehicleType !== undefined) {
      this.vehicleType = vehicleType;
    }
  }

  public toJSON() {
    const base = super.toJSON();
    const result: any = { ...base };
    if (this.vehicleNumber !== undefined) {
      result.vehicleNumber = this.vehicleNumber;
    }
    if (this.vehicleType !== undefined) {
      result.vehicleType = this.vehicleType;
    }
    return result;
  }
}

/**
 * Error thrown when transport data is not available
 */
export class TransportDataNotAvailableError extends KoreaPublicSDKError {
  public readonly dataType?: string;
  public readonly accessLevel?: string;

  constructor(message: string, dataType?: string, accessLevel?: string) {
    super(message, ErrorCodes.TRANSPORT_DATA_NOT_AVAILABLE);
    if (dataType !== undefined) {
      this.dataType = dataType;
    }
    if (accessLevel !== undefined) {
      this.accessLevel = accessLevel;
    }
  }

  public toJSON() {
    const base = super.toJSON();
    const result: any = { ...base };
    if (this.dataType !== undefined) {
      result.dataType = this.dataType;
    }
    if (this.accessLevel !== undefined) {
      result.accessLevel = this.accessLevel;
    }
    return result;
  }
}

/**
 * Error thrown when KOTSA service has an error
 */
export class KOTSAServiceError extends KoreaPublicSDKError {
  public readonly serviceEndpoint?: string;
  public readonly maintenanceUntil?: Date;

  constructor(
    message: string,
    serviceEndpoint?: string,
    maintenanceUntil?: Date
  ) {
    super(message, ErrorCodes.KOTSA_SERVICE_ERROR);
    if (serviceEndpoint !== undefined) {
      this.serviceEndpoint = serviceEndpoint;
    }
    if (maintenanceUntil !== undefined) {
      this.maintenanceUntil = maintenanceUntil;
    }
  }

  public toJSON() {
    const base = super.toJSON();
    const result: any = { ...base };
    if (this.serviceEndpoint !== undefined) {
      result.serviceEndpoint = this.serviceEndpoint;
    }
    if (this.maintenanceUntil !== undefined) {
      result.maintenanceUntil = this.maintenanceUntil;
    }
    return result;
  }
}
