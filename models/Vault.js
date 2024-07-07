const mongoose = require("mongoose");

const ItemSchema = new mongoose.Schema({
  name: String,
  quantity: Number,
});

const CategorySchema = new mongoose.Schema({
  name: String,
  items: [ItemSchema],
});

const VaultSchema = new mongoose.Schema({
  categories: [CategorySchema],
});

const Vault = mongoose.model("Vault", VaultSchema);

module.exports = Vault;
