import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";

import { pingRedis } from "../lib/redis";
import { healthResponseSchema } from "../schemas/health/health-response-schema";

export const healthCheck: FastifyPluginAsyncZod = async (app) => {
	app.get(
		"/health",
		{
			schema: {
				tags: ["Health"],
				description: "Returns the health status of the application.",
				operationId: "healthCheck",

				response: {
					200: healthResponseSchema,
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
