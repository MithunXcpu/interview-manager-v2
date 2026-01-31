import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { createInterviewSchema } from '@/lib/validators';

const MOCK_USER_ID = 'mock-user-id';

// =============================================================================
// GET /api/interviews — list interviews, optionally by companyId
// =============================================================================

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const companyId = searchParams.get('companyId');

    const where: Record<string, unknown> = {};

    if (companyId) {
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
      where.companyId = companyId;
    } else {
      // All interviews for the user's companies
      where.company = { userId: MOCK_USER_ID };
    }

    const interviews = await db.interview.findMany({
      where,
      include: { company: true },
      orderBy: { scheduledAt: 'desc' },
    });

    return NextResponse.json(interviews);
  } catch (error) {
    console.error('GET /api/interviews error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch interviews' },
      { status: 500 }
    );
  }
}

// =============================================================================
// POST /api/interviews — create a new interview
// =============================================================================

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = createInterviewSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const data = parsed.data;

    // Verify the company belongs to the user
    const company = await db.company.findFirst({
      where: { id: data.companyId, userId: MOCK_USER_ID },
    });

    if (!company) {
      return NextResponse.json(
        { error: 'Company not found' },
        { status: 404 }
      );
    }

    const interview = await db.interview.create({
      data: {
        companyId: data.companyId,
        title: data.title,
        scheduledAt: data.scheduledAt,
        duration: data.duration,
        type: data.type,
        meetingType: data.meetingType ?? undefined,
        meetingLink: data.meetingLink || null,
        location: data.location || null,
        interviewerName: data.interviewerName || null,
        interviewerRole: data.interviewerRole || null,
        interviewerLinkedIn: data.interviewerLinkedIn || null,
        notes: data.notes || null,
      },
      include: { company: true },
    });

    // Update the company's lastActivityDate
    await db.company.update({
      where: { id: data.companyId },
      data: { lastActivityDate: new Date() },
    });

    return NextResponse.json(interview, { status: 201 });
  } catch (error) {
    console.error('POST /api/interviews error:', error);
    return NextResponse.json(
      { error: 'Failed to create interview' },
      { status: 500 }
    );
  }
}
