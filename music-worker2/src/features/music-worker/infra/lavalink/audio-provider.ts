import { Shoukaku, Connectors, type NodeOption } from "shoukaku";
// ✅ CAMBIO: Importamos el paquete completo para compatibilidad con Node ESM
import * as Discord from "discord.js";
const { Client, Intents } = Discord as any;

// 2. Importamos solo los TIPOS (para que TS no se queje)
import type { Client as ClientType } from "discord.js";

import { Redis } from "ioredis";
import type { Config } from "../../../../config/config.js"; // Añadido .js por si acaso

export class AudioProvider {
  public shoukaku: Shoukaku | null = null;
  private client: ClientType;
  private config: Config;

  constructor(
    private redis: Redis,
    config: Config,
  ) {
    this.config = config;
    // ✅ Ahora Intents funcionará correctamente
    this.client = new Client({
      intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_VOICE_STATES],
    });
  }

  async init(token: string) {
    await this.client.login(token);
    console.log(`✅ Discord Client del Worker iniciado como ${this.client.user?.tag}`);

    const nodes: NodeOption[] = [
      {
        name: "Local-Lavalink",
        url: `${this.config.lavalink.host}:${this.config.lavalink.port}`,
        auth: this.config.lavalink.password,
        secure: false,
      },
    ];

    this.shoukaku = new Shoukaku(new Connectors.DiscordJS(this.client), nodes, {
      moveOnDisconnect: true,
      resume: false,
      reconnectTries: 10,
      restTimeout: 15000,
      reconnectInterval: 5000,
      userAgent: `PokiBot/${this.client.user?.id}`,
    });

    this.setupEventListeners();
  }

  private setupEventListeners() {
    if (!this.shoukaku) return;

    this.shoukaku.on("error", (name, error) =>
      console.error(`❌ Node ${name} error:`, error),
    );
    this.shoukaku.on("ready", (name) =>
      console.log(`✅ Lavalink Node ${name} listo`),
    );
  }

  async play(guildId: string, voiceId: string, url: string) {
    if (!this.shoukaku) throw new Error("Shoukaku no ha sido inicializado");

    const node = this.shoukaku.options.nodeResolver(this.shoukaku.nodes);
    if (!node) throw new Error("No hay nodos de Lavalink disponibles");

    const result = await node.rest.resolve(url);
    if (!result?.data || result.loadType === "empty" || result.loadType === "error") return;

    const track = Array.isArray(result.data)
      ? result.data[0]
      : (result.data as any).tracks?.[0] || result.data;

    const player = await this.shoukaku.joinVoiceChannel({
      guildId,
      channelId: voiceId,
      shardId: 0,
    });

    await player.playTrack({ track: track.encoded || track });

    player.on("end", async () => {
      await this.redis.lpush(
        "music_jobs",
        JSON.stringify({
          type: "NEXT_TRACK",
          guildId,
        }),
      );
    });
  }
}