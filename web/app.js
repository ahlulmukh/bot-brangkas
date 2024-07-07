const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const session = require("express-session");
const flash = require("connect-flash");
const mongoose = require("mongoose");
const apiRouter = require("./routes/api"); // Import router API
const authRouter = require("./routes/auth"); // Import router Auth
const { isAuthenticated, isPengurus } = require("./middleware/auth");
const Vault = require("../models/Vault");

const app = express();
const port = 3000;

mongoose
  .connect(
    "mongodb+srv://ahlulmukh:Mukh2001@cluster0.gch0omi.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Gunakan true jika menggunakan HTTPS
  })
);
app.use(flash());
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views")); // Set folder views
app.use(express.static(path.join(__dirname, "public")));

// Middleware untuk menambahkan flash messages ke res.locals
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
});

// Route untuk login dan registrasi
app.use("/auth", authRouter);

// Middleware untuk menyediakan user ke semua views
app.use((req, res, next) => {
  if (req.session.user) {
    res.locals.user = req.session.user;
  }
  next();
});

// Middleware untuk menyediakan user ke semua views
app.use((req, res, next) => {
  res.locals.user = req.session.user;
  next();
});

// Route untuk login
app.get("/login", (req, res) => {
  res.render("login");
});

// Route untuk login
app.get("/table", async (req, res) => {
  try {
    const vault = await Vault.findOne();
    res.render("databrangkas/table", { vault });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

// Route untuk login
app.get("/register", (req, res) => {
  res.render("register");
});

// Route untuk dashboard
app.get("/", isAuthenticated, (req, res) => {
  res.render("index", { role: req.session.user.role });
});

// Menggunakan router API dengan proteksi
app.use("/api", isAuthenticated, apiRouter);
app.use("/api/edit-item", isPengurus, apiRouter);

app.listen(port, () => {
  console.log(`Web admin dashboard listening at http://localhost:${port}`);
});
