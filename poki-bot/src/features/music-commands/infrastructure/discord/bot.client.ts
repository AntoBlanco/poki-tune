import { Client, GatewayIntentBits, Events } from "discord.js";
import { MusicController } from "./commands/music.controller";
import { Redis } from "ioredis";

export class DiscordBot {
  private client: Client;

  constructor(private redis: Redis) {
    this.client = new Client({
      intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates],
    });
  }

  async start(token: string) {
    this.client.once(Events.ClientReady, (c) => {
      console.log(`🤖 Bot listo como ${c.user.tag}`);
    });

    this.client.on(Events.InteractionCreate, async (interaction) => {
      if (!interaction.isChatInputCommand()) return;

      const { commandName } = interaction;

      // Routing de comandos hacia el controlador
      try {
        if (commandName === "play") {
          await MusicController.handlePlay(interaction, this.redis);
        } else if (commandName === "247") {
          await MusicController.handle247(interaction, this.redis);
        } else if (commandName === "live") {
          await MusicController.handleLive(interaction, this.redis);
        }
      } catch (error) {
        console.error(error);
        await interaction.reply({
          content: "Hubo un error ejecutando el comando.",
          ephemeral: true,
        });
      }
    });

    await this.client.login(token);
  }
}
