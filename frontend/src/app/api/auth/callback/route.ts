import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const code = searchParams.get('code');

  if (!code) {
    return NextResponse.json({ error: 'No code provided' }, { status: 400 });
  }

  try {
    const tokenResponse = await axios.post(
      "https://github.com/login/oauth/access_token",
      {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code: code,
      },
      { headers: { Accept: "application/json" } }
    );

    const accessToken = tokenResponse.data.access_token;

    if (!accessToken) {
        return NextResponse.json({ error: 'Failed to get access token from GitHub' }, { status: 400 });
    }

    // Redirect back to dashboard with token
    // In Next.js, we can derive the base URL from the request if NEXT_PUBLIC_API_URL isn't set
    const origin = process.env.NEXT_PUBLIC_API_URL || req.nextUrl.origin;
    return NextResponse.redirect(`${origin}/dashboard?token=${accessToken}`);
    
  } catch (error: any) {
    console.error("Auth Error:", error.response ? error.response.data : error.message);
    return NextResponse.json({ error: 'Authentication Failed' }, { status: 500 });
  }
}
