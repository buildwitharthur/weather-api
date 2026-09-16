import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import z from "zod";

export const getWeather: FastifyPluginAsyncZod = async (app) => {
	app.get(
		"/weather",
		{
			schema: {
				querystring: z.object({
					city: z
						.string("City name must be a string")
						.trim()
						.toLowerCase()
						.min(1, "City name is required")
						.max(100, "City name is too long"),
				}),
				operationId: "getWeather",
			},
		},
		async (request, response) => {

			const { city } = request.query;

			
			const weatherData = {
				city,
				temperature: 25, 
				condition: "Sunny", 
			};

			return response.send(weatherData);
		},
	);
};
