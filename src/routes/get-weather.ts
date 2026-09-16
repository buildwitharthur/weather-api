import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import z from "zod";

import { CityNotFoundError } from "../errors/city-not-found-error";
import { getOpenMeteoGeocoding } from "../functions/get-openmeteo-geocoding";
import { getOpenMeteoWeather } from "../functions/get-openmeteo-weather";
import { errorResponseSchema } from "../schemas/error-response-schema";

export const getWeather: FastifyPluginAsyncZod = async (app) => {
	app.get(
		"/weather",
		{
			schema: {
				tags: ["Weather"],
				description: "Returns the current weather for a city.",
				operationId: "getWeather",

				querystring: z.object({
					city: z
						.string("City name must be a string")
						.trim()
						.toLowerCase()
						.min(1, "City name is required")
						.max(100, "City name is too long"),
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

						current: z.object({
							time: z.string(),
							temperature: z.number(),
							feelsLike: z.number(),
							humidity: z.number(),
							precipitation: z.number(),
							weatherCode: z.number(),
							windSpeed: z.number(),
						}),
					}),

					404: errorResponseSchema,
					503: errorResponseSchema,
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
