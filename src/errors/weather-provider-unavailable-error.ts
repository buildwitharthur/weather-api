import { AppError } from "./app-error";

export class WeatherProviderUnavailableError extends AppError {
	constructor() {
		super(
			"WEATHER_PROVIDER_UNAVAILABLE",
			503,
			"Weather information is temporarily unavailable.",
		);
	}
}
