import { z } from "zod";

export const getWeatherQuerySchema = z.object({
	city: z
		.string("City name must be a string")
		.trim()
		.toLowerCase()
		.min(1, "City name is required")
		.max(100, "City name is too long"),
});
