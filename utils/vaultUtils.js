const fs = require("fs");
const path = require("path");

const dataPath = path.join(__dirname, "../data/vaultData.json");

let vault = {
  kayu: 1000,
  getah: 2000,
  "papan kayu": 500,
  botol: 1000,
};

function saveVaultData() {
  fs.writeFileSync(dataPath, JSON.stringify(vault, null, 2));
}

function loadVaultData() {
  if (fs.existsSync(dataPath)) {
    vault = JSON.parse(fs.readFileSync(dataPath));
  }
}

loadVaultData();

module.exports = {
  saveVaultData,
  vault,
};
