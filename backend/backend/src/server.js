const express = require("express");
const cors = require("cors");
require("dotenv").config();

// Import the auth routes you created
const authRoutes = require("./routes/auth");
const githubRoutes = require("./routes/github");
//app.use("/api/github", githubRoutes);

const app = express();

// Middleware
app.use(
  cors({
    origin: ["http://localhost:3000", "https://project-theta-self-48.vercel.app"],
    credentials: true,
  })
);
app.use(express.json()); // Allows backend to read JSON data

// Routes
app.use("/auth", authRoutes);
app.use("/api/github", githubRoutes);

// Basic Test Route
app.get("/", (req, res) => {
  res.send("DevInsight AI Backend is running 🚀");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});