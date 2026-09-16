import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";

import { CityNotFoundError } from "../errors/city-not-found-error";
import { getForecast } from "../functions/get-forecast";
import { getOpenMeteoGeocoding } from "../functions/get-openmeteo-geocoding";
import { cityNotFoundResponseSchema } from "../schemas/weather/city-not-found-response-schema";
import { getWeatherForecastQuerySchema } from "../schemas/weather/get-weather-forecast-query-schema";
import { getWeatherForecastResponseSchema } from "../schemas/weather/get-weather-forecast-response-schema";
import { weatherProviderUnavailableResponseSchema } from "../schemas/weather/weather-provider-unavailable-response-schema";

export const getWeatherForecast: FastifyPluginAsyncZod = async (app) => {
	app.get(
		"/weather/forecast",
		{
			schema: {
				tags: ["Weather"],
				description:
					"Returns the weather forecast for a city for a specified number of days.",
				operationId: "getWeatherForecast",

				querystring: getWeatherForecastQuerySchema,

				response: {
					200: getWeatherForecastResponseSchema,
					404: cityNotFoundResponseSchema,
					503: weatherProviderUnavailableResponseSchema,
				},
			},
		},
		async (request, reply) => {
			const { city, days } = request.query;

			const geocoding = await getOpenMeteoGeocoding(city);

			const location = geocoding.results?.[0];

			if (!location) {
				throw new CityNotFoundError();
			}

			const forecast = await getForecast(
				location.latitude,
				location.longitude,
				days,
			);

			const forecastDays = forecast.daily.time.map((date, index) => ({
				date,
				weatherCode: forecast.daily.weather_code[index],
				temperatureMax: forecast.daily.temperature_2m_max[index],
				temperatureMin: forecast.daily.temperature_2m_min[index],
				precipitationProbability:
					forecast.daily.precipitation_probability_max[index],
				sunrise: forecast.daily.sunrise[index],
				sunset: forecast.daily.sunset[index],
			}));

			return reply.status(200).send({
				location: {
					city: location.name,
					state: location.admin1,
					country: location.country,
					latitude: location.latitude,
					longitude: location.longitude,
				},
				forecast: forecastDays,
			});
		},
	);
};
