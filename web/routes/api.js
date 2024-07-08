const express = require("express");
const router = express.Router();
const Vault = require("../../models/Vault");

// API Endpoint untuk menambahkan kategori baru
router.post("/add-category", async (req, res) => {
  const { category } = req.body;

  try {
    const vault = await Vault.findOne();
    if (!vault) {
      const newVault = new Vault({
        categories: [{ name: category, items: [] }],
      });
      await newVault.save();
    } else {
      if (vault.categories.find((cat) => cat.name === category)) {
        return res
          .status(400)
          .json({ error: `Kategori ${category} sudah ada.` });
      }
      vault.categories.push({ name: category, items: [] });
      await vault.save();
    }

    return res.json({
      success: true,
      message: `Kategori ${category} berhasil ditambahkan.`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

// API Endpoint untuk menambahkan item baru ke kategori
router.post("/add-item", async (req, res) => {
  const { category, item, quantity } = req.body;

  try {
    const vault = await Vault.findOne();
    if (!vault) {
      return res.status(400).json({ error: `Kategori ${category} tidak ada.` });
    }

    const categoryDoc = vault.categories.find((cat) => cat.name === category);
    if (!categoryDoc) {
      return res.status(400).json({ error: `Kategori ${category} tidak ada.` });
    }

    if (categoryDoc.items.find((itm) => itm.name === item)) {
      return res
        .status(400)
        .json({ error: `Item ${item} sudah ada dalam kategori ${category}.` });
    }

    categoryDoc.items.push({ name: item, quantity: parseInt(quantity, 10) });
    await vault.save();

    return res.json({
      success: true,
      message: `Item ${item} berhasil ditambahkan ke kategori ${category} dengan jumlah ${quantity}.`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

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

router.post("/delete-item", async (req, res) => {
  const { category, item } = req.body;

  try {
    const vault = await Vault.findOne();
    if (!vault) {
      return res.status(400).json({ error: `Kategori ${category} tidak ada.` });
    }

    const categoryDoc = vault.categories.find((cat) => cat.name === category);
    if (!categoryDoc) {
      return res.status(400).json({ error: `Kategori ${category} tidak ada.` });
    }

    const itemIndex = categoryDoc.items.findIndex((itm) => itm.name === item);
    if (itemIndex === -1) {
      return res
        .status(400)
        .json({ error: `Item ${item} tidak ada dalam kategori ${category}.` });
    }

    categoryDoc.items.splice(itemIndex, 1);
    await vault.save();

    return res.json({
      success: true,
      message: `Item ${item} dari kategori ${category} berhasil dihapus.`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

// API Endpoint untuk menghapus kategori
router.post("/delete-category", async (req, res) => {
  const { category } = req.body;

  try {
    const vault = await Vault.findOne();
    if (!vault) {
      return res.status(400).json({ error: `Kategori ${category} tidak ada.` });
    }

    const categoryIndex = vault.categories.findIndex(
      (cat) => cat.name === category
    );
    if (categoryIndex === -1) {
      return res.status(400).json({ error: `Kategori ${category} tidak ada.` });
    }

    vault.categories.splice(categoryIndex, 1);
    await vault.save();

    return res.json({
      success: true,
      message: `Kategori ${category} berhasil dihapus.`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
