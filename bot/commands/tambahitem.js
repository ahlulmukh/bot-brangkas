const { Vault } = require("../../models"); // Pastikan untuk memperbarui path sesuai dengan struktur proyek Anda
const { updateVaultChannel } = require("../utils/updateUtils");

module.exports = {
  name: "tambahitem",
  description: "Menambahkan item baru ke kategori tertentu di brankas",
  async execute(interaction) {
    const category = interaction.options.getString("category");
    const item = interaction.options.getString("item");

    const vault = await Vault.findOne();
    const categoryDoc = vault.categories.find((cat) => cat.name === category);

    if (!categoryDoc) {
      await interaction.reply({
        content: `Kategori ${category} tidak ada dalam brankas.`,
        ephemeral: true,
      });
      return;
    }

    const itemDoc = categoryDoc.items.find((itm) => itm.name === item);

    if (itemDoc) {
      await interaction.reply({
        content: `Item ${item} sudah ada dalam kategori ${category}.`,
        ephemeral: true,
      });
      return;
    }

    categoryDoc.items.push({ name: item, quantity: 0 });
    await vault.save();
    await updateVaultChannel(interaction.client);
    await interaction.reply({
      content: `Item ${item} telah ditambahkan ke kategori ${category} dengan jumlah 0.`,
    });
  },
  async autocomplete(interaction) {
    const focusedValue = interaction.options.getFocused();
    const vault = await Vault.findOne();
    const choices = vault.categories.map((cat) => cat.name);
    const filtered = choices.filter((choice) =>
      choice.startsWith(focusedValue)
    );
    await interaction.respond(
      filtered.map((choice) => ({ name: choice, value: choice }))
    );
  },
};
