import cors from "@fastify/cors";
import rateLimit from "@fastify/rate-limit";
import swagger from "@fastify/swagger";
import scalar from "@scalar/fastify-api-reference";
import { fastify } from "fastify";
import {
	jsonSchemaTransform,
	serializerCompiler,
	validatorCompiler,
} from "fastify-type-provider-zod";
import { env } from "./lib/env";
import { healthCheck } from "./routes/healthcheck";
import { getWeather } from "./routes/get-weather";

const app = fastify({ logger: true }).withTypeProvider();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);
app.register(cors, { origin: true });

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

app.register(healthCheck);
app.register(getWeather);

app.listen({ host: "0.0.0.0", port: env.PORT });
