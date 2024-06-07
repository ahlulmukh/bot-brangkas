const { saveVaultData, vault } = require("../utils/vaultUtils");
const { updateVaultChannel } = require("../utils/updateUtils");

module.exports = {
  name: "wd",
  description: "Mengambil item dari brankas",
  async execute(message, args) {
    const item = args[0];
    const amount = parseInt(args[1], 10);
    if (!vault.hasOwnProperty(item)) {
      message.channel.send(`Item ${item} tidak ada dalam brankas.`);
      return;
    }
    if (vault[item] < amount) {
      message.channel.send(
        `Jumlah ${item} tidak cukup untuk melakukan penarikan.`
      );
      return;
    }
    vault[item] -= amount;
    saveVaultData();
    await updateVaultChannel(message.client);
    message.channel.send(`Item ${item} sekarang menjadi ${vault[item]}.`);
  },
};
