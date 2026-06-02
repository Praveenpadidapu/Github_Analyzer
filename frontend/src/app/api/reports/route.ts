import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// For demonstration, using a mock user ID. In production, get from session.
const MOCK_USER_ID = "cm0m0m0m00000000000000000"; 

export async function GET() {
  try {
    const reports = await prisma.savedReport.findMany({
      where: { userId: MOCK_USER_ID },
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(reports);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch reports' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Ensure mock user exists
    await prisma.user.upsert({
      where: { id: MOCK_USER_ID },
      update: {},
      create: {
        id: MOCK_USER_ID,
        githubId: 'mock-123',
        username: 'devinsight-user',
      }
    });

    const report = await prisma.savedReport.create({
      data: {
        userId: MOCK_USER_ID,
        targetUsername: body.targetUsername,
        repositoryCount: body.repositoryCount,
        aiScore: body.aiScore,
        commitStats: body.commitStats,
        aiAnalysis: body.aiAnalysis,
      }
    });
    return NextResponse.json(report);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save report' }, { status: 500 });
  }
}
