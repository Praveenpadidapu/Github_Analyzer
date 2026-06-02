import { NextResponse } from 'next/server';

export async function GET() {
  const CLIENT_ID = process.env.GITHUB_CLIENT_ID;
  const url = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&scope=repo,user&prompt=consent`;
  return NextResponse.redirect(url);
}
