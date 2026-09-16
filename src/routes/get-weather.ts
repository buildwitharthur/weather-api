import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import z from "zod";

import { getOpenMeteoGeocoding } from "../functions/get-openmeteo-geocoding";
import { getOpenMeteoWeather } from "../functions/get-openmeteo-weather";


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
                            interval: z.number(),
                            temperature_2m: z.number(),
                            relative_humidity_2m: z.number(),
                            apparent_temperature: z.number(),
                            precipitation: z.number(),
                            weather_code: z.number(),
                            wind_speed_10m: z.number(),
                            wind_direction_10m: z.number(),
                        }),

                        units: z.object({
                            time: z.string(),
                            interval: z.string(),
                            temperature_2m: z.string(),
                            relative_humidity_2m: z.string(),
                            apparent_temperature: z.string(),
                            precipitation: z.string(),
                            weather_code: z.string(),
                            wind_speed_10m: z.string(),
                            wind_direction_10m: z.string(),
                        }),
                    }),

                    404: z.object({
                        error: z.literal("CITY_NOT_FOUND"),
                        message: z.string(),
                    }),
                },
            },
        },
        async (request, reply) => {
            const { city } = request.query;

            const geocoding = await getOpenMeteoGeocoding(city);

            const location = geocoding.results?.[0];

            if (!location) {
                return reply.status(404).send({
                    error: "CITY_NOT_FOUND",
                    message: "City not found.",
                });
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
                current: weather.current,
                units: weather.current_units,
            });
        },
    );
};