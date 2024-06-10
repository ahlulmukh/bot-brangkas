const { Client, GatewayIntentBits, Collection } = require("discord.js");
const fs = require("fs");
const path = require("path");
const { loadVaultData, vault } = require("./utils/vaultUtils");
const { saveMessageData, messageData } = require("./utils/messageUtils");
const { token, guildId, channelId } = require("./config.json");
const {
  updateVaultChannel,
  createVaultMessage,
  updateVaultMessage,
} = require("./utils/updateUtils");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent, // Perlu untuk membaca konten pesan
  ],
});

client.commands = new Collection();
const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs
  .readdirSync(commandsPath)
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  client.commands.set(command.name, command);
}

client.once("ready", async () => {
  console.log("Bot is online!");

  try {
    const guild = await client.guilds.fetch(guildId);
    const channel = await guild.channels.fetch(channelId);

    if (channel) {
      // Jika pesan sudah ada, ambil pesan tersebut
      if (messageData.messageId) {
        try {
          const message = await channel.messages.fetch(messageData.messageId);
          updateVaultMessage(message);
        } catch (error) {
          console.log("Pesan tidak ditemukan, membuat pesan baru.");
          createVaultMessage(channel);
        }
      } else {
        // Jika tidak ada pesan yang tersimpan, buat pesan baru
        createVaultMessage(channel);
      }
    } else {
      console.log("Channel tidak ditemukan.");
    }
  } catch (error) {
    console.log("Guild atau Channel tidak ditemukan.", error);
  }
});

client.on("messageCreate", async (message) => {
  if (!message.content.startsWith("/")) return;

  const args = message.content.slice(1).split(" ");
  const commandName = args.shift().toLowerCase();

  const command = client.commands.get(commandName);
  if (!command) return;

  try {
    await command.execute(message, args);
    await updateVaultChannel(message.client);
  } catch (error) {
    console.error(error);
    message.reply("Terjadi kesalahan saat menjalankan perintah tersebut.");
  }
});

client.login(token);
