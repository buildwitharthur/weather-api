import type { FastifyInstance } from "fastify";

import { hasZodFastifySchemaValidationErrors } from "fastify-type-provider-zod";

import { AppError } from "../errors/app-error";

export const registerErrorHandler = (app: FastifyInstance) => {
	app.setErrorHandler((error, request, reply) => {
		if (hasZodFastifySchemaValidationErrors(error)) {
			return reply.status(400).send({
				error: "VALIDATION_ERROR",
				message: error.validation[0].message ?? "Validation error.",
				statusCode: 400,
			});
		}

		if (error instanceof AppError) {
			return reply.status(error.statusCode).send({
				error: error.code,
				message: error.message,
				statusCode: error.statusCode,
			});
		}

		request.log.error(error);

		return reply.status(500).send({
			error: "INTERNAL_SERVER_ERROR",
			message: "An unexpected error occurred.",
			statusCode: 500,
		});
	});
};
