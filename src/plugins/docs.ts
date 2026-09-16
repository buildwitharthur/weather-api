import swagger from "@fastify/swagger";
import scalar from "@scalar/fastify-api-reference";
import type { FastifyInstance } from "fastify";
import { jsonSchemaTransform } from "fastify-type-provider-zod";

export const registerDocs = (app: FastifyInstance) => {
	app.register(swagger, {
		openapi: {
			info: {
				title: "ArthurLabs Weather API",
				description:
					"Weather data through Open-Meteo, with Redis caching and fault handling.",
				version: "1.0.0",
			},

			tags: [
				{
					name: "Weather",
					description: "Current weather and forecast endpoints.",
				},
				{
					name: "Health",
					description: "Application health and dependency status.",
				},
			],
		},

		transform: jsonSchemaTransform,
	});

	app.register(scalar, {
		routePrefix: "/docs",

		configuration: {
			url: "/openapi.json",
			favicon: "/favicon.png",
			layout: "modern",
			theme: "moon",
			showSidebar: false,
			pageTitle: "ArthurLabs Weather API",
		},
	});

	app.get("/openapi.json", () => app.swagger());
};
