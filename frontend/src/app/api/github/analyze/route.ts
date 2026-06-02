import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { generateRepoReport } from '@/lib/aiService';
import pool from '@/lib/db';

export async function POST(req: NextRequest) {
  const { repoName, github_id, owner } = await req.json();
  
  const authHeader = req.headers.get('authorization');
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return NextResponse.json({ error: "No GitHub token provided" }, { status: 401 });
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
      commitData = commitsRes.data.map((c: any) => ({
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
    
    let dbResult;
    try {
      dbResult = await pool.query(query, values);
    } catch (dbError) {
      console.error("Database Save Error (Make sure DATABASE_URL is set):", dbError);
      // Even if saving to DB fails, we should still return the AI analysis to the user
      return NextResponse.json({
        id: Date.now(), // fake ID since we couldn't save
        repo_name: repoName,
        report_text: summary,
        health_score: healthScore,
        suggestions: suggestions,
        created_at: new Date().toISOString()
      });
    }

    return NextResponse.json({ ...dbResult.rows[0], suggestions });

  } catch (err: any) {
    console.error("GitHub API Error:", err.response?.data || err.message);
    return NextResponse.json({ error: "Analysis failed due to API error" }, { status: 500 });
  }
}
