const { EmbedBuilder } = require("discord.js");
const fs = require("fs");
const path = require("path");

const vaultDataPath = path.join(__dirname, "../data/vaultData.json");
const contributionsDataPath = path.join(
  __dirname,
  "../data/contributionsData.json"
);

let vault = {
  "barang disnaker": { kayu: 1000, botol: 500 },
  "barang illegal": { "kunyit saset": 200, "pistol de": 5 },
};

let contributions = {};

function saveVaultData() {
  fs.writeFileSync(vaultDataPath, JSON.stringify(vault, null, 2));
}

function loadVaultData() {
  if (fs.existsSync(vaultDataPath)) {
    vault = JSON.parse(fs.readFileSync(vaultDataPath));
  }
}

function saveContributionsData() {
  fs.writeFileSync(
    contributionsDataPath,
    JSON.stringify(contributions, null, 2)
  );
}

function loadContributionsData() {
  if (fs.existsSync(contributionsDataPath)) {
    contributions = JSON.parse(fs.readFileSync(contributionsDataPath));
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
loadContributionsData();

module.exports = {
  saveVaultData,
  vault,
  createVaultEmbed,
  saveContributionsData,
  contributions,
};
