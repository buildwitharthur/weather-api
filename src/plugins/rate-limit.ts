import rateLimit from "@fastify/rate-limit";
import type { FastifyInstance } from "fastify";

import { TooManyRequestsError } from "../errors/too-many-requests-error";

export const registerRateLimit = (app: FastifyInstance) => {
	app.register(rateLimit, {
		max: 20,
		timeWindow: "1 minute",
		cache: 10000,
		errorResponseBuilder: (_request, context) =>
			new TooManyRequestsError(
				`Rate limit exceeded. Retry in ${context.after}.`,
			),
	});
};
