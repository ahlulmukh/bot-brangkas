const { EmbedBuilder } = require("discord.js");
const { contributions } = require("../utils/vaultUtils");

module.exports = {
  name: "showcontributions",
  description: "Menampilkan kontribusi pengguna",
  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setTitle("Kontribusi Pengguna")
      .setColor("#00FF00");

    for (const [userId, data] of Object.entries(contributions)) {
      let userContributions = `Total Deposit: ${Object.values(data.depo).reduce(
        (acc, cat) => acc + Object.values(cat).reduce((a, b) => a + b, 0),
        0
      )}\nTotal Withdrawal: ${Object.values(data.wd).reduce(
        (acc, cat) => acc + Object.values(cat).reduce((a, b) => a + b, 0),
        0
      )}\n`;

      userContributions += "\nDeposit:\n";
      for (const [category, items] of Object.entries(data.depo)) {
        userContributions += `  ${category}:\n`;
        for (const [item, amount] of Object.entries(items)) {
          userContributions += `    ${item}: ${amount}\n`;
        }
      }

      userContributions += "\nWithdrawal:\n";
      for (const [category, items] of Object.entries(data.wd)) {
        userContributions += `  ${category}:\n`;
        for (const [item, amount] of Object.entries(items)) {
          userContributions += `    ${item}: ${amount}\n`;
        }
      }

      embed.addFields({
        name: data.userName,
        value: userContributions,
        inline: true,
      });
    }

    await interaction.reply({ embeds: [embed] });
  },
};
