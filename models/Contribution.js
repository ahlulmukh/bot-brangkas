const mongoose = require("mongoose");

const ContributionSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  depo: {
    type: Map,
    of: Map,
  },
  wd: {
    type: Map,
    of: Map,
  },
});

const Contribution = mongoose.model("Contribution", ContributionSchema);

module.exports = Contribution;
