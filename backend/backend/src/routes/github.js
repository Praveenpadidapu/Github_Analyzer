const express = require("express");
const router = express.Router();
// Use destructuring to pull the functions from the controller
const { 
  fetchGitHubData, 
  runAIAnalysis, 
  getSavedReports, 
  deleteReport 
} = require("../controllers/githubController");

// Ensure all these variables (fetchGitHubData, etc.) actually exist!
router.get("/data", fetchGitHubData);
router.post("/analyze", runAIAnalysis); 
router.get("/history", getSavedReports);
router.delete("/history/:id", deleteReport);

module.exports = router;