const express = require("express");
const router = express.Router();
const Vault = require("../../models/Vault");

// API Endpoint untuk mengedit data brankas
// API Endpoint untuk mengedit data brankas
router.post("/edit-item", async (req, res) => {
  const { category, item, quantity } = req.body;

  try {
    const vault = await Vault.findOne();
    const categoryDoc = vault.categories.find((cat) => cat.name === category);
    if (!categoryDoc) {
      return res
        .status(400)
        .json({ error: `Kategori ${category} tidak ada dalam brankas.` });
    }

    const itemDoc = categoryDoc.items.find((itm) => itm.name === item);
    if (!itemDoc) {
      return res
        .status(400)
        .json({ error: `Item ${item} tidak ada dalam kategori ${category}.` });
    }

    itemDoc.quantity = parseInt(quantity, 10);
    await vault.save();

    return res.json({
      success: true,
      message: `Item ${item} di kategori ${category} telah diperbarui dengan jumlah ${quantity}.`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

// Endpoint untuk cek perubahan data
router.get("/check-updates", async (req, res) => {
  try {
    const vault = await Vault.findOne();
    res.json(vault);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});
// Endpoint untuk cek perubahan data
router.get("/check-updates", async (req, res) => {
  try {
    const vault = await Vault.findOne();
    res.json(vault);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/vault-data", async (req, res) => {
  try {
    const vault = await Vault.find();
    res.json(vault);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/table", async (req, res) => {
  try {
    const vault = await Vault.findOne();
    res.render("partials/table", { vault });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
