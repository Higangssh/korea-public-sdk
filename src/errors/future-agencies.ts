import { KoreaPublicSDKError } from "./base";

/**
 * Example errors for Korea Meteorological Administration (기상청)
 * These would be implemented when KMA APIs are added
 */

/**
 * Error thrown when weather station is not found
 */
export class WeatherStationNotFoundError extends KoreaPublicSDKError {
  public readonly stationId?: string;

  constructor(message: string, stationId?: string) {
    super(message, "WEATHER_STATION_NOT_FOUND");
    if (stationId !== undefined) {
      this.stationId = stationId;
    }
  }
}

/**
 * Error thrown when weather data is unavailable for requested period
 */
export class WeatherDataUnavailableError extends KoreaPublicSDKError {
  public readonly requestedPeriod?: string;
  public readonly availableFrom?: Date;

  constructor(message: string, requestedPeriod?: string, availableFrom?: Date) {
    super(message, "WEATHER_DATA_UNAVAILABLE");
    if (requestedPeriod !== undefined) {
      this.requestedPeriod = requestedPeriod;
    }
    if (availableFrom !== undefined) {
      this.availableFrom = availableFrom;
    }
  }
}

/**
 * Example errors for Korea Transportation Safety Authority (교통안전공단)
 * These would be implemented when KOTSA APIs are added
 */

/**
 * Error thrown when vehicle registration number is invalid
 */
export class InvalidVehicleRegistrationError extends KoreaPublicSDKError {
  public readonly registrationNumber?: string;

  constructor(message: string, registrationNumber?: string) {
    super(message, "INVALID_VEHICLE_REGISTRATION");
    if (registrationNumber !== undefined) {
      this.registrationNumber = registrationNumber;
    }
  }
}

/**
 * Error thrown when transportation safety data is restricted
 */
export class TransportationDataRestrictedError extends KoreaPublicSDKError {
  public readonly restrictionReason?: string;
  public readonly accessLevel?: string;

  constructor(
    message: string,
    restrictionReason?: string,
    accessLevel?: string
  ) {
    super(message, "TRANSPORTATION_DATA_RESTRICTED");
    if (restrictionReason !== undefined) {
      this.restrictionReason = restrictionReason;
    }
    if (accessLevel !== undefined) {
      this.accessLevel = accessLevel;
    }
  }
}
