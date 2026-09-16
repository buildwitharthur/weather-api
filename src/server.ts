import { fastify } from "fastify";
import {
	serializerCompiler,
	validatorCompiler,
} from "fastify-type-provider-zod";
import { env } from "./lib/env";
import { registerCors } from "./plugins/cors";
import { registerDocs } from "./plugins/docs";
import { registerErrorHandler } from "./plugins/error-handler";
import { registerRateLimit } from "./plugins/rate-limit";
import { getWeather } from "./routes/get-weather";
import { getWeatherForecast } from "./routes/get-weather-forecast";
import { healthCheck } from "./routes/healthcheck";

const app = fastify({ logger: true }).withTypeProvider();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

registerErrorHandler(app);
registerCors(app);
registerRateLimit(app);
registerDocs(app);

app.register(healthCheck);
app.register(getWeather);
app.register(getWeatherForecast);

app.listen({ host: "0.0.0.0", port: env.PORT });
