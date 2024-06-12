const {
  saveVaultData,
  vault,
  saveContributionsData,
  contributions,
} = require("../utils/vaultUtils");
const { updateVaultChannel } = require("../utils/updateUtils");
const { channelDepo } = require("../config.json");

module.exports = {
  name: "depo",
  description: "Menambahkan item ke brankas",
  async execute(interaction) {
    if (interaction.channelId !== channelDepo) {
      await interaction.reply({
        content: `Command ini hanya dapat digunakan di channel <#${channelDepo}>.`,
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

    vault[category][item] += amount;

    if (!contributions[userId]) {
      contributions[userId] = {
        userName: userName,
        depo: {},
        wd: {},
      };
    }

    if (!contributions[userId].depo[category]) {
      contributions[userId].depo[category] = {};
    }

    if (!contributions[userId].depo[category][item]) {
      contributions[userId].depo[category][item] = 0;
    }

    contributions[userId].depo[category][item] += amount;

    saveVaultData();
    saveContributionsData();
    await updateVaultChannel(interaction.client);
    await interaction.reply({
      content: `Deposit **${item}** sebesar **${amount}** berhasil, total **${item}** sekarang **${vault[category][item]}**.`,
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
