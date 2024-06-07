const fs = require("fs");
const path = require("path");

const dataPath = path.join(__dirname, "../data/messageData.json");

let messageData = {
  channelId: "",
  messageId: "",
};

function saveMessageData() {
  fs.writeFileSync(dataPath, JSON.stringify(messageData, null, 2));
}

function loadMessageData() {
  if (fs.existsSync(dataPath)) {
    messageData = JSON.parse(fs.readFileSync(dataPath));
  }
}

loadMessageData();

module.exports = {
  saveMessageData,
  messageData,
};
