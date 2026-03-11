import { PlaybackMode, type Track } from "../../domain/entities/music";
import type { IMusicRepository } from "../../domain/repositories/i-music.repository";

export class PlayLiveUseCase {
  constructor(private musicRepo: IMusicRepository) {}

  async execute(guildId: string, voiceId: string, streamUrl: string, id: string) {
    const track: Track = {
        url: streamUrl,
        title: "Live Stream",
        requesterId: "system",
        duration: 0
    };

    await this.musicRepo.setPlayerState(
      guildId,
      PlaybackMode.LIVE,
      voiceId,
      track,
    );
    await this.musicRepo.notifyWorker(guildId, "START");
  }
}
