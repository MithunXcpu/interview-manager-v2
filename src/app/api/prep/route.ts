import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

const MOCK_USER_ID = 'mock-user-id';

// =============================================================================
// GET /api/prep -- fetch interview preps, optional companyId filter
// =============================================================================

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const companyId = searchParams.get('companyId');

    const preps = await db.interviewPrep.findMany({
      where: {
        ...(companyId ? { companyId } : {}),
        company: { userId: MOCK_USER_ID },
      },
      include: {
        company: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(preps);
  } catch (error) {
    console.error('GET /api/prep error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch interview preps' },
      { status: 500 }
    );
  }
}

// =============================================================================
// POST /api/prep -- create a new prep item
// =============================================================================

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { companyId, type, title, content } = body;

    if (!companyId || !type || !title || !content) {
      return NextResponse.json(
        { error: 'Missing required fields: companyId, type, title, content' },
        { status: 400 }
      );
    }

    // Verify the company belongs to the user
    const company = await db.company.findFirst({
      where: { id: companyId, userId: MOCK_USER_ID },
    });

    if (!company) {
      return NextResponse.json(
        { error: 'Company not found' },
        { status: 404 }
      );
    }

    const prep = await db.interviewPrep.create({
      data: {
        companyId,
        type,
        title,
        content,
      },
      include: {
        company: true,
      },
    });

    return NextResponse.json(prep, { status: 201 });
  } catch (error) {
    console.error('POST /api/prep error:', error);
    return NextResponse.json(
      { error: 'Failed to create interview prep' },
      { status: 500 }
    );
  }
}
