import cors from "@fastify/cors";
import type { FastifyInstance } from "fastify";

export const registerCors = (app: FastifyInstance) => {
	app.register(cors, { origin: true });
};
