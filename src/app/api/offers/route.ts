import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { Prisma } from '@/generated/prisma/client';
import { createOfferSchema } from '@/lib/validators';

const MOCK_USER_ID = 'mock-user-id'; // Replace with Clerk auth later

// =============================================================================
// GET /api/offers — fetch all offers for the current user with company data
// =============================================================================

export async function GET() {
  try {
    const offers = await db.offer.findMany({
      where: {
        company: {
          userId: MOCK_USER_ID,
        },
      },
      include: {
        company: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(offers);
  } catch (error) {
    console.error('GET /api/offers error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch offers' },
      { status: 500 }
    );
  }
}

// =============================================================================
// POST /api/offers — create a new offer
// =============================================================================

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = createOfferSchema.safeParse(body);

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

    const offer = await db.offer.create({
      data: {
        companyId: data.companyId,
        baseSalary: data.baseSalary ?? null,
        equity: data.equity ?? null,
        equityValue: data.equityValue ?? null,
        signingBonus: data.signingBonus ?? null,
        annualBonus: data.annualBonus ?? null,
        bonusTarget: data.bonusTarget ?? null,
        benefits: data.benefits
          ? (data.benefits as Prisma.InputJsonValue)
          : Prisma.DbNull,
        startDate: data.startDate ?? null,
        deadline: data.deadline ?? null,
        status: data.status ?? 'PENDING',
        notes: data.notes ?? null,
        negotiationNotes: data.negotiationNotes ?? null,
      },
      include: {
        company: true,
      },
    });

    return NextResponse.json(offer, { status: 201 });
  } catch (error) {
    console.error('POST /api/offers error:', error);
    return NextResponse.json(
      { error: 'Failed to create offer' },
      { status: 500 }
    );
  }
}
