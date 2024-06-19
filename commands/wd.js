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

    // Jika item adalah "clip peluru de", lakukan pengecekan komponen terlebih dahulu
    if (item === "clip peluru de") {
      let totalWithdrawn = []; // Array untuk menyimpan total pengambilan bahan

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

            // Mengurangi jumlah bahan dari brankas
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

        // Menambahkan informasi total pengambilan bahan ke dalam array
        totalWithdrawn.push(`${component}: ${totalQty}`);
      }

      // Mencatat kontribusi pengguna untuk "clip peluru de"
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

      // Menyimpan data brankas dan kontribusi
      saveVaultData();
      saveContributionsData();

      // Memperbarui channel brankas
      await updateVaultChannel(interaction.client);

      // Membuat pesan yang memuat total pengambilan bahan
      let totalMessage =
        "Total pengambilan item:\n" + totalWithdrawn.join("\n");

      // Mengirim balasan dengan informasi total pengambilan item
      await interaction.reply({
        content: `Withdrawal **${item}** sebesar **${amount}** berhasil.\n${totalMessage}`,
      });
    } else if (item === "clip peluru python") {
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
      }

      // Mencatat kontribusi pengguna untuk "clip peluru de"
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

      // Menyimpan data brankas dan kontribusi
      saveVaultData();
      saveContributionsData();

      // Memperbarui channel brankas
      await updateVaultChannel(interaction.client);

      await interaction.reply({
        content: `Withdrawal **${item}** sebesar **${amount}** berhasil.`,
      });
    } else if (item === "bahan vest") {
      for (const [component, qty] of Object.entries(vest)) {
        const totalQty = qty * amount;
        let found = false;
        for (const category of Object.keys(vault)) {
          if (vault[category].hasOwnProperty(component)) {
            if (vault[category][component] < totalQty) {
              await interaction.reply({
                content: `Jumlah ${component} tidak cukup untuk melakukan penarikan ${amount} bahan vest.`,
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
      }

      // Mencatat kontribusi pengguna untuk "clip peluru de"
      if (!contributions[userId]) {
        contributions[userId] = {
          userName: userName,
          depo: {},
          wd: {},
        };
      }

      if (!contributions[userId].wd["Bahan Vest"]) {
        contributions[userId].wd["Bahan Vest"] = 0;
      }

      contributions[userId].wd["Bahan Vest"] += amount;

      // Menyimpan data brankas dan kontribusi
      saveVaultData();
      saveContributionsData();

      // Memperbarui channel brankas
      await updateVaultChannel(interaction.client);

      await interaction.reply({
        content: `Withdrawal **${item}** sebesar **${amount}** berhasil.`,
      });
    } else if (item === "bahan ginseng") {
      for (const [component, qty] of Object.entries(ginseng)) {
        const totalQty = qty * amount;
        let found = false;
        for (const category of Object.keys(vault)) {
          if (vault[category].hasOwnProperty(component)) {
            if (vault[category][component] < totalQty) {
              await interaction.reply({
                content: `Jumlah ${component} tidak cukup untuk melakukan penarikan ${amount} bahan ginseng.`,
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
      }

      // Mencatat kontribusi pengguna untuk "clip peluru de"
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

      // Menyimpan data brankas dan kontribusi
      saveVaultData();
      saveContributionsData();

      // Memperbarui channel brankas
      await updateVaultChannel(interaction.client);

      await interaction.reply({
        content: `Withdrawal **${item}** sebesar **${amount}** berhasil.`,
      });
    } else {
      // Jika item bukan "clip peluru de", lanjutkan dengan penarikan kategori seperti biasa
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

      // Mencatat kontribusi pengguna
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

      // Menyimpan data brankas dan kontribusi
      saveVaultData();
      saveContributionsData();

      // Memperbarui channel brankas
      await updateVaultChannel(interaction.client);

      await interaction.reply({
        content: `Withdrawal **${item}** sebesar **${amount}**, sisa **${item}** sekarang **${vault[category][item]}**.`,
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
          "clip peluru de",
          "clip peluru python",
          "bahan vest",
          "bahan ginseng",
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
