const axios = require("axios");

const getUser = async (token) => {
  const res = await axios.get("https://api.github.com/user", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

const getRepos = async (token) => {
  const res = await axios.get("https://api.github.com/user/repos", {
    headers: { Authorization: `Bearer ${token}` },
    params: { per_page: 100, sort: "pushed", affiliation: "owner" },
  });

  return res.data
    .filter((repo) => !repo.fork)
    .map((repo) => ({
      id: repo.id,
      name: repo.name,
      description: repo.description || "No description provided.",
      language: repo.language || "Markdown",
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      open_issues: repo.open_issues_count,
      url: repo.html_url,
      owner: { login: repo.owner.login }
    }));
};

const getCommits = async (token, owner, repo) => {
  try {
    const res = await axios.get(`https://api.github.com/repos/${owner}/${repo}/commits`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (err) {
    return [];
  }
};

module.exports = { getUser, getRepos, getCommits };