const express = require("express");
const axios = require("axios");
const router = express.Router();

const CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

// 1. Redirect to GitHub login
router.get("/github", (req, res) => {
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
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        code: code,
      },
      { headers: { Accept: "application/json" } }
    );

    const accessToken = tokenResponse.data.access_token;

    // Fetch User Profile using the token
    const userResponse = await axios.get("https://api.github.com/user", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    // FIX: Extract specific user data to send to frontend
    const userData = {
      login: userResponse.data.login,
      avatar_url: userResponse.data.avatar_url,
      id: userResponse.data.id
    };

    // Redirect to Frontend with both token and user data stringified
    const userParam = encodeURIComponent(JSON.stringify(userData));
    res.redirect(`http://localhost:3000/dashboard?token=${accessToken}&user=${userParam}`);
    
  } catch (error) {
    console.error("Auth Error:", error);
    res.status(500).send("Authentication Failed");
  }
});

module.exports = router;