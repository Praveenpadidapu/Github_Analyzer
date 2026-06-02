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
      analytics.languages = Object.entries(langRes.data).map(([name, value]) => ({
        name,
        value
      }));
    } catch (e) {
      console.warn("Could not fetch languages for this repo.");
    }

    // 2. FETCH COMMITS (Last 100 for better heatmap)
    try {
      const commitsRes = await axios.get(`https://api.github.com/repos/${owner}/${repoName}/commits?per_page=100`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Aggregate commits by day
      const commitCounts: any = {};
      commitsRes.data.forEach((c: any) => {
        const date = new Date(c.commit.author.date).toISOString().split('T')[0];
        commitCounts[date] = (commitCounts[date] || 0) + 1;
      });
      
      analytics.commits = Object.keys(commitCounts).map(date => ({
        day: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
        date,
        count: commitCounts[date]
      })).sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime()) as any;
      
    } catch (e) {
      console.warn("Could not fetch commits for this repo.");
    }

    return NextResponse.json(analytics);
  } catch (err: any) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
