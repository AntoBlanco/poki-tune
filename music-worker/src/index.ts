import Redis from "ioredis";
import { AudioProvider } from "./features/music-worker/infra/lavalink/audio-provider";
import { PlaybackManager } from "./features/music-worker/domain/services/playback-manager";
import { MusicConsumer } from "./features/music-worker/application/music-consumer";
import { loadConfig } from "./config/config";
import { RedisPlayerRepository } from './features/music-worker/infra/redis/redis-player.repository';

async function main() {
  const config = loadConfig();
  const redis = new Redis({ host: config.redis.host, port: config.redis.port, password: config.redis.password });
  
  // Capa Infra
  const playerRepo = new RedisPlayerRepository(redis);
  const audioProvider = new AudioProvider(redis,config);
  
  // Capa Dominio
  const playbackManager = new PlaybackManager(playerRepo, audioProvider);
  
  // Capa Aplicación
  const consumer = new MusicConsumer(redis, playbackManager);

  await audioProvider.init(config.discord.token);
  await playbackManager.autoResume();
  await consumer.start();
}

main().catch(console.error);
