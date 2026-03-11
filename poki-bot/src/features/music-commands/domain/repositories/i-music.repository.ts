import { PlaybackMode, type Track } from "../entities/music.ts";

export interface IMusicRepository {
  // Estado general
  setPlayerState(
    guildId: string,
    mode: PlaybackMode,
    voiceId: string,
    track?: Track,
  ): Promise<void>;

  // Específicos de Queue
  pushToQueue(guildId: string, track: Track): Promise<void>;

  // Específicos de 24/7
  addToPersistentRegistry(guildId: string): Promise<void>;
  removeFromPersistentRegistry(guildId: string): Promise<void>;

  // Comunicación con Worker (Docker B)
  notifyWorker(guildId: string, type: "START" | "STOP" | "SKIP"): Promise<void>;
}
