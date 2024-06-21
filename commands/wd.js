const {
  saveVaultData,
  vault,
  saveContributionsData,
  contributions,
} = require("../utils/vaultUtils");
const { updateVaultChannel } = require("../utils/updateUtils");
const { channelWd } = require("../config.json");

const clipPeluruDEComponents = {
  Besi: 20,
  Tembaga: 25,
  Botol: 30,
  "Minyak Paket": 7,
  "Papan Kemasan": 7,
  "Andaliman Saset": 2,
  Emas: 12,
};

const clipPeluruPython = {
  "Andaliman Saset": 2,
  "Minyak Paket": 8,
  "Papan Kemasan": 12,
  Emas: 15,
  Besi: 25,
  Tembaga: 30,
  Botol: 35,
};

const vest = {
  Kulit: 2,
  Berlian: 2,
  "Cairan Karet": 3,
  "Kunyit Saset": 5,
  "Papan Kemasan": 17,
  Emas: 20,
  Pakaian: 24,
  Besi: 25,
  Botol: 29,
  Tembaga: 35,
};

const ginseng = {
  Garam: 2,
  "Kunyit Saset": 2,
  Gula: 3,
  Botol: 4,
};

const acp45 = {
  "Paket Andaliman": 2,
  "Minyak Paket": 6,
  "Papan Kemasan": 7,
  Emas: 15,
  Besi: 20,
  Tembaga: 25,
  Botol: 35,
};

const ak726 = {
  "Paket Andaliman": 2,
  "Minyak Paket": 8,
  "Papan Kemasan": 13,
  Emas: 15,
  Tembaga: 25,
  Besi: 30,
  Botol: 40,
};

const bmg50 = {
  "Paket Andaliman": 3,
  "Papan Kemasan": 12,
  "Minyak Paket": 12,
  Emas: 15,
  Tembaga: 25,
  Besi: 35,
  Botol: 40,
};

