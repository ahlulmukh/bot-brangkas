const {
  saveVaultData,
  vault,
  saveContributionsData,
  contributions,
} = require("../utils/vaultUtils");
const { updateVaultChannel } = require("../utils/updateUtils");
const { channelWd } = require("../config.json");

module.exports = {
  name: "wd",
  description: "Mengambil item dari brankas",
  async execute(interaction) {
    if (interaction.channelId !== channelWd) {
      await interaction.reply({
        content: `Command ini hanya dapat digunakan di channel <#${channelWd}>.`,
        ephemeral: true,
      });
      return;
    }
    const category = interaction.options.getString("category");
    const item = interaction.options.getString("item");
    const amount = interaction.options.getInteger("amount");
    const userId = interaction.user.id;
    const userName = interaction.user.username;

    if (!vault.hasOwnProperty(category)) {
      await interaction.reply({
        content: `Kategori ${category} tidak ada dalam brankas.`,
        ephemeral: true,
      });
      return;
    }

    if (!vault[category].hasOwnProperty(item)) {
      await interaction.reply({
        content: `Item ${item} tidak ada dalam kategori ${category}.`,
        ephemeral: true,
      });
      return;
    }

    if (vault[category][item] < amount) {
      await interaction.reply({
        content: `Jumlah ${item} tidak cukup untuk melakukan penarikan.`,
        ephemeral: true,
      });
      return;
    }

    vault[category][item] -= amount;

    if (!contributions[userId]) {
      contributions[userId] = {
        userName: userName,
        depo: {},
        wd: {},
      };
    }

    if (!contributions[userId].wd[category]) {
      contributions[userId].wd[category] = {};
    }

    if (!contributions[userId].wd[category][item]) {
      contributions[userId].wd[category][item] = 0;
    }

    contributions[userId].wd[category][item] += amount;

    saveVaultData();
    saveContributionsData();
    await updateVaultChannel(interaction.client);
    await interaction.reply({
      content: `Withdrawal **${item}** Sebesar **${amount}**, sisa **${item}** sekarang **${vault[category][item]}**.`,
    });
  },
  async autocomplete(interaction) {
    const focusedOption = interaction.options.getFocused(true);
    let choices = [];

    if (focusedOption.name === "category") {
      choices = Object.keys(vault);
    } else if (focusedOption.name === "item") {
      const category = interaction.options.getString("category");
      if (vault.hasOwnProperty(category)) {
        choices = Object.keys(vault[category]);
      }
    }

    const filtered = choices.filter((choice) =>
      choice.startsWith(focusedOption.value)
    );
    await interaction.respond(
      filtered.map((choice) => ({ name: choice, value: choice }))
    );
  },
};
