import { errorResponseSchema } from "../error-response-schema";

export const weatherProviderUnavailableResponseSchema =
	errorResponseSchema.meta({
		example: {
			error: "WEATHER_PROVIDER_UNAVAILABLE",
			message: "Weather information is temporarily unavailable.",
			statusCode: 503,
		},
	});
