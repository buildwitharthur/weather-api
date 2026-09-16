import { errorResponseSchema } from "../error-response-schema";

export const cityNotFoundResponseSchema = errorResponseSchema.meta({
	example: {
		error: "CITY_NOT_FOUND",
		message: "City not found.",
		statusCode: 404,
	},
});
