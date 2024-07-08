const { Client, GatewayIntentBits, Collection } = require("discord.js");
const fs = require("fs");
const path = require("path");
const axios = require("axios");
const mongoose = require("mongoose");
const { loadVaultData, saveVaultData } = require("./utils/vaultUtils");
const { saveMessageData, messageData } = require("./utils/messageUtils");
const { token, guildId, channelId, apiBaseUrl } = require("./config.json");
require("dotenv").config();

const {
  updateVaultChannel,
  createVaultMessage,
  updateVaultMessage,
} = require("./utils/updateUtils");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
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

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

client.once("ready", async () => {
  console.log("Bot is online!");

  try {
    const guild = await client.guilds.fetch(guildId);
    const channel = await guild.channels.fetch(channelId);

    if (channel) {
      if (messageData.messageId) {
        try {
          const message = await channel.messages.fetch(messageData.messageId);
          const vault = await loadVaultData();
          updateVaultMessage(message, vault);
        } catch (error) {
          console.log("Pesan tidak ditemukan, membuat pesan baru.");
          createVaultMessage(channel);
        }
      } else {
        createVaultMessage(channel);
      }
    } else {
      console.log("Channel tidak ditemukan.");
    }

    // Register slash commands
    await registerSlashCommands(guild);

    // Mulai mekanisme polling
    //  setInterval(checkForUpdates, 5000); // Cek setiap 5 detik
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

client.on("interactionCreate", async (interaction) => {
  if (interaction.isAutocomplete()) {
    const command = client.commands.get(interaction.commandName);
    if (command && command.autocomplete) {
      try {
        await command.autocomplete(interaction);
      } catch (error) {
        console.error(error);
      }
    }
  } else if (interaction.isCommand()) {
    const command = client.commands.get(interaction.commandName);
    if (command) {
      try {
        await command.execute(interaction);
      } catch (error) {
        console.error(error);
        await interaction.reply({
          content: "Terjadi kesalahan saat menjalankan perintah tersebut.",
          ephemeral: true,
        });
      }
    }
  }
});

client.login(token);

async function registerSlashCommands(guild) {
  const commands = [
    {
      name: "showcontributions",
      description: "Menampilkan kontribusi pengguna",
    },
    {
      name: "tambahitem",
      description: "Menambahkan item baru ke kategori tertentu di brankas",
      options: [
        {
          name: "category",
          type: 3, // STRING type
          description: "Kategori item",
          required: true,
          autocomplete: true,
        },
        {
          name: "item",
          type: 3, // STRING type
          description: "Nama item",
          required: true,
        },
      ],
    },
    {
      name: "depo",
      description: "Menambahkan item ke brankas",
      options: [
        {
          name: "category",
          type: 3, // STRING type
          description: "Kategori item",
          required: true,
          autocomplete: true,
        },
        {
          name: "item",
          type: 3, // STRING type
          description: "Nama item",
          required: true,
          autocomplete: true,
        },
        {
          name: "amount",
          type: 4, // INTEGER type
          description: "Jumlah item",
          required: true,
        },
      ],
    },
    {
      name: "wd",
      description: "Mengambil item dari brankas",
      options: [
        {
          name: "category",
          type: 3, // STRING type
          description: "Kategori item",
          required: true,
          autocomplete: true,
        },
        {
          name: "item",
          type: 3, // STRING type
          description: "Nama item",
          required: true,
          autocomplete: true,
        },
        {
          name: "amount",
          type: 4, // INTEGER type
          description: "Jumlah item",
          required: true,
        },
      ],
    },
  ];

  await guild.commands.set(commands);
}

// async function checkForUpdates() {
//   try {
//     const response = await axios.get(`${apiBaseUrl}/api/check-updates`);
//     const newData = response.data;

//     const currentVault = await loadVaultData();
//     if (JSON.stringify(newData) !== JSON.stringify(currentVault)) {
//       Object.assign(currentVault, newData);
//       await saveVaultData(currentVault);
//       await updateVaultChannel(client);
//       console.log("Vault data updated from web dashboard");
//     }
//   } catch (error) {
//     console.error("Error checking for updates:", error);
//   }
// }
