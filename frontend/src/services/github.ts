// src/services/github.ts
import axios from "axios";

export const fetchGitHubData = async () => {
  const token = localStorage.getItem("github_token");

  const res = await axios.get("http://localhost:5000/api/github/data", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};