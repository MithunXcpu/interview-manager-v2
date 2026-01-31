import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { Prisma } from '@/generated/prisma/client';
import { offerStatusSchema } from '@/lib/validators';
import { z } from 'zod';

const MOCK_USER_ID = 'mock-user-id'; // Replace with Clerk auth later

// Partial update schema for PATCH
const updateOfferSchema = z.object({
  baseSalary: z.number().nonnegative().optional(),
  equity: z.string().max(200).optional(),
  equityValue: z.number().nonnegative().optional(),
  signingBonus: z.number().nonnegative().optional(),
  annualBonus: z.number().nonnegative().optional(),
  bonusTarget: z.string().max(200).optional(),
  benefits: z.record(z.string(), z.unknown()).optional(),
  startDate: z.coerce.date().optional(),
  deadline: z.coerce.date().optional(),
  status: offerStatusSchema.optional(),
  notes: z.string().max(5000).optional(),
  negotiationNotes: z.string().max(5000).optional(),
});

// =============================================================================
// PATCH /api/offers/[id] — update an offer
// =============================================================================

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const parsed = updateOfferSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    // Verify ownership through company relation
    const existing = await db.offer.findFirst({
      where: {
        id,
        company: { userId: MOCK_USER_ID },
      },
    });

    if (!existing) {
      return NextResponse.json(
        { error: 'Offer not found' },
        { status: 404 }
      );
    }

    const data = parsed.data;

    const offer = await db.offer.update({
      where: { id },
      data: {
        ...(data.baseSalary !== undefined && { baseSalary: data.baseSalary }),
        ...(data.equity !== undefined && { equity: data.equity }),
        ...(data.equityValue !== undefined && { equityValue: data.equityValue }),
        ...(data.signingBonus !== undefined && { signingBonus: data.signingBonus }),
        ...(data.annualBonus !== undefined && { annualBonus: data.annualBonus }),
        ...(data.bonusTarget !== undefined && { bonusTarget: data.bonusTarget }),
        ...(data.benefits !== undefined && {
          benefits: data.benefits
            ? (data.benefits as Prisma.InputJsonValue)
            : Prisma.DbNull,
        }),
        ...(data.startDate !== undefined && { startDate: data.startDate }),
        ...(data.deadline !== undefined && { deadline: data.deadline }),
        ...(data.status !== undefined && { status: data.status }),
        ...(data.notes !== undefined && { notes: data.notes }),
        ...(data.negotiationNotes !== undefined && { negotiationNotes: data.negotiationNotes }),
      },
      include: {
        company: true,
      },
    });

    return NextResponse.json(offer);
  } catch (error) {
    console.error('PATCH /api/offers/[id] error:', error);
    return NextResponse.json(
      { error: 'Failed to update offer' },
      { status: 500 }
    );
  }
}

// =============================================================================
// DELETE /api/offers/[id] — delete an offer
// =============================================================================

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Verify ownership through company relation
    const existing = await db.offer.findFirst({
      where: {
        id,
        company: { userId: MOCK_USER_ID },
      },
    });

    if (!existing) {
      return NextResponse.json(
        { error: 'Offer not found' },
        { status: 404 }
      );
    }

    await db.offer.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/offers/[id] error:', error);
    return NextResponse.json(
      { error: 'Failed to delete offer' },
      { status: 500 }
    );
  }
}
