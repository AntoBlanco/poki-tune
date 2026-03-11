import { ChatInputCommandInteraction, GuildMember } from "discord.js";
import { RedisMusicRepository } from "../../repositories/redis-music.repository";
import { PlayQueueUseCase } from "../../../application/use-cases/play-queue.use-case";
import { Setup247UseCase } from "../../../application/use-cases/setup-247.use-case";
import { PlayLiveUseCase } from "../../../application/use-cases/play-live.use-case";


export const MusicController = {
  async handlePlay(interaction: ChatInputCommandInteraction, redis: any) {
    // Validar si la interacción ocurrió en un servidor
    if (!interaction.guildId || !interaction.member) return;

    // Type Guard para TypeScript
    const member = interaction.member as GuildMember;

    if (!member.voice.channelId) {
      return interaction.reply({
        content: "❌ ¡Debes estar en un canal de voz!",
        ephemeral: true,
      });
    }

    const repo = new RedisMusicRepository(redis);
    const useCase = new PlayQueueUseCase(repo);

    const track = {
      url: interaction.options.getString("url", true),
      title: "Obteniendo título...", // Aquí podrías usar una utilidad de scraping
      requesterId: interaction.user.id,
      duration: 0, //TODO Podrías obtener la duración real con una utilidad de scraping o una API externa
    };

    await useCase.execute(interaction.guildId, member.voice.channelId, track);

    return interaction.reply("▶️ Procesando petición...");
  },
  async handle247(interaction: ChatInputCommandInteraction, redis: any) {
    // 1. Validar que estamos en un servidor (Guild)
    if (!interaction.guildId || !interaction.member) {
      return interaction.reply({
        content: "Este comando solo funciona en servidores.",
        ephemeral: true,
      });
    }

    // 2. Cast seguro a GuildMember
    const member = interaction.member as GuildMember;

    // 3. Validar que el usuario esté en un canal de voz
    const voiceChannelId = member.voice.channelId;
    if (!voiceChannelId) {
      return interaction.reply({
        content: "❌ Debes estar en un canal de voz para activar el modo 24/7.",
        ephemeral: true,
      });
    }

    // 4. Obtener el valor del argumento 'enabled' (opcional, pero recomendado)
    // Si no usas argumentos, el 'true' que pasaste está bien.
    const isEnabled = interaction.options.getBoolean("enabled") ?? true;

    const repo = new RedisMusicRepository(redis);
    const useCase = new Setup247UseCase(repo);

    const track = {
      url: "url_fija",
      title: "Radio 24/7",
      requesterId: interaction.user.id, // Mejor usar el ID real que "admin"
      duration: 0,
    };

    try {
      await useCase.execute(
        interaction.guildId,
        voiceChannelId, // Ya validamos que no es null
        track,
        isEnabled,
      );

      return interaction.reply(
        `♾️ Modo 24/7 ${isEnabled ? "activado" : "desactivado"}.`,
      );
    } catch (error) {
      console.error(error);
      return interaction.reply({
        content: "Error al configurar el modo 24/7.",
        ephemeral: true,
      });
    }
  },
  async handleLive(interaction: ChatInputCommandInteraction, redis: any) {
    if (!interaction.guildId || !interaction.member) return;

    const member = interaction.member as GuildMember;
    const voiceChannelId = member.voice.channelId;

    if (!voiceChannelId) {
      return interaction.reply({
        content: "❌ Debes estar en un canal de voz para emitir un directo.",
        ephemeral: true,
      });
    }

    const streamUrl = interaction.options.getString("url", true);

    const repo = new RedisMusicRepository(redis);
    const useCase = new PlayLiveUseCase(repo);

    try {
      await useCase.execute(
        interaction.guildId,
        voiceChannelId,
        streamUrl,
        interaction.user.id,
      );

      return interaction.reply(`📡 Sintonizando directo: ${streamUrl}`);
    } catch (error) {
      console.error(error);
      return interaction.reply({
        content: "Error al sintonizar el directo.",
        ephemeral: true,
      });
    }
  },
};