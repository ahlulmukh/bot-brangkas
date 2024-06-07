const { Client, GatewayIntentBits, Collection } = require("discord.js");
const fs = require("fs");
const path = require("path");
const { loadVaultData, vault } = require("./utils/vaultUtils");
const { saveMessageData, messageData } = require("./utils/messageUtils");
const { token } = require("./config.json");

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

  const guild = client.guilds.cache.first(); // Pilih guild pertama (atau sesuaikan dengan ID guild yang tepat)
  const channel = guild.channels.cache.find((c) => c.name === "data-brangkas");

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
    console.log('Channel "data-brangkas" tidak ditemukan.');
  }
});

client.on("messageCreate", (message) => {
  if (!message.content.startsWith("/")) return;

  const args = message.content.slice(1).split(" ");
  const commandName = args.shift().toLowerCase();

  const command = client.commands.get(commandName);
  if (!command) return;

  try {
    command.execute(message, args);
    updateVaultChannel(client);
  } catch (error) {
    console.error(error);
    message.reply("Terjadi kesalahan saat menjalankan perintah tersebut.");
  }
});

async function createVaultMessage(channel) {
  const embed = createVaultEmbed();
  const message = await channel.send({ embeds: [embed] });
  messageData.channelId = channel.id;
  messageData.messageId = message.id;
  saveMessageData();
}

function createVaultEmbed() {
  let vaultContents = "Isi brankas saat ini:\n";
  for (const [item, amount] of Object.entries(vault)) {
    vaultContents += `${item}: ${amount}\n`;
  }
  return {
    title: "Isi Brankas",
    description: vaultContents,
    color: 0x00ff00,
  };
}

async function updateVaultChannel(client) {
  const channel = await client.channels.fetch(messageData.channelId);
  if (channel) {
    try {
      const message = await channel.messages.fetch(messageData.messageId);
      updateVaultMessage(message);
    } catch (error) {
      console.log("Pesan tidak ditemukan, membuat pesan baru.");
      createVaultMessage(channel);
    }
  }
}

function updateVaultMessage(message) {
  const embed = createVaultEmbed();
  message.edit({ embeds: [embed] });
}

client.login(token);
