import { Redis } from "ioredis";
import type { IPlayerRepository, PlayerState, } from "../../domain/interfaces/i-player-repository";
import { PlaybackMode, Player } from "../../domain/entities/music";

export class RedisPlayerRepository implements IPlayerRepository {
  constructor(private redis: Redis) {}

  async getState(guildId: string): Promise<Player | null> {
    const data = await this.redis.hgetall(`player:${guildId}`);

    if (!data || !data.mode || !data.voiceChannelId) {
      return null;
    }

    return new Player(
      guildId,
      data.voiceChannelId,
      data.mode as PlaybackMode,
      data.currentTrack ? JSON.parse(data.currentTrack) : undefined,
    );
  }

  async getNextFromQueue(guildId: string): Promise<string | null> {
    return await this.redis.lpop(`queue:${guildId}`);
  }

  async get247Guilds(): Promise<string[]> {
    return await this.redis.smembers("active_247_channels");
  }
}
