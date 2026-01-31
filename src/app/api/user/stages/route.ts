import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

const MOCK_USER_ID = "mock-user-id";

// GET /api/user/stages -- fetch user's pipeline stages
export async function GET() {
  try {
    const stages = await db.userStage.findMany({
      where: { userId: MOCK_USER_ID },
      orderBy: { order: "asc" },
    });

    return NextResponse.json(stages);
  } catch (error) {
    console.error("Failed to fetch stages:", error);
    return NextResponse.json(
      { error: "Failed to fetch stages" },
      { status: 500 }
    );
  }
}

// PUT /api/user/stages -- batch update all stages
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const stages = body.stages as Array<{
      stageKey: string;
      name: string;
      emoji: string;
      color: string;
      order: number;
      isEnabled: boolean;
    }>;

    if (!Array.isArray(stages)) {
      return NextResponse.json(
        { error: "stages must be an array" },
        { status: 400 }
      );
    }

    // Delete existing and recreate (transactional)
    const result = await db.$transaction(async (tx) => {
      await tx.userStage.deleteMany({
        where: { userId: MOCK_USER_ID },
      });

      const created = await Promise.all(
        stages.map((stage) =>
          tx.userStage.create({
            data: {
              userId: MOCK_USER_ID,
              stageKey: stage.stageKey,
              name: stage.name,
              emoji: stage.emoji,
              color: stage.color,
              order: stage.order,
              isEnabled: stage.isEnabled,
            },
          })
        )
      );

      return created;
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Failed to update stages:", error);
    return NextResponse.json(
      { error: "Failed to update stages" },
      { status: 500 }
    );
  }
}
