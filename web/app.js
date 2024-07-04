const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const apiRouter = require("./routes/api");
const { vault } = require("../bot/utils/vaultUtils");

const app = express();
const port = 1955;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.render("index", { vault });
});

app.use("/api", apiRouter);

app.listen(port, () => {
  console.log(`Web admin dashboard listening at http://localhost:${port}`);
});
