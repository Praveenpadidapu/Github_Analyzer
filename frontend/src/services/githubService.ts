import axios from "axios";

const GITHUB_API_BASE = "https://api.github.com";

export const getAuthenticatedUser = async (token: string) => {
  const res = await axios.get(`${GITHUB_API_BASE}/user`, {
    headers: { Authorization: `token ${token}` },
  });
  return res.data; // contains login, avatar_url, name, followers, following, public_repos
};

export const getUserRepositories = async (token: string, username: string) => {
  // To keep it simple, we fetch the first 100 repos.
  // In a full implementation, you'd handle pagination.
  const res = await axios.get(`${GITHUB_API_BASE}/users/${username}/repos?per_page=100&sort=updated`, {
    headers: { Authorization: `token ${token}` },
  });
  return res.data;
};

export const getLanguageAnalytics = (repos: any[]) => {
  const languageCounts: Record<string, number> = {};
  
  repos.forEach(repo => {
    if (repo.language) {
      languageCounts[repo.language] = (languageCounts[repo.language] || 0) + 1;
    }
  });

  const data = Object.entries(languageCounts)
    .map(([name, count]) => ({ name, value: count }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5); // top 5

  // Add colors
  const colors = ['#3178c6', '#f1e05a', '#3572A5', '#00ADD8', '#8b949e'];
  return data.map((item, index) => ({ ...item, color: colors[index % colors.length] }));
};

export const getCommitActivity = async (token: string, username: string) => {
  const query = `
    query($userName:String!) {
      user(login: $userName) {
        contributionsCollection {
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                contributionCount
                date
              }
            }
          }
        }
      }
    }
  `;

  try {
    const res = await axios.post(
      'https://api.github.com/graphql',
      { query, variables: { userName: username } },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const weeks = res.data?.data?.user?.contributionsCollection?.contributionCalendar?.weeks || [];
    
    // Flatten all days
    const allDays = weeks.flatMap((w: any) => w.contributionDays);
    
    return allDays.map((d: any) => ({
      date: d.date,
      commits: d.contributionCount
    }));
  } catch (e) {
    console.error("Failed to fetch GraphQL contributions", e);
    return [];
  }
};

export const getRepositoryReadme = async (token: string, owner: string, repo: string) => {
  try {
    const res = await axios.get(`${GITHUB_API_BASE}/repos/${owner}/${repo}/readme`, {
      headers: { Authorization: `token ${token}`, Accept: "application/vnd.github.v3.raw" },
    });
    return res.data;
  } catch (e) {
    return null;
  }
};
