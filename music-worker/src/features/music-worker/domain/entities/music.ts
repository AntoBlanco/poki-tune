export enum PlaybackMode {
  QUEUE = "QUEUE",
  LIVE = "LIVE",
  LOOP_24_7 = "LOOP_24_7",
}

export interface Track {
  url: string;
  title: string;
  requesterId: string;
  duration?: number;
}

export class Player {
  constructor(
    public readonly guildId: string,
    public readonly voiceChannelId: string,
    public readonly mode: PlaybackMode, // Usa el enum de arriba
    public readonly currentTrack?: Track,
  ) {}
}