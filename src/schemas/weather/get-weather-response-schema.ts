import { z } from "zod";

const weatherResponseExample = {
	location: {
		city: "Niterói",
		state: "Rio de Janeiro",
		country: "Brasil",
		latitude: -22.88333,
		longitude: -43.10361,
	},
	current: {
		time: "2026-09-16T13:00",
		temperature: 26.4,
		feelsLike: 28.1,
		humidity: 71,
		precipitation: 0,
		weatherCode: 2,
		windSpeed: 11.8,
	},
};

export const getWeatherResponseSchema = z
	.object({
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
	})
	.meta({
		example: weatherResponseExample,
	});
