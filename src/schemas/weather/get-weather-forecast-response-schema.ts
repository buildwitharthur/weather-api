import { z } from "zod";

const forecastResponseExample = {
	location: {
		city: "Niterói",
		state: "Rio de Janeiro",
		country: "Brasil",
		latitude: -22.88333,
		longitude: -43.10361,
	},
	forecast: [
		{
			date: "2026-09-16",
			weatherCode: 51,
			temperatureMax: 21.7,
			temperatureMin: 18.5,
			precipitationProbability: 100,
			sunrise: "2026-09-16T05:47",
			sunset: "2026-09-16T17:46",
		},
		{
			date: "2026-09-17",
			weatherCode: 51,
			temperatureMax: 22.1,
			temperatureMin: 18,
			precipitationProbability: 2,
			sunrise: "2026-09-17T05:46",
			sunset: "2026-09-17T17:46",
		},
		{
			date: "2026-09-18",
			weatherCode: 51,
			temperatureMax: 22.9,
			temperatureMin: 18.5,
			precipitationProbability: 33,
			sunrise: "2026-09-18T05:45",
			sunset: "2026-09-18T17:47",
		},
	],
};

export const getWeatherForecastResponseSchema = z
	.object({
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
	})
	.meta({
		example: forecastResponseExample,
	});
