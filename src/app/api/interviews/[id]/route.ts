import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { interviewTypeSchema, interviewStatusSchema, meetingTypeSchema } from '@/lib/validators';
import { z } from 'zod';

const MOCK_USER_ID = 'mock-user-id';

// =============================================================================
// GET /api/interviews/[id] — fetch a single interview
// =============================================================================

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const interview = await db.interview.findFirst({
      where: {
        id,
        company: { userId: MOCK_USER_ID },
      },
      include: { company: true },
    });

    if (!interview) {
      return NextResponse.json(
        { error: 'Interview not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(interview);
  } catch (error) {
    console.error('GET /api/interviews/[id] error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch interview' },
      { status: 500 }
    );
  }
}

// =============================================================================
// PATCH /api/interviews/[id] — update an interview
// =============================================================================

const updateInterviewSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  scheduledAt: z.coerce.date().optional(),
  duration: z.number().int().min(15).max(480).optional(),
  type: interviewTypeSchema.optional(),
  status: interviewStatusSchema.optional(),
  meetingType: meetingTypeSchema.optional().nullable(),
  meetingLink: z.string().url().optional().nullable().or(z.literal('')),
  location: z.string().max(500).optional().nullable(),
  interviewerName: z.string().max(200).optional().nullable(),
  interviewerRole: z.string().max(200).optional().nullable(),
  interviewerLinkedIn: z.string().url().optional().nullable().or(z.literal('')),
  notes: z.string().max(5000).optional().nullable(),
  feedback: z.string().max(5000).optional().nullable(),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const parsed = updateInterviewSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    // Verify the interview belongs to user
    const existing = await db.interview.findFirst({
      where: {
        id,
        company: { userId: MOCK_USER_ID },
      },
    });

    if (!existing) {
      return NextResponse.json(
        { error: 'Interview not found' },
        { status: 404 }
      );
    }

    const interview = await db.interview.update({
      where: { id },
      data: parsed.data,
      include: { company: true },
    });

    // Update the company's lastActivityDate
    await db.company.update({
      where: { id: existing.companyId },
      data: { lastActivityDate: new Date() },
    });

    return NextResponse.json(interview);
  } catch (error) {
    console.error('PATCH /api/interviews/[id] error:', error);
    return NextResponse.json(
      { error: 'Failed to update interview' },
      { status: 500 }
    );
  }
}

// =============================================================================
// DELETE /api/interviews/[id] — delete an interview
// =============================================================================

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Verify the interview belongs to user
    const existing = await db.interview.findFirst({
      where: {
        id,
        company: { userId: MOCK_USER_ID },
      },
    });

    if (!existing) {
      return NextResponse.json(
        { error: 'Interview not found' },
        { status: 404 }
      );
    }

    await db.interview.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/interviews/[id] error:', error);
    return NextResponse.json(
      { error: 'Failed to delete interview' },
      { status: 500 }
    );
  }
}
