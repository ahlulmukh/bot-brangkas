const { saveVaultData, vault } = require("../utils/vaultUtils");
const { updateVaultChannel } = require("../utils/updateUtils");

module.exports = {
  name: "tambahitem",
  description: "Menambahkan item baru ke kategori tertentu di brankas",
  async execute(interaction) {
    const category = interaction.options.getString("category");
    const item = interaction.options.getString("item");

    if (!vault.hasOwnProperty(category)) {
      await interaction.reply({
        content: `Kategori ${category} tidak ada dalam brankas.`,
        ephemeral: true,
      });
      return;
    }

    if (vault[category].hasOwnProperty(item)) {
      await interaction.reply({
        content: `Item ${item} sudah ada dalam kategori ${category}.`,
        ephemeral: true,
      });
      return;
    }

    vault[category][item] = 0;
    saveVaultData();
    await updateVaultChannel(interaction.client);
    await interaction.reply({
      content: `Item ${item} telah ditambahkan ke kategori ${category} dengan jumlah 0.`,
    });
  },
  async autocomplete(interaction) {
    const focusedValue = interaction.options.getFocused();
    const choices = Object.keys(vault);
    const filtered = choices.filter((choice) =>
      choice.startsWith(focusedValue)
    );
    await interaction.respond(
      filtered.map((choice) => ({ name: choice, value: choice }))
    );
  },
};
