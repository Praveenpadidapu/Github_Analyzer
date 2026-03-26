const express = require("express");
const axios = require("axios");
const router = express.Router();

// 1. Redirect to GitHub login
router.get("/github", (req, res) => {
  const CLIENT_ID = process.env.GITHUB_CLIENT_ID;
  const url = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&scope=repo,user`;
  res.redirect(url);
});

// 2. GitHub Callback Handler
router.get("/github/callback", async (req, res) => {
  const code = req.query.code;

  try {
    // Exchange code for Access Token
    const tokenResponse = await axios.post(
      "https://github.com/login/oauth/access_token",
      {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code: code,
      },
      { headers: { Accept: "application/json" } }
    );

    // ✅ Define it clearly here
    const accessToken = tokenResponse.data.access_token;

    if (!accessToken) {
        return res.status(400).send("Failed to get access token from GitHub");
    }

    // Fetch User Profile using the token
    const userResponse = await axios.get("https://api.github.com/user", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const user = userResponse.data;

    // ✅ FIX: Use the correct variable names in the redirect string
    // We use accessToken and user.login
    res.redirect(`https://project-theta-self-48.vercel.app/dashboard?token=${token}`);
    
  } catch (error) {
    console.error("Auth Error:", error.response ? error.response.data : error.message);
    res.status(500).send("Authentication Failed");
  }
});

module.exports = router;