import { PlaybackMode, type Track } from "../../domain/entities/music";
import type { IMusicRepository } from "../../domain/repositories/i-music.repository";

export class Setup247UseCase {
  constructor(private musicRepo: IMusicRepository) {}

  async execute(
    guildId: string,
    voiceId: string,
    track: Track,
    enable: boolean,
  ) {
    if (enable) {
      await this.musicRepo.setPlayerState(
        guildId,
        PlaybackMode.LOOP_24_7,
        voiceId,
        track,
      );
      await this.musicRepo.addToPersistentRegistry(guildId);
      await this.musicRepo.notifyWorker(guildId, "START");
    } else {
      await this.musicRepo.removeFromPersistentRegistry(guildId);
      await this.musicRepo.notifyWorker(guildId, "STOP");
    }
  }
}