import { AppError } from "./app-error";

export class CityNotFoundError extends AppError {
	constructor() {
		super("CITY_NOT_FOUND", 404, "City not found.");
	}
}
