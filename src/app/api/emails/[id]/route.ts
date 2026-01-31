import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/emails/[id] — single email with full body
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const email = await db.email.findUnique({
      where: { id },
      include: {
        company: true,
      },
    });

    if (!email) {
      return NextResponse.json(
        { error: 'Email not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(email);
  } catch (error) {
    console.error('Failed to fetch email:', error);
    return NextResponse.json(
      { error: 'Failed to fetch email' },
      { status: 500 }
    );
  }
}

// PATCH /api/emails/[id] — update email (isRead, companyId, etc.)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const email = await db.email.update({
      where: { id },
      data: body,
      include: {
        company: true,
      },
    });

    return NextResponse.json(email);
  } catch (error) {
    console.error('Failed to update email:', error);
    return NextResponse.json(
      { error: 'Failed to update email' },
      { status: 500 }
    );
  }
}
