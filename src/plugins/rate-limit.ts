import rateLimit from "@fastify/rate-limit";
import type { FastifyInstance } from "fastify";

export const registerRateLimit = (app: FastifyInstance) => {
	app.register(rateLimit, {
		max: 20,
		timeWindow: "1 minute",
		cache: 10000,
		errorResponseBuilder: (_request, context) => ({
			statusCode: 429,
			error: "Too Many Requests",
			message: `Rate limit exceeded. Retry in ${context.after}.`,
		}),
	});
};
