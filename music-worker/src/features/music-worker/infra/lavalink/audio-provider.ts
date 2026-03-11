import { Shoukaku, Connectors, type NodeOption } from "shoukaku";
import { Client, GatewayIntentBits } from "discord.js"; // Necesitamos esto
import { Redis } from "ioredis";
import type { Config } from "../../../../config/config";

export class AudioProvider {
  public shoukaku: Shoukaku;
  private client: Client;

  constructor(private redis: Redis, config: Config) {
    // 1. Creamos un cliente de Discord para el Worker
    // Este cliente necesita intents de voz para que Shoukaku funcione
    this.client = new Client({
      intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates],
    });

    const nodes: NodeOption[] = [
      {
        name: "Local-Lavalink",
        url: `${config.lavalink.host}:${config.lavalink.port}`,
        auth: config.lavalink.password,
        secure: false,
      },
    ];

    // 2. Pasamos el cliente al Conector
    this.shoukaku = new Shoukaku(new Connectors.DiscordJS(this.client), nodes, {
      moveOnDisconnect: true,
    });

    this.setupEventListeners();
  }

  // Método para arrancar el cliente de Discord en el Worker
  async init(token: string) {
    await this.client.login(token);
    console.log("✅ Discord Client del Worker iniciado");
  }

  private setupEventListeners() {
    this.shoukaku.on("error", (name, error) =>
      console.error(`Node ${name} error:`, error),
    );
    this.shoukaku.on("ready", (name) =>
      console.log(`✅ Lavalink Node ${name} listo`),
    );
  }

  async play(guildId: string, voiceId: string, url: string) {
    const node = this.shoukaku.options.nodeResolver(this.shoukaku.nodes);
    if (!node) throw new Error("No hay nodos de Lavalink disponibles");

    const result = await node.rest.resolve(url);
    if (!result?.data || result.loadType === "empty") return;

    const track = Array.isArray(result.data) ? result.data[0] : result.data;

    // Unirse al canal
    const player = await this.shoukaku.joinVoiceChannel({
      guildId,
      channelId: voiceId,
      shardId: 0,
    });

    // @ts-ignore - Dependiendo de la versión de Shoukaku
    await player.playTrack({ track: track.encoded });

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
