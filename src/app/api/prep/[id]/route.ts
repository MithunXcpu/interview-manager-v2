import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

const MOCK_USER_ID = 'mock-user-id';

// =============================================================================
// GET /api/prep/[id] -- fetch a single prep
// =============================================================================

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const prep = await db.interviewPrep.findFirst({
      where: {
        id,
        company: { userId: MOCK_USER_ID },
      },
      include: {
        company: true,
      },
    });

    if (!prep) {
      return NextResponse.json(
        { error: 'Interview prep not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(prep);
  } catch (error) {
    console.error('GET /api/prep/[id] error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch interview prep' },
      { status: 500 }
    );
  }
}

// =============================================================================
// PATCH /api/prep/[id] -- update a prep
// =============================================================================

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Verify ownership
    const existing = await db.interviewPrep.findFirst({
      where: {
        id,
        company: { userId: MOCK_USER_ID },
      },
    });

    if (!existing) {
      return NextResponse.json(
        { error: 'Interview prep not found' },
        { status: 404 }
      );
    }

    const prep = await db.interviewPrep.update({
      where: { id },
      data: {
        ...(body.type !== undefined && { type: body.type }),
        ...(body.title !== undefined && { title: body.title }),
        ...(body.content !== undefined && { content: body.content }),
      },
      include: {
        company: true,
      },
    });

    return NextResponse.json(prep);
  } catch (error) {
    console.error('PATCH /api/prep/[id] error:', error);
    return NextResponse.json(
      { error: 'Failed to update interview prep' },
      { status: 500 }
    );
  }
}

// =============================================================================
// DELETE /api/prep/[id] -- delete a prep
// =============================================================================

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Verify ownership
    const existing = await db.interviewPrep.findFirst({
      where: {
        id,
        company: { userId: MOCK_USER_ID },
      },
    });

    if (!existing) {
      return NextResponse.json(
        { error: 'Interview prep not found' },
        { status: 404 }
      );
    }

    await db.interviewPrep.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/prep/[id] error:', error);
    return NextResponse.json(
      { error: 'Failed to delete interview prep' },
      { status: 500 }
    );
  }
}
