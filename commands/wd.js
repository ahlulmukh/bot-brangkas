const { saveVaultData, vault } = require("../utils/vaultUtils");
const { updateVaultChannel } = require("../utils/updateUtils");

module.exports = {
  name: "wd",
  description: "Mengambil item dari brankas",
  async execute(interaction) {
    const category = interaction.options.getString("category");
    const item = interaction.options.getString("item");
    const amount = interaction.options.getInteger("amount");

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
    saveVaultData();
    await updateVaultChannel(interaction.client);
    await interaction.reply({
      content: `Item ${item} sekarang menjadi ${vault[category][item]}.`,
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
