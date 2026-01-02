const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json()); // supaya bisa baca JSON

// KONEKSI DATABASE
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "", // isi sesuai MySQL kamu
  database: "iotown"
});

db.connect(err => {
  if (err) {
    console.log("❌ DB Error:", err);
  } else {
    console.log("✅ Database connected");
  }
});

// TEST SERVER
app.get("/", (req, res) => {
  res.send("Backend IoTown OK");
});

app.listen(3001, () => {
  console.log("🚀 Server running on http://localhost:3001");
});

// REGISTER
app.post("/register", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.json({ success: false, message: "Data kosong" });
  }

  const sql = "INSERT INTO users (email, password) VALUES (?, ?)";
  db.query(sql, [email, password], (err, result) => {
    if (err) {
      return res.json({ success: false, message: "Gagal register" });
    }
    res.json({ success: true, message: "Register berhasil" });
  });
});

// LOGIN
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  const sql = "SELECT * FROM users WHERE email = ? AND password = ?";
  db.query(sql, [email, password], (err, results) => {
    if (err) {
      return res.json({ success: false });
    }

    if (results.length > 0) {
      res.json({ success: true });
    } else {
      res.json({ success: false, message: "Email / Password salah" });
    }
  });
});
