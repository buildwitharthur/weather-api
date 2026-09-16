export interface WeatherResponse {
	latitude: number;
	longitude: number;
	generationtime_ms: number;
	utc_offset_seconds: number;
	timezone: string;
	timezone_abbreviation: string;
	elevation: number;

	current_units: {
		time: string;
		interval: string;
		temperature_2m: string;
		relative_humidity_2m: string;
		apparent_temperature: string;
		precipitation: string;
		weather_code: string;
		wind_speed_10m: string;
		wind_direction_10m: string;
	};

	current: {
		time: string;
		interval: number;
		temperature_2m: number;
		relative_humidity_2m: number;
		apparent_temperature: number;
		precipitation: number;
		weather_code: number;
		wind_speed_10m: number;
		wind_direction_10m: number;
	};
}

const buildWeatherUrl = (latitude: number, longitude: number) => {
	const url = new URL("https://api.open-meteo.com/v1/forecast");

	url.searchParams.append("latitude", latitude.toString());
	url.searchParams.append("longitude", longitude.toString());

	url.searchParams.append(
		"current",
		[
			"temperature_2m",
			"relative_humidity_2m",
			"apparent_temperature",
			"precipitation",
			"weather_code",
			"wind_speed_10m",
			"wind_direction_10m",
		].join(","),
	);

	url.searchParams.append("timezone", "auto");

	return url;
};

export const getOpenMeteoWeather = async (
	latitude: number,
	longitude: number,
): Promise<WeatherResponse> => {
	const url = buildWeatherUrl(latitude, longitude);

	const response = await fetch(url);

	return (await response.json()) as WeatherResponse;
};
