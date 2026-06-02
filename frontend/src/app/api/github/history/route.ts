import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const github_id = searchParams.get('github_id');

  if (!github_id) {
    return NextResponse.json({ error: 'GitHub ID required' }, { status: 400 });
  }

  try {
    const result = await pool.query(
      "SELECT * FROM ai_reports WHERE github_id = $1 ORDER BY created_at DESC", 
      [github_id]
    );
    return NextResponse.json(result.rows);
  } catch (err: any) {
    console.error("Database Fetch Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
