const { EmbedBuilder } = require("discord.js");
const fs = require("fs");
const path = require("path");

const dataPath = path.join(__dirname, "../data/vaultData.json");

let vault = {
  "barang disnaker": { kayu: 1000, botol: 500 },
  "barang illegal": { "kunyit saset": 200, "pistol de": 5 },
};

function saveVaultData() {
  fs.writeFileSync(dataPath, JSON.stringify(vault, null, 2));
}

function loadVaultData() {
  if (fs.existsSync(dataPath)) {
    vault = JSON.parse(fs.readFileSync(dataPath));
  }
}

function createVaultEmbed() {
  const embed = new EmbedBuilder()
    .setColor("#0099ff")
    .setTitle("Brangkas Mamoru")
    .setDescription("Berikut adalah isi brankas saat ini:");
  for (const [category, items] of Object.entries(vault)) {
    let fieldValue = "";
    for (const [item, quantity] of Object.entries(items)) {
      fieldValue += `${item}: ${quantity}\n`;
    }
    embed
      .addFields({
        name: category,
        value: fieldValue,
        inline: true,
      })
      .setTimestamp()
      .setFooter({
        text: "Mamoru Jaya Jaya",
      });
  }

  return embed;
}

loadVaultData();

module.exports = {
  saveVaultData,
  vault,
  createVaultEmbed,
};
