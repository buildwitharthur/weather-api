export const cacheKeys = {
	geocoding: (city: string) => `geocoding:${city}:br`,

	currentWeather: (latitude: number, longitude: number) =>
		`weather:current:${latitude}:${longitude}`,
};
