import { WeatherProviderUnavailableError } from "../errors/weather-provider-unavailable-error";
import { getRedisData, saveRedisData } from "../lib/redis";
import { cacheKeys } from "../utils/cache-keys";
import { CACHE_TTL } from "../utils/cache-ttl";

export type GeocodingResult = {
	id: number;
	name: string;
	latitude: number;
	longitude: number;
	elevation: number;
	feature_code: string;
	country_code: string;
	admin1_id?: number;
	admin2_id?: number;
	timezone: string;
	population?: number;
	country_id: number;
	country: string;
	admin1?: string;
	admin2?: string;
};

export interface GeocodingResponse {
	results?: GeocodingResult[];
	generationtime_ms: number;
}

const buildGeocodingUrl = (city: string) => {
	const url = new URL("https://geocoding-api.open-meteo.com/v1/search");

	url.searchParams.append("name", city);
	url.searchParams.append("count", "1");
	url.searchParams.append("language", "pt");
	url.searchParams.append("countryCode", "BR");

	return url;
};

export const getOpenMeteoGeocoding = async (
	city: string,
): Promise<GeocodingResponse> => {
	const cacheKey = cacheKeys.geocoding(city);

	const cached = await getRedisData<GeocodingResponse>(cacheKey);

	if (cached) {
		return cached;
	}

	const url = buildGeocodingUrl(city);

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

	const data = (await response.json()) as GeocodingResponse;

	await saveRedisData(cacheKey, data, CACHE_TTL.GEOCODING);

	return data;
};
