export enum PlaybackMode {
  QUEUE = "QUEUE",
  LIVE = "LIVE",
  LOOP_24_7 = "LOOP_24_7",
}

export interface Track {
  url: string;
  title: string;
  requesterId: string;
  duration: number;
}

export interface PlayerState {
  guildId: string;
  voiceChannelId: string;
  mode: PlaybackMode;
  currentTrack?: Track;
}
