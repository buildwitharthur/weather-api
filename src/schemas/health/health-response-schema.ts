import { z } from "zod";

export const healthResponseSchema = z.object({
	status: z.enum(["ok", "degraded", "unavailable"]),
	service: z.literal("weather-api"),
	redis: z.enum(["connected", "disconnected"]).optional(),
	timestamp: z.string().datetime(),
});
