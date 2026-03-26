const pool = require("../config/db");
const axios = require("axios");

const fetchGitHubData = async (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];
  const { repo: selectedRepoName } = req.query;

  if (!token) return res.status(401).json({ error: "No token provided" });

  try {
    // 1. Fetch User and Repos
    const [userRes, reposRes] = await Promise.all([
      axios.get("https://api.github.com/user", { headers: { Authorization: `Bearer ${token}` } }),
      axios.get("https://api.github.com/user/repos?sort=updated&per_page=50", { headers: { Authorization: `Bearer ${token}` } })
    ]);

    const user = userRes.data;
    const repos = reposRes.data || [];

    if (repos.length === 0) {
      return res.json({ user, repos: [], activeRepo: null, analytics: { languages: [], commits: [] } });
    }

    const activeRepo = selectedRepoName 
      ? repos.find(r => r.name === selectedRepoName) 
      : repos[0];

    let analytics = { languages: [], commits: [] };

    if (activeRepo) {
      const owner = activeRepo.owner.login;
      const repoName = activeRepo.name;

      // 2. FETCH DYNAMIC LANGUAGES (BYTES OF CODE)
      try {
        const langRes = await axios.get(`https://api.github.com/repos/${owner}/${repoName}/languages`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // Map the GitHub object { "JavaScript": 1234, "HTML": 567 } to the array format Recharts needs
        analytics.languages = Object.entries(langRes.data).map(([name, value]) => ({
          name,
          value // The bytes of code
        }));
      } catch (e) {
        console.warn("Could not fetch languages for this repo.");
        analytics.languages = [];
      }

      // 3. FETCH DYNAMIC COMMITS (LAST 10)
      try {
        const commitRes = await axios.get(`https://api.github.com/repos/${owner}/${repoName}/commits?per_page=10`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        analytics.commits = commitRes.data.map(c => ({
          day: new Date(c.commit.author.date).toLocaleDateString('en-US', { weekday: 'short' }),
          count: 1 
        })).reverse();
      } catch (e) {
        analytics.commits = [];
      }
    }

    res.json({ user, repos, activeRepo, analytics });
  } catch (err) {
    console.error("Critical Backend Error:", err.response?.data || err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// backend/src/controllers/githubController.js

const runAIAnalysis = async (req, res) => {
  const { repoName, github_id, owner } = req.body;
  
  // 1. Get the token from the headers sent by the frontend
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "No GitHub token provided" });
  }

  try {
    // 2. Use the token to fetch repo details for the "Accurate" analysis
    const repoRes = await axios.get(`https://api.github.com/repos/${owner}/${repoName}`, {
      headers: { Authorization: `Bearer ${token}` } // This fixes the 401
    });

    const { stargazers_count, open_issues_count, language, size } = repoRes.data;

    // 3. Logic-based Scoring
    let score = 80;
    if (open_issues_count > 10) score -= 10;
    if (stargazers_count > 5) score += 5;
    const finalScore = Math.min(score, 99);

    const suggestions = [
      `Optimize ${language || 'code'} for better performance.`,
      `Resolve the ${open_issues_count} open issues.`,
      "Add GitHub Actions for CI/CD.",
      "Improve documentation coverage."
    ];

    const summary = `Accurate analysis for ${repoName}: Health score is ${finalScore}%. Found ${stargazers_count} stars and ${open_issues_count} issues.`;

    // 4. Save to Database
    const query = `
      INSERT INTO ai_reports (github_id, repo_name, report_text, health_score, suggestions, created_at)
      VALUES ($1, $2, $3, $4, $5, NOW())
      RETURNING *;
    `;
    const values = [String(github_id), repoName, summary, finalScore, JSON.stringify(suggestions)];
    const result = await pool.query(query, values);

    res.json({ ...result.rows[0], suggestions });

  } catch (err) {
    // Log the actual GitHub error to your backend terminal
    console.error("GitHub API Error:", err.response?.data || err.message);
    res.status(500).json({ error: "Analysis failed due to GitHub API error" });
  }
};
const getSavedReports = async (req, res) => {
  const { github_id } = req.query;
  try {
    const result = await pool.query(
      "SELECT * FROM ai_reports WHERE github_id = $1 ORDER BY created_at DESC", 
      [github_id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteReport = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("DELETE FROM ai_reports WHERE id = $1", [id]);
    if (result.rowCount === 0) return res.status(404).json({ error: "Report not found" });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { fetchGitHubData, runAIAnalysis, getSavedReports, deleteReport };