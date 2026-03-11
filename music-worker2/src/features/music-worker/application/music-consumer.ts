import { Redis } from "ioredis";
import { PlaybackManager } from "../domain/services/playback-manager";

export class MusicConsumer {
  constructor(
    private redis: Redis,
    private playback: PlaybackManager,
  ) {}

  async start() {
    console.log("🎧 Worker esperando trabajos de música...");

    while (true) {
      // Bloquea el hilo hasta que llegue un mensaje (timeout de 30s)
      const result = await this.redis.brpop("music_jobs", 30);

      if (result) {
        const [_, message] = result;
        const payload = JSON.parse(message);

        console.log(
          `📦 Procesando comando: ${payload.type} para Guild: ${payload.guildId}`,
        );

        try {
          await this.playback.handleCommand(payload);
        } catch (err) {
          console.error("❌ Error procesando comando:", err);
        }
      }
    }
  }
}
