const express = require("express");
const router = express.Router();
const {
  vault,
  saveVaultData,
  loadVaultData,
} = require("../../bot/utils/vaultUtils");

router.post("/edit-item", (req, res) => {
  const { category, item, quantity } = req.body;

  if (!vault.hasOwnProperty(category)) {
    return res
      .status(400)
      .json({ error: `Kategori ${category} tidak ada dalam brankas.` });
  }

  if (!vault[category].hasOwnProperty(item)) {
    return res
      .status(400)
      .json({ error: `Item ${item} tidak ada dalam kategori ${category}.` });
  }

  vault[category][item] = parseInt(quantity, 10);
  saveVaultData();

  return res.json({
    success: true,
    message: `Item ${item} di kategori ${category} telah diperbarui dengan jumlah ${quantity}.`,
  });
});

router.get("/check-updates", (req, res) => {
  loadVaultData();
  res.json(vault);
});

module.exports = router;
