export class AppError extends Error {
	public readonly code: string;
	public readonly statusCode: number;

	constructor(code: string, statusCode: number, message: string) {
		super(message);
		this.name = "AppError";
		this.code = code;
		this.statusCode = statusCode;
	}
}
