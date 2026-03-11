import { PlaybackMode, Player } from "../entities/music.js";

export interface PlayerState {
  mode: PlaybackMode;
  voiceChannelId: string;
  currentTrack?: string;
}

export interface IPlayerRepository {
  getState(guildId: string): Promise<Player | null>;
  getNextFromQueue(guildId: string): Promise<string | null>; // Devuelve el JSON o URL del track
  get247Guilds(): Promise<string[]>;
}


