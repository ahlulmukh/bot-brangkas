const { Vault } = require("../../models");
const { updateVaultChannel } = require("../utils/updateUtils");
const { channelWd } = require("../config.json");

const clipPeluruDEComponents = {
  Besi: 20,
  Tembaga: 25,
  Botol: 30,
  "Minyak Paket": 7,
  "Papan Kemasan": 7,
  "Paket Andaliman": 2,
  Emas: 12,
};

const clipPeluruPythonComponents = {
  "Paket Andaliman": 2,
  "Minyak Paket": 8,
  "Papan Kemasan": 12,
  Emas: 15,
  Besi: 25,
  Tembaga: 30,
  Botol: 35,
};

const vestComponents = {
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

const ginsengComponents = {
  Garam: 2,
  "Kunyit Saset": 2,
  Gula: 3,
  Botol: 4,
};

const acp45Components = {
  "Paket Andaliman": 2,
  "Minyak Paket": 6,
  "Papan Kemasan": 7,
  Emas: 15,
  Besi: 20,
  Tembaga: 25,
  Botol: 35,
};

const ak726Components = {
  "Paket Andaliman": 2,
  "Minyak Paket": 8,
  "Papan Kemasan": 13,
  Emas: 15,
  Tembaga: 25,
  Besi: 30,
  Botol: 40,
};

const bmg50Components = {
  "Paket Andaliman": 3,
  "Papan Kemasan": 12,
  "Minyak Paket": 12,
  Emas: 15,
  Tembaga: 25,
  Besi: 35,
  Botol: 40,
};

const lockpickComponents = {
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

    const vault = await Vault.findOne();

    const processWithdrawal = async (components, item, multiplier = 1) => {
      let totalWithdrawn = [];

      for (const [component, qty] of Object.entries(components)) {
        const totalQty = qty * multiplier;
        let found = false;

        for (const categoryDoc of vault.categories) {
          const itemDoc = categoryDoc.items.find(
            (itm) => itm.name === component
          );
          if (itemDoc) {
            if (itemDoc.quantity < totalQty) {
              await interaction.reply({
                content: `Jumlah ${component} tidak cukup untuk melakukan penarikan ${amount} ${item}.`,
                ephemeral: true,
              });
              return;
            }

            itemDoc.quantity -= totalQty;
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

      await vault.save();
      await updateVaultChannel(interaction.client);

      let totalMessage = "Bahan yang diambil:\n" + totalWithdrawn.join("\n");

      await interaction.reply({
        content: `\`\`\`Withdrawal ${amount} ${item} berhasil.\n${totalMessage}\`\`\``,
      });
    };

    switch (item) {
      case "Clip Peluru De":
        await processWithdrawal(clipPeluruDEComponents, item, amount);
        break;
      case "Clip Peluru Python":
        await processWithdrawal(clipPeluruPythonComponents, item, amount);
        break;
      case "Bahan Vest":
        await processWithdrawal(vestComponents, item, amount);
        break;
      case "Bahan Ginseng":
        const ginsengMultiplier = Math.ceil(amount / 5);
        await processWithdrawal(ginsengComponents, item, ginsengMultiplier);
        break;
      case "Clip Acp 45":
        await processWithdrawal(acp45Components, item, amount);
        break;
      case "Clip AK":
        await processWithdrawal(ak726Components, item, amount);
        break;
      case "Clip Sniper":
        await processWithdrawal(bmg50Components, item, amount);
        break;
      case "Lockpick":
        await processWithdrawal(lockpickComponents, item, amount);
        break;
      default:
        const category = interaction.options.getString("category");
        const categoryDoc = vault.categories.find(
          (cat) => cat.name === category
        );

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

        if (itemDoc.quantity < amount) {
          await interaction.reply({
            content: `Jumlah ${item} tidak cukup untuk melakukan penarikan.`,
            ephemeral: true,
          });
          return;
        }

        itemDoc.quantity -= amount;

        await vault.save();
        await updateVaultChannel(interaction.client);

        await interaction.reply({
          content: `\`\`\`Withdrawal ${item} sebesar ${amount}, sisa ${item} sekarang ${itemDoc.quantity}.\`\`\``,
        });
    }
  },
  async autocomplete(interaction) {
    const focusedOption = interaction.options.getFocused(true);
    const vault = await Vault.findOne();
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
        const categoryDoc = vault.categories.find(
          (cat) => cat.name === category
        );
        if (categoryDoc) {
          choices = categoryDoc.items.map((itm) => itm.name);
        }
      }
    } else if (focusedOption.name === "category") {
      choices = vault.categories.map((cat) => cat.name).concat("Crafting");
    }

    const filtered = choices.filter((choice) =>
      choice.startsWith(focusedOption.value)
    );
    await interaction.respond(
      filtered.map((choice) => ({ name: choice, value: choice }))
    );
  },
};
