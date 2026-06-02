import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  const token = authHeader && authHeader.split(" ")[1];
  
  const searchParams = req.nextUrl.searchParams;
  const owner = searchParams.get('owner');
  const repoName = searchParams.get('repo');

  if (!token) return NextResponse.json({ error: 'No token provided' }, { status: 401 });
  if (!owner || !repoName) return NextResponse.json({ error: 'Owner and repo required' }, { status: 400 });

  try {
    let analytics: { languages: any[]; commits: any[] } = { languages: [], commits: [] };

    // 1. FETCH LANGUAGES
    try {
      const langRes = await axios.get(`https://api.github.com/repos/${owner}/${repoName}/languages`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const langData = langRes.data as Record<string, number>;
      const totalBytes = Object.values(langData).reduce((acc, val) => acc + val, 0);
      
      analytics.languages = Object.entries(langData)
        .map(([name, value]) => ({
          name,
          value,
          percentage: totalBytes > 0 ? ((value / totalBytes) * 100).toFixed(1) : 0
        }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 5); // Keep top 5 for clean UI
    } catch (e) {
      console.warn("Could not fetch languages for this repo.");
    }

    // 2. FETCH COMMITS (Last 12 months)
    try {
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
      
      const commitsRes = await axios.get(`https://api.github.com/repos/${owner}/${repoName}/commits?since=${oneYearAgo.toISOString()}&per_page=100`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Aggregate commits by month
      const commitCounts: Record<string, number> = {};
      
      // Initialize last 12 months with 0
      for (let i = 11; i >= 0; i--) {
        const d = new Date();
        d.setMonth(d.getMonth() - i);
        const monthKey = d.toLocaleString('en-US', { month: 'short', year: 'numeric' });
        commitCounts[monthKey] = 0;
      }

      commitsRes.data.forEach((c: any) => {
        const date = new Date(c.commit.author.date);
        const monthKey = date.toLocaleString('en-US', { month: 'short', year: 'numeric' });
        if (commitCounts[monthKey] !== undefined) {
          commitCounts[monthKey]++;
        }
      });
      
      analytics.commits = Object.keys(commitCounts).map(monthKey => ({
        day: monthKey.split(' ')[0], // Just use the short month name (Jan, Feb)
        date: monthKey,
        count: commitCounts[monthKey]
      }));
      
    } catch (e) {
      console.warn("Could not fetch commits for this repo.");
    }

    return NextResponse.json(analytics);
  } catch (err: any) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
