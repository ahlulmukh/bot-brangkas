const { EmbedBuilder } = require("discord.js");
const { Contribution } = require("../../models"); // Pastikan untuk memperbarui path sesuai dengan struktur proyek Anda

module.exports = {
  name: "showcontributions",
  description: "Data-Data anggota yang menyetor",
  async execute(interaction) {
    const contributions = await Contribution.find();

    const embed = new EmbedBuilder()
      .setTitle("Kontribusi Anggota")
      .setColor("#00FF00");

    contributions.forEach((data) => {
      let userContributions = `Total Deposit: ${Array.from(
        data.depo.values()
      ).reduce(
        (acc, cat) => acc + Array.from(cat.values()).reduce((a, b) => a + b, 0),
        0
      )}\nTotal Withdrawal: ${Array.from(data.wd.values()).reduce(
        (acc, cat) => acc + Array.from(cat.values()).reduce((a, b) => a + b, 0),
        0
      )}\n`;

      userContributions += "\nDeposit:\n";
      data.depo.forEach((items, category) => {
        userContributions += `  ${category}:\n`;
        items.forEach((amount, item) => {
          userContributions += `    ${item}: ${amount}\n`;
        });
      });

      userContributions += "\nWithdrawal:\n";
      data.wd.forEach((items, category) => {
        userContributions += `  ${category}:\n`;
        items.forEach((amount, item) => {
          userContributions += `    ${item}: ${amount}\n`;
        });
      });

      embed.addFields({
        name: data.userName,
        value: userContributions,
        inline: true,
      });
    });

    await interaction.reply({ embeds: [embed] });
  },
};
