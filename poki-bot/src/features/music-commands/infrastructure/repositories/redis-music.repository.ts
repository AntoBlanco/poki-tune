import { Redis } from "ioredis";
import type { IMusicRepository } from "../../domain/repositories/i-music.repository";
import { PlaybackMode, type Track } from "../../domain/entities/music";

export class RedisMusicRepository implements IMusicRepository {
  constructor(private redis: Redis) {}

  async setPlayerState(
    guildId: string,
    mode: PlaybackMode,
    voiceId: string,
    track?: Track,
  ): Promise<void> {
    await this.redis.hset(`player:${guildId}`, {
      mode,
      voiceChannelId: voiceId,
      currentTrack: track ? JSON.stringify(track) : "",
    });
  }

  async pushToQueue(guildId: string, track: Track): Promise<void> {
    await this.redis.rpush(`queue:${guildId}`, JSON.stringify(track));
  }

  async addToPersistentRegistry(guildId: string): Promise<void> {
    await this.redis.sadd("active_247_channels", guildId);
  }

  async removeFromPersistentRegistry(guildId: string): Promise<void> {
    await this.redis.srem("active_247_channels", guildId);
  }

  async notifyWorker(guildId: string, type: string): Promise<void> {
    const payload = { type, guildId, timestamp: Date.now() };
    await this.redis.lpush("music_jobs", JSON.stringify(payload));
  }
}
