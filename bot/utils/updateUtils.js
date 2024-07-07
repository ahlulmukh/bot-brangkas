const { guildId, channelId } = require("../config.json");
const { createVaultEmbed, loadVaultData } = require("./vaultUtils");

async function updateVaultChannel(client) {
  try {
    const guild = await client.guilds.fetch(guildId);
    const channel = await guild.channels.fetch(channelId);
    const vault = await loadVaultData();
    if (channel) {
      const messageData = require("../data/messageData.json");
      const message = await channel.messages.fetch(messageData.messageId);
      updateVaultMessage(message, vault);
    }
  } catch (error) {
    console.log(
      "Pesan tidak ditemukan atau channel tidak ditemukan, membuat pesan baru."
    );
    createVaultMessage(channel);
  }
}

async function createVaultMessage(channel) {
  const vault = await loadVaultData();
  const embed = createVaultEmbed(vault);
  const message = await channel.send({ embeds: [embed] });
  const messageData = {
    channelId: channel.id,
    messageId: message.id,
  };
  const fs = require("fs");
  fs.writeFileSync(
    "./data/messageData.json",
    JSON.stringify(messageData, null, 2)
  );
}

function updateVaultMessage(message, vault) {
  const embed = createVaultEmbed(vault);
  message.edit({ embeds: [embed] });
}

module.exports = {
  updateVaultChannel,
  createVaultMessage,
  updateVaultMessage,
};
