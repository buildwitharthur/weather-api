import { AppError } from "./app-error";

export class TooManyRequestsError extends AppError {
	constructor(message: string) {
		super("TOO_MANY_REQUESTS", 429, message);
	}
}