const lockpick = {
  "Minyak Paket": 5,
  Emas: 10,
  Besi: 12,
  Botol: 20,
  Tembaga: 20,
};

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

    const item = interaction.options.getString("item");
    const amount = interaction.options.getInteger("amount");
    const userId = interaction.user.id;
    const userName = interaction.user.username;

    if (item === "Clip Peluru De") {
      let totalWithdrawn = [];

      for (const [component, qty] of Object.entries(clipPeluruDEComponents)) {
        const totalQty = qty * amount;
        let found = false;

        for (const category of Object.keys(vault)) {
          if (vault[category].hasOwnProperty(component)) {
            if (vault[category][component] < totalQty) {
              await interaction.reply({
                content: `Jumlah ${component} tidak cukup untuk melakukan penarikan ${amount} clip peluru de.`,
                ephemeral: true,
              });
              return;
            }

            vault[category][component] -= totalQty;
            found = true;
            break;
          }
        }

        if (!found) {
          await interaction.reply({
            content: `${component} tidak ditemukan dalam brankas.`,
            ephemeral: true,
          });
          return;
        }

        totalWithdrawn.push(`${component}: ${totalQty}`);
      }

      if (!contributions[userId]) {
        contributions[userId] = {
          userName: userName,
          depo: {},
          wd: {},
        };
      }

      if (!contributions[userId].wd["Clip Peluru DE"]) {
        contributions[userId].wd["Clip Peluru DE"] = 0;
      }

      contributions[userId].wd["Clip Peluru DE"] += amount;

      saveVaultData();
      saveContributionsData();

      await updateVaultChannel(interaction.client);

      let totalMessage = "Bahan yang diambil :\n" + totalWithdrawn.join("\n");

      await interaction.reply({
        content: `\`\`\`Withdrawal ${amount} ${item} berhasil.\n${totalMessage}\`\`\``,
      });
    } else if (item === "Clip Peluru Python") {
      let totalWithdrawn = [];

      for (const [component, qty] of Object.entries(clipPeluruPython)) {
        const totalQty = qty * amount;
        let found = false;

        for (const category of Object.keys(vault)) {
          if (vault[category].hasOwnProperty(component)) {
            if (vault[category][component] < totalQty) {
              await interaction.reply({
                content: `Jumlah ${component} tidak cukup untuk melakukan penarikan ${amount} clip peluru python.`,
                ephemeral: true,
              });
              return;
            }

            vault[category][component] -= totalQty;
            found = true;
            break;
          }
        }

        if (!found) {
          await interaction.reply({
            content: `${component} tidak ditemukan dalam brankas.`,
            ephemeral: true,
          });
          return;
        }

        totalWithdrawn.push(`${component}: ${totalQty}`);
      }

      if (!contributions[userId]) {
        contributions[userId] = {
          userName: userName,
          depo: {},
          wd: {},
        };
      }

      if (!contributions[userId].wd["Clip Peluru Python"]) {
        contributions[userId].wd["Clip Peluru Python"] = 0;
      }

      contributions[userId].wd["Clip Peluru Python"] += amount;

      saveVaultData();
      saveContributionsData();

      await updateVaultChannel(interaction.client);

      let totalMessage = "Bahan yang diambil:\n" + totalWithdrawn.join("\n");

      await interaction.reply({
        content: `\`\`\`Withdrawal ${amount}  ${item} berhasil.\n${totalMessage}\`\`\``,
      });
    } else if (item === "Bahan Vest") {
      let totalWithdrawn = [];

      for (const [component, qty] of Object.entries(vest)) {
        const totalQty = qty * amount;
        let found = false;

        for (const category of Object.keys(vault)) {
          if (vault[category].hasOwnProperty(component)) {
            if (vault[category][component] < totalQty) {
              await interaction.reply({
                content: `Jumlah ${component} tidak cukup untuk melakukan penarikan ${amount} clip peluru de.`,
                ephemeral: true,
              });
              return;
            }

            vault[category][component] -= totalQty;
            found = true;
            break;
          }
        }

        if (!found) {
          await interaction.reply({
            content: `${component} tidak ditemukan dalam brankas.`,
            ephemeral: true,
          });
          return;
        }

        totalWithdrawn.push(`${component}: ${totalQty}`);
      }

      if (!contributions[userId]) {
        contributions[userId] = {
          userName: userName,
          depo: {},
          wd: {},
        };
      }

      if (!contributions[userId].wd["Vest"]) {
        contributions[userId].wd["Vest"] = 0;
      }

      contributions[userId].wd["Vest"] += amount;

      saveVaultData();
      saveContributionsData();

      await updateVaultChannel(interaction.client);

      let totalMessage = "Bahan yang diambil:\n" + totalWithdrawn.join("\n");

      await interaction.reply({
        content: `\`\`\`Withdrawal ${amount} ${item} berhasil.\n${totalMessage}\`\`\``,
      });
    } else if (item === "Bahan Ginseng") {
      let totalWithdrawn = [];

      for (const [component, qty] of Object.entries(ginseng)) {
        const totalQty = qty * amount;
        let found = false;

        for (const category of Object.keys(vault)) {
          if (vault[category].hasOwnProperty(component)) {
            if (vault[category][component] < totalQty) {
              await interaction.reply({
                content: `Jumlah ${component} tidak cukup untuk melakukan penarikan ${amount} clip peluru de.`,
                ephemeral: true,
              });
              return;
            }

            vault[category][component] -= totalQty;
            found = true;
            break;
          }
        }

        if (!found) {
          await interaction.reply({
            content: `${component} tidak ditemukan dalam brankas.`,
            ephemeral: true,
          });
          return;
        }

        totalWithdrawn.push(`${component}: ${totalQty}`);
      }

      if (!contributions[userId]) {
        contributions[userId] = {
          userName: userName,
          depo: {},
          wd: {},
        };
      }

      if (!contributions[userId].wd["Bahan Ginseng"]) {
        contributions[userId].wd["Bahan Ginseng"] = 0;
      }

      contributions[userId].wd["Bahan Ginseng"] += amount;

      saveVaultData();
      saveContributionsData();
      await updateVaultChannel(interaction.client);

      let totalMessage = "Bahan yang diambil:\n" + totalWithdrawn.join("\n");

      await interaction.reply({
        content: `\`\`\`Withdrawal ${amount}  ${item} berhasil.\n${totalMessage}\`\`\``,
      });
    } else if (item === "Clip Acp 45") {
      let totalWithdrawn = [];

      for (const [component, qty] of Object.entries(acp45)) {
        const totalQty = qty * amount;
        let found = false;

        for (const category of Object.keys(vault)) {
          if (vault[category].hasOwnProperty(component)) {
            if (vault[category][component] < totalQty) {
              await interaction.reply({
                content: `Jumlah ${component} tidak cukup untuk melakukan penarikan ${amount} clip peluru de.`,
                ephemeral: true,
              });
              return;
            }

            vault[category][component] -= totalQty;
            found = true;
            break;
          }
        }

        if (!found) {
          await interaction.reply({
            content: `${component} tidak ditemukan dalam brankas.`,
            ephemeral: true,
          });
          return;
        }

        totalWithdrawn.push(`${component}: ${totalQty}`);
      }

      if (!contributions[userId]) {
        contributions[userId] = {
          userName: userName,
          depo: {},
          wd: {},
        };
      }

      if (!contributions[userId].wd["Clip Acp 45"]) {
        contributions[userId].wd["Clip Acp 45"] = 0;
      }

      contributions[userId].wd["Clip Acp 45"] += amount;

      saveVaultData();
      saveContributionsData();
      await updateVaultChannel(interaction.client);

      let totalMessage = "Bahan yang diambil:\n" + totalWithdrawn.join("\n");

      await interaction.reply({
        content: `\`\`\`Withdrawal ${amount}  ${item} berhasil.\n${totalMessage}\`\`\``,
      });
    } else if (item === "Clip AK") {
      let totalWithdrawn = [];

      for (const [component, qty] of Object.entries(ak726)) {
        const totalQty = qty * amount;
        let found = false;

        for (const category of Object.keys(vault)) {
          if (vault[category].hasOwnProperty(component)) {
            if (vault[category][component] < totalQty) {
              await interaction.reply({
                content: `Jumlah ${component} tidak cukup untuk melakukan penarikan ${amount} clip peluru de.`,
                ephemeral: true,
              });
              return;
            }

            vault[category][component] -= totalQty;
            found = true;
            break;
          }
        }

        if (!found) {
          await interaction.reply({
            content: `${component} tidak ditemukan dalam brankas.`,
            ephemeral: true,
          });
          return;
        }

        totalWithdrawn.push(`${component}: ${totalQty}`);
      }

      if (!contributions[userId]) {
        contributions[userId] = {
          userName: userName,
          depo: {},
          wd: {},
        };
      }

      if (!contributions[userId].wd["Clip AK"]) {
        contributions[userId].wd["Clip AK"] = 0;
      }

      contributions[userId].wd["Clip AK"] += amount;

      saveVaultData();
      saveContributionsData();
      await updateVaultChannel(interaction.client);

      let totalMessage = "Bahan yang diambil:\n" + totalWithdrawn.join("\n");

      await interaction.reply({
        content: `\`\`\`Withdrawal ${amount}  ${item} berhasil.\n${totalMessage}\`\`\``,
      });
    } else if (item === "Clip Sniper") {
      let totalWithdrawn = [];

      for (const [component, qty] of Object.entries(bmg50)) {
        const totalQty = qty * amount;
        let found = false;

        for (const category of Object.keys(vault)) {
          if (vault[category].hasOwnProperty(component)) {
            if (vault[category][component] < totalQty) {
              await interaction.reply({
                content: `Jumlah ${component} tidak cukup untuk melakukan penarikan ${amount} clip peluru de.`,
                ephemeral: true,
              });
              return;
            }

            vault[category][component] -= totalQty;
            found = true;
            break;
          }
        }

        if (!found) {
          await interaction.reply({
            content: `${component} tidak ditemukan dalam brankas.`,
            ephemeral: true,
          });
          return;
        }

        totalWithdrawn.push(`${component}: ${totalQty}`);
      }

      if (!contributions[userId]) {
        contributions[userId] = {
          userName: userName,
          depo: {},
          wd: {},
        };
      }

      if (!contributions[userId].wd["Clip Sniper"]) {
        contributions[userId].wd["Clip Sniper"] = 0;
      }

      contributions[userId].wd["Clip Sniper"] += amount;

      saveVaultData();
      saveContributionsData();
      await updateVaultChannel(interaction.client);

      let totalMessage = "Bahan yang diambil:\n" + totalWithdrawn.join("\n");

      await interaction.reply({
        content: `\`\`\`Withdrawal ${amount}  ${item} berhasil.\n${totalMessage}\`\`\``,
      });
    } else if (item === "Lockpick") {
      let totalWithdrawn = [];

      for (const [component, qty] of Object.entries(lockpick)) {
        const totalQty = qty * amount;
        let found = false;

        for (const category of Object.keys(vault)) {
          if (vault[category].hasOwnProperty(component)) {
            if (vault[category][component] < totalQty) {
              await interaction.reply({
                content: `Jumlah ${component} tidak cukup untuk melakukan penarikan ${amount} clip peluru de.`,
                ephemeral: true,
              });
              return;
            }

            vault[category][component] -= totalQty;
            found = true;
            break;
          }
        }

        if (!found) {
          await interaction.reply({
            content: `${component} tidak ditemukan dalam brankas.`,
            ephemeral: true,
          });
          return;
        }

        totalWithdrawn.push(`${component}: ${totalQty}`);
      }

      if (!contributions[userId]) {
        contributions[userId] = {
          userName: userName,
          depo: {},
          wd: {},
        };
      }

      if (!contributions[userId].wd["Bahan Lockpick"]) {
        contributions[userId].wd["Bahan Lockpick"] = 0;
      }

      contributions[userId].wd["Bahan Lockpick"] += amount;

      saveVaultData();
      saveContributionsData();
      await updateVaultChannel(interaction.client);

      let totalMessage = "Bahan yang diambil:\n" + totalWithdrawn.join("\n");

      await interaction.reply({
        content: `\`\`\`Withdrawal ${amount}  ${item} berhasil.\n${totalMessage}\`\`\``,
      });
    } else {
      const category = interaction.options.getString("category");

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
        content: `\`\`\`Withdrawal ${item} sebesar ${amount}, sisa ${item} sekarang ${vault[category][item]}.\`\`\``,
      });
    }
  },
  async autocomplete(interaction) {
    const focusedOption = interaction.options.getFocused(true);
    let choices = [];

    if (focusedOption.name === "item") {
      const category = interaction.options.getString("category");
      if (category === "Crafting") {
        choices = [
          "Clip Peluru De",
          "Clip Peluru Python",
          "Bahan Vest",
          "Bahan Ginseng",
          "Clip Acp 45",
          "Clip AK",
          "Clip Sniper",
          "Lockpick",
        ];
      } else {
        choices = Object.keys(vault[category]);
      }
    } else if (focusedOption.name === "category") {
      choices = Object.keys(vault).concat("Crafting");
    }

    const filtered = choices.filter((choice) =>
      choice.startsWith(focusedOption.value)
    );
    await interaction.respond(
      filtered.map((choice) => ({ name: choice, value: choice }))
    );
  },
};
