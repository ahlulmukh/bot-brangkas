const { saveVaultData, vault } = require("../utils/vaultUtils");
const { updateVaultChannel } = require("../utils/updateUtils");

module.exports = {
  name: "tambahitem",
  description: "Menambahkan item baru ke kategori tertentu di brankas",
  async execute(message, args) {
    const category = args[0];
    const item = args[1];

    if (!vault.hasOwnProperty(category)) {
      message.channel.send(`Kategori ${category} tidak ada dalam brankas.`);
      return;
    }

    if (vault[category].hasOwnProperty(item)) {
      message.channel.send(
        `Item ${item} sudah ada dalam kategori ${category}.`
      );
      return;
    }

    vault[category][item] = 0;
    saveVaultData();
    await updateVaultChannel(message.client);
    message.channel.send(
      `Item ${item} telah ditambahkan ke kategori ${category} dengan jumlah 0.`
    );
  },
};
