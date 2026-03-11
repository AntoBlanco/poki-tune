import type { IPlayerRepository } from "../interfaces/i-player-repository.js";
import { AudioProvider } from "../../infra/lavalink/audio-provider.js";
import { PlaybackMode } from "../entities/music.js"; // Importa el Enum

export class PlaybackManager {
  constructor(
    private playerRepo: IPlayerRepository,
    private audio: AudioProvider,
  ) {}

  async handleCommand(payload: { guildId: string; type: string }) {
    const state = await this.playerRepo.getState(payload.guildId);

    // Si no hay estado o no hay canal de voz, salimos
    if (!state || !state.voiceChannelId) return;

    switch (state.mode) {
      case PlaybackMode.QUEUE:
        const next = await this.playerRepo.getNextFromQueue(payload.guildId);
        if (next) {
          // Si getNextFromQueue devuelve un string (JSON), lo parseamos
          // Si devuelve ya el objeto Track, usamos directamente .url
          const trackData = JSON.parse(next);
          await this.audio.play(
            payload.guildId,
            state.voiceChannelId,
            trackData.url,
          );
        }
        break;

      case PlaybackMode.LOOP_24_7:
      case PlaybackMode.LIVE:
        // ¡AQUÍ ESTÁ LA CORRECCIÓN!
        // state.currentTrack ya es de tipo Track | undefined gracias al repositorio
        if (state.currentTrack) {
          await this.audio.play(
            payload.guildId,
            state.voiceChannelId,
            state.currentTrack.url, // Ya puedes acceder directamente a .url
          );
        }
        break;
    }
  }

  async autoResume() {
    const guildIds = await this.playerRepo.get247Guilds();
    for (const guildId of guildIds) {
      const state = await this.playerRepo.getState(guildId);

      // state.currentTrack ya es el objeto Track
      if (state?.mode === PlaybackMode.LOOP_24_7 && state.currentTrack) {
        await this.audio.play(
          guildId,
          state.voiceChannelId,
          state.currentTrack.url,
        );
      }
    }
  }
}
