import "dotenv/config";

import { z } from "zod";

const envSchema = z.object({
	NODE_ENV: z
		.enum(["development", "test", "production"])
		.default("development"),
	PORT: z.coerce.number().int().positive().max(65535).default(3000),
	REDIS_URL: z.string().url().default("redis://localhost:6379"),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
	console.error(
		"Invalid environment variables:",
		parsedEnv.error.flatten().fieldErrors,
	);
	throw new Error("Invalid environment variables");
}

export const env = parsedEnv.data;
