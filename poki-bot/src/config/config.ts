//TODO revisar estructura para datos de condiguración necesarias por ENV o por default
type Server = {
  host: string;
  port: number;
  env: string;
};

type Discord = {
  token: string; //TODO asegurar como podemos validar el undefined sin aseverar el tipo string
  clientId: string;
  guildId: string;
};

type Redis = {
  host: string;
  port: number;
  password?: string;
};

export type Config = {
  discord: Discord;
  redis: Redis;
  server: Server;
};

export function loadConfig(): Config {
  return {
    discord: {
      token: process.env.DISCORD_TOKEN!,
      clientId: process.env.DISCORD_CLIENT_ID!,
      guildId: process.env.DISCORD_GUILD_ID!,
    },
    redis: {
      host: process.env.REDIS_HOST || "localhost",
      port: Number(process.env.REDIS_PORT) || 6379,
      password: process.env.REDIS_PASSWORD,
    },
    server: {
      host: process.env.SERVER_HOST || "localhost",
      port: Number(process.env.SERVER_PORT) || 3000,
      env: process.env.NODE_ENV || "development",
    },
  };
}
