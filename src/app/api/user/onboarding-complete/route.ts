import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// ---------------------------------------------------------------------------
// API: Complete onboarding
// ---------------------------------------------------------------------------

const MOCK_USER_ID = "mock-user-id";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, timezone, stages } = body;

    // Update user profile
    await db.user.update({
      where: { id: MOCK_USER_ID },
      data: {
        name: name || undefined,
        timezone: timezone || undefined,
        onboardingComplete: true,
      },
    });

    // If stages were customized, upsert user stages
    if (stages && Array.isArray(stages)) {
      for (const stage of stages) {
        await db.userStage.upsert({
          where: {
            userId_stageKey: {
              userId: MOCK_USER_ID,
              stageKey: stage.stageKey,
            },
          },
          update: {
            name: stage.name,
            emoji: stage.emoji,
            color: stage.color,
            order: stage.order,
            isEnabled: stage.isEnabled,
          },
          create: {
            userId: MOCK_USER_ID,
            stageKey: stage.stageKey,
            name: stage.name,
            emoji: stage.emoji,
            color: stage.color,
            order: stage.order,
            isEnabled: stage.isEnabled,
          },
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to complete onboarding:", error);
    return NextResponse.json(
      { error: "Failed to complete onboarding" },
      { status: 500 }
    );
  }
}
