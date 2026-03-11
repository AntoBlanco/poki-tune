import { REST, Routes, SlashCommandBuilder } from "discord.js";
import { type Config } from "../../../../config/config";

const commands = [
  new SlashCommandBuilder()
    .setName("play")
    .setDescription("Reproduce una canción")
    .addStringOption((opt) =>
      opt.setName("url").setDescription("URL de la canción").setRequired(true),
    ),

  new SlashCommandBuilder()
    .setName("247")
    .setDescription("Activa el modo 24/7")
    .addBooleanOption((opt) =>
      opt.setName("enabled").setDescription("Estado").setRequired(true),
    ),

  new SlashCommandBuilder()
    .setName("live")
    .setDescription("Sintoniza un stream en vivo")
    .addStringOption((opt) =>
      opt.setName("url").setDescription("URL del directo").setRequired(true),
    ),
].map((command) => command.toJSON());

export async function deploy(config:Config) {
  const token = config.discord.token;
  const clientId = config.discord.clientId; // Necesitas el ID de tu aplicación

  const rest = new REST({ version: "10" }).setToken(token);

  try {
    console.log("🔄 Actualizando comandos globales...");
    await rest.put(Routes.applicationCommands(clientId), { body: commands });
    console.log("✅ Comandos actualizados con éxito.");
  } catch (error) {
    console.error("❌ Error al actualizar comandos:", error);
  }
}

// Ejecutar si se llama directamente
// if (
//   require.main === module ||
//   (typeof Bun !== "undefined" && Bun.main === import.meta.path)
// ) {
//   deploy();
// }
