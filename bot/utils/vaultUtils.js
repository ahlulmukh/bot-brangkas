const Vault = require("../../models/Vault");

async function loadVaultData() {
  try {
    let vault = await Vault.findOne();
    if (!vault) {
      vault = new Vault({
        categories: [
          {
            name: "barang disnaker",
            items: [
              { name: "kayu", quantity: 1000 },
              { name: "botol", quantity: 500 },
            ],
          },
          {
            name: "barang illegal",
            items: [
              { name: "kunyit saset", quantity: 200 },
              { name: "pistol de", quantity: 5 },
            ],
          },
        ],
      });
      await vault.save();
    }
    return vault;
  } catch (error) {
    console.error("Failed to load vault data", error);
  }
}

async function saveVaultData(vault) {
  try {
    await vault.save();
  } catch (error) {
    console.error("Failed to save vault data", error);
  }
}

function createVaultEmbed(vault) {
  const { EmbedBuilder } = require("discord.js");

  const embed = new EmbedBuilder()
    .setColor("#cc9900")
    .setTitle("Brangkas Mamoru")
    .setDescription("Brangkas Terupdate Saat Ini :")
    .setThumbnail("https://i.ibb.co/YPdyVzQ/MAMORU-BULAT-NO-BG.png");

  vault.categories.forEach((category) => {
    let fieldValue = "";
    category.items.forEach((item) => {
      fieldValue += `${item.name}: ${item.quantity}\n`;
    });
    embed.addFields({ name: category.name, value: fieldValue, inline: true });
  });

  embed.setTimestamp().setFooter({
    text: "Mamoru The Black Moonlight",
    iconURL: "https://i.ibb.co/YPdyVzQ/MAMORU-BULAT-NO-BG.png",
  });

  return embed;
}

module.exports = {
  loadVaultData,
  saveVaultData,
  createVaultEmbed,
};
