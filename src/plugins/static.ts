import path from "node:path";
import fastifyStatic from "@fastify/static";
import type { FastifyInstance } from "fastify";

export const registerStatic = (app: FastifyInstance) => {
	app.register(fastifyStatic, {
		root: path.join(__dirname, "..", "..", "public"),
	});
};
