import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { userProfileSchema } from "@/lib/validators";

// ---------------------------------------------------------------------------
// API: User Settings / Profile
// ---------------------------------------------------------------------------

const MOCK_USER_ID = "mock-user-id";

// GET /api/user/settings -- fetch user profile
export async function GET() {
  try {
    const user = await db.user.findUnique({
      where: { id: MOCK_USER_ID },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        timezone: true,
        onboardingComplete: true,
        googleAccessToken: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ...user,
      hasGoogleConnected: !!user.googleAccessToken,
      googleAccessToken: undefined, // never expose token
    });
  } catch (error) {
    console.error("Failed to fetch user settings:", error);
    return NextResponse.json(
      { error: "Failed to fetch user settings" },
      { status: 500 }
    );
  }
}

// PATCH /api/user/settings -- update user profile
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const result = userProfileSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.flatten() },
        { status: 400 }
      );
    }

    const { name, phone, timezone } = result.data;

    const updatedUser = await db.user.update({
      where: { id: MOCK_USER_ID },
      data: {
        name,
        phone: phone || null,
        timezone,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        timezone: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Failed to update user settings:", error);
    return NextResponse.json(
      { error: "Failed to update user settings" },
      { status: 500 }
    );
  }
}
