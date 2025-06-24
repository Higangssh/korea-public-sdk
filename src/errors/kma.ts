import { KoreaPublicSDKError, ErrorCodes } from "./base";

/**
 * KMA (Korea Meteorological Administration) specific errors
 * 기상청 관련 에러들
 */

/**
 * Error thrown when weather station is not found
 */
export class WeatherStationNotFoundError extends KoreaPublicSDKError {
  public readonly stationId?: string;

  constructor(message: string, stationId?: string) {
    super(message, ErrorCodes.WEATHER_STATION_NOT_FOUND);
    if (stationId !== undefined) {
      this.stationId = stationId;
    }
  }

  public toJSON() {
    const base = super.toJSON();
    const result: any = { ...base };
    if (this.stationId !== undefined) {
      result.stationId = this.stationId;
    }
    return result;
  }
}

/**
 * Error thrown when weather data is not found
 */
export class WeatherDataNotFoundError extends KoreaPublicSDKError {
  public readonly requestedDate?: string;
  public readonly region?: string;

  constructor(message: string, requestedDate?: string, region?: string) {
    super(message, ErrorCodes.WEATHER_DATA_NOT_FOUND);
    if (requestedDate !== undefined) {
      this.requestedDate = requestedDate;
    }
    if (region !== undefined) {
      this.region = region;
    }
  }

  public toJSON() {
    const base = super.toJSON();
    const result: any = { ...base };
    if (this.requestedDate !== undefined) {
      result.requestedDate = this.requestedDate;
    }
    if (this.region !== undefined) {
      result.region = this.region;
    }
    return result;
  }
}

/**
 * Error thrown when invalid location code is provided
 */
export class InvalidLocationCodeError extends KoreaPublicSDKError {
  public readonly locationCode?: string;

  constructor(message: string, locationCode?: string) {
    super(message, ErrorCodes.INVALID_LOCATION_CODE);
    if (locationCode !== undefined) {
      this.locationCode = locationCode;
    }
  }

  public toJSON() {
    const base = super.toJSON();
    const result: any = { ...base };
    if (this.locationCode !== undefined) {
      result.locationCode = this.locationCode;
    }
    return result;
  }
}

/**
 * Error thrown when KMA service has an error
 */
export class KMAServiceError extends KoreaPublicSDKError {
  public readonly serviceEndpoint?: string;
  public readonly maintenanceUntil?: Date;

  constructor(
    message: string,
    serviceEndpoint?: string,
    maintenanceUntil?: Date
  ) {
    super(message, ErrorCodes.KMA_SERVICE_ERROR);
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
