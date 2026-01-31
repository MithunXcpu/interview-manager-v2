import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { z } from 'zod';

const MOCK_USER_ID = 'mock-user-id'; // Replace with Clerk auth later

// Validation schema for creating a document record
const createDocumentSchema = z.object({
  companyId: z.string().cuid().optional(),
  title: z
    .string()
    .min(1, 'Title is required')
    .max(200, 'Title must be under 200 characters'),
  type: z.string().min(1, 'Type is required'),
  format: z.string().min(1, 'Format is required'),
  content: z.string().optional(),
});

// =============================================================================
// GET /api/documents — fetch all documents for the current user
// =============================================================================

export async function GET() {
  try {
    const documents = await db.document.findMany({
      where: { userId: MOCK_USER_ID },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(documents);
  } catch (error) {
    console.error('GET /api/documents error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch documents' },
      { status: 500 }
    );
  }
}

// =============================================================================
// POST /api/documents — create a document record
// =============================================================================

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = createDocumentSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const data = parsed.data;

    // If companyId is provided, verify ownership
    if (data.companyId) {
      const company = await db.company.findFirst({
        where: { id: data.companyId, userId: MOCK_USER_ID },
      });

      if (!company) {
        return NextResponse.json(
          { error: 'Company not found' },
          { status: 404 }
        );
      }
    }

    const document = await db.document.create({
      data: {
        userId: MOCK_USER_ID,
        companyId: data.companyId ?? null,
        title: data.title,
        type: data.type,
        format: data.format,
        content: data.content ?? null,
        fileUrl: null,
      },
    });

    return NextResponse.json(document, { status: 201 });
  } catch (error) {
    console.error('POST /api/documents error:', error);
    return NextResponse.json(
      { error: 'Failed to create document' },
      { status: 500 }
    );
  }
}
