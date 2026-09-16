import swagger from "@fastify/swagger";
import scalar from "@scalar/fastify-api-reference";
import type { FastifyInstance } from "fastify";
import { jsonSchemaTransform } from "fastify-type-provider-zod";

export const registerDocs = (app: FastifyInstance) => {
	app.register(swagger, {
		openapi: {
			info: {
				title: "Weather API",
				description: "API for weather data.",
				version: "1.0.0",
			},
		},
		transform: jsonSchemaTransform,
	});

	app.register(scalar, {
		routePrefix: "/docs",
		configuration: {
			url: "/openapi.json",
		},
	});

	app.get("/openapi.json", () => app.swagger());
};
