import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { wellnessCheckInSchema } from '@/lib/validators';

const MOCK_USER_ID = 'mock-user-id'; // Replace with Clerk auth later

// =============================================================================
// GET /api/wellness — fetch all check-ins for the current user
// =============================================================================

export async function GET() {
  try {
    const checkIns = await db.wellnessCheckIn.findMany({
      where: { userId: MOCK_USER_ID },
      orderBy: { date: 'desc' },
    });

    return NextResponse.json(checkIns);
  } catch (error) {
    console.error('GET /api/wellness error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch wellness check-ins' },
      { status: 500 }
    );
  }
}

// =============================================================================
// POST /api/wellness — create a new wellness check-in
// =============================================================================

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = wellnessCheckInSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const data = parsed.data;

    const checkIn = await db.wellnessCheckIn.create({
      data: {
        userId: MOCK_USER_ID,
        mood: data.mood,
        energy: data.energy,
        notes: data.notes ?? null,
        date: data.date,
      },
    });

    return NextResponse.json(checkIn, { status: 201 });
  } catch (error) {
    console.error('POST /api/wellness error:', error);
    return NextResponse.json(
      { error: 'Failed to create wellness check-in' },
      { status: 500 }
    );
  }
}
