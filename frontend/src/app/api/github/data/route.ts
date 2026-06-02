import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

// Helper to fetch all pages from GitHub API
const fetchAllPages = async (url: string, token: string) => {
  let results: any[] = [];
  let nextUrl: string | null = url;
  
  while (nextUrl) {
    const res: any = await axios.get(nextUrl, { headers: { Authorization: `Bearer ${token}` } });
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

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return NextResponse.json({ error: 'No token provided' }, { status: 401 });
  }

  try {
    // 1. Fetch User
    const userRes = await axios.get("https://api.github.com/user", { headers: { Authorization: `Bearer ${token}` } });
    const user = userRes.data;

    // 2. Fetch all Repositories
    const repos = await fetchAllPages("https://api.github.com/user/repos?sort=updated&per_page=100", token);

    return NextResponse.json({ user, repos });
  } catch (err: any) {
    console.error("Critical Backend Error:", err.response?.data || err.message);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
