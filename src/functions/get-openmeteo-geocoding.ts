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
	const url = buildGeocodingUrl(city);

	const response = await fetch(url);

	return (await response.json()) as GeocodingResponse;
};
