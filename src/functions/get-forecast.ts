import { WeatherProviderUnavailableError } from "../errors/weather-provider-unavailable-error";
import { getRedisData, saveRedisData } from "../lib/redis";
import { cacheKeys } from "../utils/cache-keys";
import { CACHE_TTL } from "../utils/cache-ttl";

export interface ForecastResponse {
	latitude: number;
	longitude: number;
	generationtime_ms: number;
	utc_offset_seconds: number;
	timezone: string;
	timezone_abbreviation: string;
	elevation: number;

	daily_units: {
		time: string;
		weather_code: string;
		temperature_2m_max: string;
		temperature_2m_min: string;
		precipitation_probability_max: string;
		sunrise: string;
		sunset: string;
	};

	daily: {
		time: string[];
		weather_code: number[];
		temperature_2m_max: number[];
		temperature_2m_min: number[];
		precipitation_probability_max: number[];
		sunrise: string[];
		sunset: string[];
	};
}

const buildForecastUrl = (
	latitude: number,
	longitude: number,
	days: number,
) => {
	const url = new URL("https://api.open-meteo.com/v1/forecast");

	url.searchParams.append("latitude", latitude.toString());
	url.searchParams.append("longitude", longitude.toString());

	url.searchParams.append(
		"daily",
		[
			"weather_code",
			"temperature_2m_max",
			"temperature_2m_min",
			"precipitation_probability_max",
			"sunrise",
			"sunset",
		].join(","),
	);

	url.searchParams.append("forecast_days", days.toString());
	url.searchParams.append("timezone", "auto");

	return url;
};

export const getForecast = async (
	latitude: number,
	longitude: number,
	days: number,
): Promise<ForecastResponse> => {
	const cacheKey = cacheKeys.forecast(latitude, longitude, days);

	const cached = await getRedisData<ForecastResponse>(cacheKey);

	if (cached) {
		return cached;
	}

	const url = buildForecastUrl(latitude, longitude, days);

	let response: Response;

	try {
		response = await fetch(url, {
			signal: AbortSignal.timeout(5000),
		});

		if (!response.ok) {
			throw new WeatherProviderUnavailableError();
		}
	} catch {
		throw new WeatherProviderUnavailableError();
	}

	const data = (await response.json()) as ForecastResponse;

	await saveRedisData(cacheKey, data, CACHE_TTL.FORECAST);

	return data;
};
