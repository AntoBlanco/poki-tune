import { loadConfig, type Config } from "./config/config.ts";
import { createRedisClient } from "./features/music-commands/infrastructure/redis/redis.client.ts";
import { DiscordBot } from "./features/music-commands/infrastructure/discord/bot.client.ts";
import { deploy } from "./features/music-commands/infrastructure/discord/deploy-commands.ts";

async function bootstrap() {
  const config: Config = loadConfig();
  if (process.env.NODE_ENV === "production") {
    console.log(
      "🛠️  Entorno de producción detectado. Sincronizando comandos...",
    );
    await deploy(config);
  }
  // 1. Inicializar Infraestructura
  const redis = createRedisClient(config);

  // 2. Inicializar Bot
  const bot = new DiscordBot(redis);

  // 3. Arrancar
  const token = config.discord.token
  if (!token) throw new Error("DISCORD_TOKEN no configurado");

  await bot.start(token);
}

bootstrap().catch(console.error);
