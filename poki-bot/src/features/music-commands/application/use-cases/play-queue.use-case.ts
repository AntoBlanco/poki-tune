import type { IMusicRepository } from "../../domain/repositories/i-music.repository";
import { PlaybackMode, type Track } from "../../domain/entities/music";

export class PlayQueueUseCase {
  constructor(private musicRepo: IMusicRepository) {}

  async execute(guildId: string, voiceId: string, track: Track) {
    await this.musicRepo.setPlayerState(
      guildId,
      PlaybackMode.QUEUE,
      voiceId,
      track,
    );
    await this.musicRepo.pushToQueue(guildId, track);
    await this.musicRepo.notifyWorker(guildId, "START");
  }
}
