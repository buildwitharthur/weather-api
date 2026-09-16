export const cacheKeys = {
	geocoding: (city: string) => `geocoding:${city}:br`,

	currentWeather: (latitude: number, longitude: number) =>
		`weather:current:${latitude}:${longitude}`,

	forecast: (latitude: number, longitude: number, days: number) =>
		`weather:forecast:${latitude}:${longitude}:${days}`,
};
