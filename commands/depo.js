const { saveVaultData, vault } = require("../utils/vaultUtils");
const { updateVaultChannel } = require("../utils/updateUtils");

module.exports = {
  name: "depo",
  description: "Menambahkan item ke brankas",
  async execute(message, args) {
    const category = args[0];
    const item = args[1];
    const amount = parseInt(args[2], 10);

    if (!vault.hasOwnProperty(category)) {
      message.channel.send(`Kategori ${category} tidak ada dalam brankas.`);
      return;
    }

    if (!vault[category].hasOwnProperty(item)) {
      message.channel.send(
        `Item ${item} tidak ada dalam kategori ${category}.`
      );
      return;
    }

    vault[category][item] += amount;
    saveVaultData();
    await updateVaultChannel(message.client);
    message.channel.send(
      `Item ${item} sekarang menjadi ${vault[category][item]}.`
    );
  },
};
