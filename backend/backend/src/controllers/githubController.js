const pool = require("../config/db");
const githubService = require("../services/githubService");

const fetchGitHubData = async (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];
  const { repo } = req.query;

  if (!token) return res.status(401).json({ error: "No token" });

  try {
    const user = await githubService.getUser(token);
    const repos = await githubService.getRepos(token);
    const activeRepo = repo ? repos.find(r => r.name === repo) : repos[0];
    
    let commitData = [];
    if (activeRepo) {
      commitData = await githubService.getCommits(token, activeRepo.owner.login, activeRepo.name);
    }
    res.json({ user, repos, activeRepo, commitData });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const runAIAnalysis = async (req, res) => {
  try {
    // Your AI logic here
    res.json({ summary: "Analysis complete", healthScore: 85 });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getSavedReports = async (req, res) => {
  const { github_id } = req.query;
  try {
    const result = await pool.query("SELECT * FROM ai_reports WHERE github_id = $1", [github_id]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteReport = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM ai_reports WHERE id = $1", [id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// CRITICAL: Make sure these names match exactly what you import in routes
module.exports = { 
  fetchGitHubData, 
  runAIAnalysis, 
  getSavedReports, 
  deleteReport 
};