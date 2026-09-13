import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";

import { pingRedis } from "../lib/redis";

const healthCheckResponseSchema = z.object({
	status: z.enum(["ok", "degraded", "unavailable"]),
	service: z.literal("weather-api"),
	redis: z.enum(["connected", "disconnected"]).optional(),
	timestamp: z.string().datetime(),
});

export const healthCheck: FastifyPluginAsyncZod = async (app) => {
	app.get(
		"/health",
		{
			schema: {
				response: {
					200: healthCheckResponseSchema,
				},
			},
		},
		async (_, reply) => {
			const redisStatus = await pingRedis();

			const status = redisStatus === "connected" ? "ok" : "degraded";

			return reply.code(200).send({
				status,
				service: "weather-api",
				redis: redisStatus,
				timestamp: new Date().toISOString(),
			});
		},
	);
};
