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

type lavalink = {
  host: string;
  port: number;
  password: string;
};
export type Config = {
  discord: Discord;
  redis: Redis;
  lavalink: lavalink;
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
    lavalink: {
      host: process.env.LAVALINK_HOST || "localhost",
      port: Number(process.env.LAVALINK_PORT) || 2333,
      password: process.env.LAVALINK_PASSWORD || "youshallnotpass",
    },
    server: {
      host: process.env.SERVER_HOST || "localhost",
      port: Number(process.env.SERVER_PORT) || 3000,
      env: process.env.NODE_ENV || "development",
    },
  };
}

export function printConfig(config: Config) {
  console.log("🔧 Configuración Cargada:");
  console.log(`- Discord Token: ${config.discord.token ? "✅" : "❌"}`);
  console.log(
    `- Redis Host: ${config.redis.host}:${config.redis.port} and ${config.redis.password ? "with password" : "no password"}`,
  );
  console.log(
    `- Lavalink Host: ${config.lavalink.host}:${config.lavalink.port} and ${config.lavalink.password ? "with password" : "no password"} ${config.lavalink.password}`,
  );
  console.log(`- Server: ${config.server.host}:${config.server.port} (${config.server.env})`);
}
// export function validateConfig(config: Config) {
//   if (!config.discord.token) {
//     throw new Error("DISCORD_TOKEN es obligatorio");
//   }
//   if (!config.discord.clientId) {
//     throw new Error("DISCORD_CLIENT_ID es obligatorio");
//   }
//   if (!config.discord.guildId) {
//     throw new Error("DISCORD_GUILD_ID es obligatorio");
//   }
//   // Podríamos agregar más validaciones aquí si es necesario
// }

// export function getConfig() {
//   const config = loadConfig();
//   validateConfig(config);
//   return config;
// }

// export default getConfig;
