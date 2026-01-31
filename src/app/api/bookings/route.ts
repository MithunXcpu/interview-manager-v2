import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

const MOCK_USER_ID = "mock-user-id";

// GET /api/bookings - list user's booking links
export async function GET() {
  try {
    const bookingLinks = await db.bookingLink.findMany({
      where: { userId: MOCK_USER_ID },
    });

    return NextResponse.json(bookingLinks);
  } catch (error) {
    console.error("Failed to fetch booking links:", error);
    return NextResponse.json(
      { error: "Failed to fetch booking links" },
      { status: 500 }
    );
  }
}

// POST /api/bookings - create a new booking link
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { slug, title, description, duration, meetingType } = body;

    if (!slug) {
      return NextResponse.json(
        { error: "Slug is required" },
        { status: 400 }
      );
    }

    const existing = await db.bookingLink.findUnique({
      where: { slug },
    });

    if (existing) {
      return NextResponse.json(
        { error: "This URL slug is already taken" },
        { status: 409 }
      );
    }

    const bookingLink = await db.bookingLink.create({
      data: {
        userId: MOCK_USER_ID,
        slug,
        title: title || "Quick Chat",
        description: description || null,
        duration: duration || 30,
        meetingType: meetingType || "GOOGLE_MEET",
      },
    });

    return NextResponse.json(bookingLink, { status: 201 });
  } catch (error) {
    console.error("Failed to create booking link:", error);
    return NextResponse.json(
      { error: "Failed to create booking link" },
      { status: 500 }
    );
  }
}

// PATCH /api/bookings - update a booking link
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Booking link ID is required" },
        { status: 400 }
      );
    }

    const bookingLink = await db.bookingLink.update({
      where: { id, userId: MOCK_USER_ID },
      data: updates,
    });

    return NextResponse.json(bookingLink);
  } catch (error) {
    console.error("Failed to update booking link:", error);
    return NextResponse.json(
      { error: "Failed to update booking link" },
      { status: 500 }
    );
  }
}
