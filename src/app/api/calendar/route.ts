import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

const MOCK_USER_ID = 'mock-user-id';

// GET /api/calendar?start=ISO&end=ISO — fetch interviews in date range
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const start = searchParams.get('start');
    const end = searchParams.get('end');

    if (!start || !end) {
      return NextResponse.json(
        { error: 'start and end query parameters are required' },
        { status: 400 }
      );
    }

    const interviews = await db.interview.findMany({
      where: {
        company: {
          userId: MOCK_USER_ID,
        },
        scheduledAt: {
          gte: new Date(start),
          lte: new Date(end),
        },
      },
      include: {
        company: true,
      },
      orderBy: {
        scheduledAt: 'asc',
      },
    });

    return NextResponse.json(interviews);
  } catch (error) {
    console.error('Failed to fetch calendar interviews:', error);
    return NextResponse.json(
      { error: 'Failed to fetch calendar interviews' },
      { status: 500 }
    );
  }
}
