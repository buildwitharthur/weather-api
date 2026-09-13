import Redis from "ioredis";
import { env } from "./env";

const redis = new Redis(env.REDIS_URL, {
	maxRetriesPerRequest: 1,
	enableReadyCheck: true,
	lazyConnect: true,
});

redis.on("connect", () => {
	console.log("Redis connected.");
});

redis.on("error", (error) => {
	console.error("Redis connection error:", error);
});

export const pingRedis = async (): Promise<"connected" | "disconnected"> => {
	try {
		return (await redis.ping()) === "PONG" ? "connected" : "disconnected";
	} catch {
		return "disconnected";
	}
};

export const getRedisData = async <T>(key: string): Promise<T | null> => {
	try {
		const data = await redis.get(key);
		return data ? (JSON.parse(data) as T) : null;
	} catch (error) {
		console.error("Redis read error:", error);
		return null;
	}
};

export const deleteRedisData = async (key: string) =>
	Boolean((await redis.del(key)) > 0);

export const saveRedisData = async <T>(
	key: string,
	data: T,
	ttlInSeconds: number,
) => {
	try {
		await redis.set(key, JSON.stringify(data), "EX", ttlInSeconds);
	} catch (error) {
		console.error("Redis write error:", error);
	}
};

export const updateRedisData = async <T>(
	key: string,
	data: T,
	ttlInSeconds: number,
) => await redis.set(key, JSON.stringify(data), "EX", ttlInSeconds);
