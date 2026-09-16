import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";

import { CityNotFoundError } from "../errors/city-not-found-error";
import { getOpenMeteoGeocoding } from "../functions/get-openmeteo-geocoding";
import { getOpenMeteoWeather } from "../functions/get-openmeteo-weather";
import { cityNotFoundResponseSchema } from "../schemas/weather/city-not-found-response-schema";
import { getWeatherQuerySchema } from "../schemas/weather/get-weather-query-schema";
import { getWeatherResponseSchema } from "../schemas/weather/get-weather-response-schema";
import { weatherProviderUnavailableResponseSchema } from "../schemas/weather/weather-provider-unavailable-response-schema";

export const getWeather: FastifyPluginAsyncZod = async (app) => {
	app.get(
		"/weather",
		{
			schema: {
				tags: ["Weather"],
				description: "Returns the current weather for a city.",
				operationId: "getWeather",

				querystring: getWeatherQuerySchema,

				response: {
					200: getWeatherResponseSchema,
					404: cityNotFoundResponseSchema,
					503: weatherProviderUnavailableResponseSchema,
				},
			},
		},
		async (request, reply) => {
			const { city } = request.query;

			const geocoding = await getOpenMeteoGeocoding(city);

			const location = geocoding.results?.[0];

			if (!location) {
				throw new CityNotFoundError();
			}

			const weather = await getOpenMeteoWeather(
				location.latitude,
				location.longitude,
			);

			return reply.status(200).send({
				location: {
					city: location.name,
					state: location.admin1,
					country: location.country,
					latitude: location.latitude,
					longitude: location.longitude,
				},
				current: {
					time: weather.current.time,
					temperature: weather.current.temperature_2m,
					feelsLike: weather.current.apparent_temperature,
					humidity: weather.current.relative_humidity_2m,
					precipitation: weather.current.precipitation,
					weatherCode: weather.current.weather_code,
					windSpeed: weather.current.wind_speed_10m,
				},
			});
		},
	);
};
