import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

const MOCK_USER_ID = "mock-user-id";

// GET /api/availability - fetch user's availability slots
export async function GET() {
  try {
    const slots = await db.availabilitySlot.findMany({
      where: { userId: MOCK_USER_ID },
      orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
    });

    return NextResponse.json(slots);
  } catch (error) {
    console.error("Failed to fetch availability:", error);
    return NextResponse.json(
      { error: "Failed to fetch availability" },
      { status: 500 }
    );
  }
}

// POST /api/availability - bulk upsert availability slots
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const slots = body.slots as Array<{
      dayOfWeek: number;
      startTime: string;
      endTime: string;
      isActive?: boolean;
      timezone?: string;
    }>;

    if (!Array.isArray(slots)) {
      return NextResponse.json(
        { error: "slots must be an array" },
        { status: 400 }
      );
    }

    // Delete existing and recreate
    const result = await db.$transaction(async (tx) => {
      await tx.availabilitySlot.deleteMany({
        where: { userId: MOCK_USER_ID },
      });

      const created = await Promise.all(
        slots.map((slot) =>
          tx.availabilitySlot.create({
            data: {
              userId: MOCK_USER_ID,
              dayOfWeek: slot.dayOfWeek,
              startTime: slot.startTime,
              endTime: slot.endTime,
              isActive: slot.isActive ?? true,
              timezone: slot.timezone ?? "America/Los_Angeles",
            },
          })
        )
      );

      return created;
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Failed to update availability:", error);
    return NextResponse.json(
      { error: "Failed to update availability" },
      { status: 500 }
    );
  }
}
