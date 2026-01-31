import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { createCompanySchema } from '@/lib/validators';

const MOCK_USER_ID = 'mock-user-id'; // Replace with Clerk auth later

// =============================================================================
// GET /api/companies — fetch all companies for the current user
// =============================================================================

export async function GET() {
  try {
    const companies = await db.company.findMany({
      where: { userId: MOCK_USER_ID },
      include: {
        userStage: true,
        interviews: {
          orderBy: { scheduledAt: 'asc' },
        },
        emails: {
          orderBy: { receivedAt: 'desc' },
          take: 5,
        },
        research: true,
        offers: true,
      },
      orderBy: { updatedAt: 'desc' },
    });

    return NextResponse.json(companies);
  } catch (error) {
    console.error('GET /api/companies error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch companies' },
      { status: 500 }
    );
  }
}

// =============================================================================
// POST /api/companies — create a new company
// =============================================================================

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = createCompanySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const data = parsed.data;

    const company = await db.company.create({
      data: {
        userId: MOCK_USER_ID,
        name: data.name,
        jobTitle: data.jobTitle ?? null,
        website: data.website || null,
        location: data.location ?? null,
        salaryMin: data.salaryMin ?? null,
        salaryMax: data.salaryMax ?? null,
        priority: data.priority ?? 'MEDIUM',
        recruiterName: data.recruiterName ?? null,
        recruiterEmail: data.recruiterEmail || null,
        notes: data.notes ?? null,
        jobUrl: data.jobUrl || null,
        appliedDate: data.appliedDate ?? null,
        userStageId: data.userStageId ?? null,
      },
      include: {
        userStage: true,
        interviews: true,
        emails: true,
        research: true,
        offers: true,
      },
    });

    return NextResponse.json(company, { status: 201 });
  } catch (error) {
    console.error('POST /api/companies error:', error);
    return NextResponse.json(
      { error: 'Failed to create company' },
      { status: 500 }
    );
  }
}
