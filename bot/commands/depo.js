const { Vault, Contribution } = require("../../models");
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

    if (!itemDoc) {
      await interaction.reply({
        content: `Item ${item} tidak ada dalam kategori ${category}.`,
        ephemeral: true,
      });
      return;
    }

    itemDoc.quantity += amount;
    await vault.save();

    let contribution = await Contribution.findOne({ userId });

    if (!contribution) {
      contribution = new Contribution({
        userId,
        userName,
        depo: new Map(),
        wd: new Map(),
      });
    }

    if (!contribution.depo.has(category)) {
      contribution.depo.set(category, new Map());
    }

    if (!contribution.depo.get(category).has(item)) {
      contribution.depo.get(category).set(item, 0);
    }

    contribution.depo
      .get(category)
      .set(item, contribution.depo.get(category).get(item) + amount);

    await contribution.save();

    await updateVaultChannel(interaction.client);
    await interaction.reply({
      content: `\`\`\`Deposit ${item} sebesar ${amount} berhasil, total ${item} sekarang ${itemDoc.quantity}.\`\`\``,
    });
  },
  async autocomplete(interaction) {
    const focusedOption = interaction.options.getFocused(true);
    const vault = await Vault.findOne();
    let choices = [];

    if (focusedOption.name === "category") {
      choices = vault.categories.map((cat) => cat.name);
    } else if (focusedOption.name === "item") {
      const category = interaction.options.getString("category");
      const categoryDoc = vault.categories.find((cat) => cat.name === category);
      if (categoryDoc) {
        choices = categoryDoc.items.map((itm) => itm.name);
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
