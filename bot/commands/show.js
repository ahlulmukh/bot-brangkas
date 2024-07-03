const { EmbedBuilder } = require("discord.js");
const { vault } = require("../utils/vaultUtils");

module.exports = {
  name: "vault",
  description: "Menampilkan isi brankas",
  execute(message) {
    let vaultContents = "Isi brankas saat ini:\n";
    for (const [category, items] of Object.entries(vault)) {
      vaultContents += `${category}:\n`;
      for (const [item, amount] of Object.entries(items)) {
        vaultContents += `  ${item}: ${amount}\n`;
      }
    }
    const embed = new EmbedBuilder()
      .setTitle("Isi Brankas")
      .setDescription(vaultContents)
      .setColor("#00FF00");
    message.channel.send({ embeds: [embed] });
  },
};
