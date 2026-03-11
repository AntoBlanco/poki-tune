import Redis from "ioredis";
import type { Config } from "../../../../config/config";

export const createRedisClient = (config:Config) => {
  const client = new Redis({
    host: config.redis.host || "localhost",
    port: config.redis.port || 6379,
    password: config.redis.password,
  });

  client.on("error", (err) => console.error("Redis Error:", err));
  client.on("connect", () => console.log("✅ Conectado a Redis"));

  return client;
};