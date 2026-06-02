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
    // Using robust URL cloning guarantees it works locally and on any Vercel domain automatically
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = '/dashboard';
    redirectUrl.searchParams.set('token', accessToken);
    redirectUrl.searchParams.delete('code'); // clean up the code param
    
    return NextResponse.redirect(redirectUrl);
    
  } catch (error: any) {
    console.error("Auth Error:", error.response ? error.response.data : error.message);
    return NextResponse.json({ error: 'Authentication Failed' }, { status: 500 });
  }
}
