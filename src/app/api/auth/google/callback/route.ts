import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";
import { db } from "@/lib/db";

const MOCK_USER_ID = "mock-user-id";

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/google/callback`
);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");
    const error = searchParams.get("error");
    const stateParam = searchParams.get("state");

    let redirectTo = "/settings";
    if (stateParam) {
      try {
        const state = JSON.parse(
          Buffer.from(stateParam, "base64").toString()
        );
        redirectTo = state.redirectTo || "/settings";
      } catch {
        // Fallback to settings
      }
    }

    if (error) {
      console.error("Google OAuth error:", error);
      return NextResponse.redirect(
        new URL(`${redirectTo}?error=google_auth_failed`, request.url)
      );
    }

    if (!code) {
      return NextResponse.redirect(
        new URL(`${redirectTo}?error=no_code`, request.url)
      );
    }

    const { tokens } = await oauth2Client.getToken(code);

    await db.user.update({
      where: { id: MOCK_USER_ID },
      data: {
        googleAccessToken: tokens.access_token,
        googleRefreshToken: tokens.refresh_token,
        googleTokenExpiry: tokens.expiry_date
          ? new Date(tokens.expiry_date)
          : null,
      },
    });

    return NextResponse.redirect(
      new URL(`${redirectTo}?success=google_connected`, request.url)
    );
  } catch (error) {
    console.error("Google OAuth callback error:", error);
    return NextResponse.redirect(
      new URL("/settings?error=google_auth_failed", request.url)
    );
  }
}
