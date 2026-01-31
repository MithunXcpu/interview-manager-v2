import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { z } from 'zod';

const MOCK_USER_ID = 'mock-user-id'; // Replace with Clerk auth later

const moveStageSchema = z.object({
  userStageId: z.string().min(1, 'Stage ID is required'),
});

// =============================================================================
// PATCH /api/companies/[id]/stage — move company to a different pipeline stage
// =============================================================================

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const parsed = moveStageSchema.safeParse(body);

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

    const company = await db.company.update({
      where: { id },
      data: {
        userStageId: parsed.data.userStageId,
        lastActivityDate: new Date(),
      },
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
    });

    return NextResponse.json(company);
  } catch (error) {
    console.error('PATCH /api/companies/[id]/stage error:', error);
    return NextResponse.json(
      { error: 'Failed to update company stage' },
      { status: 500 }
    );
  }
}
