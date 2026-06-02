const pool = require("../config/db");
const axios = require("axios");
const { generateRepoReport } = require("../services/aiService");

// Helper to fetch all pages from GitHub API
const fetchAllPages = async (url, token) => {
  let results = [];
  let nextUrl = url;
  
  while (nextUrl) {
    const res = await axios.get(nextUrl, { headers: { Authorization: `Bearer ${token}` } });
    results = results.concat(res.data);
    
    // Check for 'next' page in Link header
    const linkHeader = res.headers.link;
    if (linkHeader && linkHeader.includes('rel="next"')) {
      const match = linkHeader.match(/<([^>]+)>;\s*rel="next"/);
      nextUrl = match ? match[1] : null;
    } else {
      nextUrl = null;
    }
  }
  return results;
};

const fetchGitHubData = async (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];
  const { repo: selectedRepoName } = req.query;

  if (!token) return res.status(401).json({ error: "No token provided" });

  try {
    // 1. Fetch User
    const userRes = await axios.get("https://api.github.com/user", { headers: { Authorization: `Bearer ${token}` } });
    const user = userRes.data;

    // 2. Fetch all Repositories
    const repos = await fetchAllPages("https://api.github.com/user/repos?sort=updated&per_page=100", token);

    if (!repos || repos.length === 0) {
      return res.json({ user, repos: [], activeRepo: null, analytics: { languages: [], commits: [] } });
    }

    const activeRepo = selectedRepoName 
      ? repos.find(r => r.name === selectedRepoName) 
      : repos[0];

    let analytics = { languages: [], commits: [] };

    if (activeRepo) {
      const owner = activeRepo.owner.login;
      const repoName = activeRepo.name;

      // 3. FETCH LANGUAGES
      try {
        const langRes = await axios.get(`https://api.github.com/repos/${owner}/${repoName}/languages`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        analytics.languages = Object.entries(langRes.data).map(([name, value]) => ({
          name,
          value
        }));
      } catch (e) {
        console.warn("Could not fetch languages for this repo.");
        analytics.languages = [];
      }

      // 4. FETCH COMMITS (Last 100 for better heatmap)
      try {
        const commitsRes = await axios.get(`https://api.github.com/repos/${owner}/${repoName}/commits?per_page=100`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // Aggregate commits by day
        const commitCounts = {};
        commitsRes.data.forEach(c => {
          const date = new Date(c.commit.author.date).toISOString().split('T')[0];
          commitCounts[date] = (commitCounts[date] || 0) + 1;
        });
        
        analytics.commits = Object.keys(commitCounts).map(date => ({
          day: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
          date,
          count: commitCounts[date]
        })).sort((a, b) => new Date(a.date) - new Date(b.date));
        
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

const runAIAnalysis = async (req, res) => {
  const { repoName, github_id, owner } = req.body;
  
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "No GitHub token provided" });
  }

  try {
    // 1. Fetch repo details for context
    const repoRes = await axios.get(`https://api.github.com/repos/${owner}/${repoName}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const repoData = {
      name: repoRes.data.name,
      language: repoRes.data.language,
      stars: repoRes.data.stargazers_count,
      forks: repoRes.data.forks_count
    };

    // 2. Fetch recent commits for context
    let commitData = [];
    try {
      const commitsRes = await axios.get(`https://api.github.com/repos/${owner}/${repoName}/commits?per_page=10`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      commitData = commitsRes.data.map(c => ({
        message: c.commit.message,
        date: c.commit.author.date
      }));
    } catch(e) {
      console.warn("Could not fetch commits for AI analysis");
    }

    // 3. Call Actual AI Service
    const aiResult = await generateRepoReport(repoData, commitData);

    const { healthScore, summary, suggestions } = aiResult;

    // 4. Save to Database
    const query = `
      INSERT INTO ai_reports (github_id, repo_name, report_text, health_score, suggestions, created_at)
      VALUES ($1, $2, $3, $4, $5, NOW())
      RETURNING *;
    `;
    const values = [String(github_id), repoName, summary, healthScore, JSON.stringify(suggestions)];
    const result = await pool.query(query, values);

    res.json({ ...result.rows[0], suggestions });

  } catch (err) {
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