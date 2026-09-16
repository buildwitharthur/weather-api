import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import z from "zod";

import { CityNotFoundError } from "../errors/city-not-found-error";
import { getForecast } from "../functions/get-forecast";
import { getOpenMeteoGeocoding } from "../functions/get-openmeteo-geocoding";
import { errorResponseSchema } from "../schemas/error-response-schema";

export const getWeatherForecast: FastifyPluginAsyncZod = async (app) => {
	app.get(
		"/weather/forecast",
		{
			schema: {
				tags: ["Weather"],
				description:
					"Returns the weather forecast for a city for a specified number of days.",
				operationId: "getWeatherForecast",

				querystring: z.object({
					city: z
						.string("City name must be a string")
						.trim()
						.toLowerCase()
						.min(1, "City name is required")
						.max(100, "City name is too long"),

					days: z.coerce.number().int().min(1).max(7).default(5),
				}),

				response: {
					200: z.object({
						location: z.object({
							city: z.string(),
							state: z.string().optional(),
							country: z.string(),
							latitude: z.number(),
							longitude: z.number(),
						}),

						forecast: z.array(
							z.object({
								date: z.string(),
								weatherCode: z.number(),
								temperatureMax: z.number(),
								temperatureMin: z.number(),
								precipitationProbability: z.number(),
								sunrise: z.string(),
								sunset: z.string(),
							}),
						),
					}),

					404: errorResponseSchema,
					503: errorResponseSchema,
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
