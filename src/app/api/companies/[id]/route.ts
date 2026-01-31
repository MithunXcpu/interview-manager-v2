import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { updateCompanySchema } from '@/lib/validators';

const MOCK_USER_ID = 'mock-user-id'; // Replace with Clerk auth later

// =============================================================================
// GET /api/companies/[id] — fetch a single company with all relations
// =============================================================================

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const company = await db.company.findFirst({
      where: { id, userId: MOCK_USER_ID },
      include: {
        userStage: true,
        interviews: {
          orderBy: { scheduledAt: 'asc' },
        },
        emails: {
          orderBy: { receivedAt: 'desc' },
        },
        research: true,
        interviewPreps: true,
        offers: true,
      },
    });

    if (!company) {
      return NextResponse.json(
        { error: 'Company not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(company);
  } catch (error) {
    console.error('GET /api/companies/[id] error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch company' },
      { status: 500 }
    );
  }
}

// =============================================================================
// PATCH /api/companies/[id] — update a company
// =============================================================================

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const parsed = updateCompanySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    // Verify ownership
    const existing = await db.company.findFirst({
      where: { id, userId: MOCK_USER_ID },
    });

    if (!existing) {
      return NextResponse.json(
        { error: 'Company not found' },
        { status: 404 }
      );
    }

    const data = parsed.data;

    const company = await db.company.update({
      where: { id },
      data: {
        ...(data.name !== undefined && { name: data.name }),
        ...(data.jobTitle !== undefined && { jobTitle: data.jobTitle ?? null }),
        ...(data.website !== undefined && { website: data.website || null }),
        ...(data.location !== undefined && { location: data.location ?? null }),
        ...(data.salaryMin !== undefined && { salaryMin: data.salaryMin ?? null }),
        ...(data.salaryMax !== undefined && { salaryMax: data.salaryMax ?? null }),
        ...(data.priority !== undefined && { priority: data.priority }),
        ...(data.recruiterName !== undefined && { recruiterName: data.recruiterName ?? null }),
        ...(data.recruiterEmail !== undefined && { recruiterEmail: data.recruiterEmail || null }),
        ...(data.notes !== undefined && { notes: data.notes ?? null }),
        ...(data.jobUrl !== undefined && { jobUrl: data.jobUrl || null }),
        ...(data.appliedDate !== undefined && { appliedDate: data.appliedDate ?? null }),
        ...(data.userStageId !== undefined && { userStageId: data.userStageId ?? null }),
        ...(data.lastActivityDate !== undefined && { lastActivityDate: data.lastActivityDate ?? null }),
      },
      include: {
        userStage: true,
        interviews: true,
        emails: true,
        research: true,
        interviewPreps: true,
        offers: true,
      },
    });

    return NextResponse.json(company);
  } catch (error) {
    console.error('PATCH /api/companies/[id] error:', error);
    return NextResponse.json(
      { error: 'Failed to update company' },
      { status: 500 }
    );
  }
}

// =============================================================================
// DELETE /api/companies/[id] — delete a company
// =============================================================================

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Verify ownership
    const existing = await db.company.findFirst({
      where: { id, userId: MOCK_USER_ID },
    });

    if (!existing) {
      return NextResponse.json(
        { error: 'Company not found' },
        { status: 404 }
      );
    }

    await db.company.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/companies/[id] error:', error);
    return NextResponse.json(
      { error: 'Failed to delete company' },
      { status: 500 }
    );
  }
}
