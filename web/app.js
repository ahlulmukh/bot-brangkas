const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const session = require("express-session");
const flash = require("connect-flash");
const mongoose = require("mongoose");
const apiRouter = require("./routes/api");
const authRouter = require("./routes/auth");
const { isAuthenticated, isPengurus } = require("./middleware/auth");
const Vault = require("../models/Vault");
require("dotenv").config();

const app = express();
const port = 1954;

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);
app.use(flash());
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
});

app.use("/auth", authRouter);

app.use((req, res, next) => {
  if (req.session.user) {
    res.locals.user = req.session.user;
  }
  next();
});

app.use((req, res, next) => {
  res.locals.user = req.session.user;
  next();
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/table", async (req, res) => {
  try {
    const vault = await Vault.findOne();
    res.render("databrangkas/table", { vault });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/depo", async (req, res) => {
  try {
    res.render("depo/data");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.get("/", isAuthenticated, (req, res) => {
  res.render("index", { role: req.session.user.role });
});

app.use("/api", isAuthenticated, apiRouter);
app.use("/api/edit-item", isPengurus, apiRouter);

app.listen(port, () => {
  console.log(`Web admin dashboard listening at http://localhost:${port}`);
});
