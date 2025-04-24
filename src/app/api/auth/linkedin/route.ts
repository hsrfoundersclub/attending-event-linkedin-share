import { NextResponse } from "next/server";
import { LINKEDIN_CONFIG, getLinkedInAuthUrl } from "@/lib/linkedin";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const state =
      searchParams.get("state") || Math.random().toString(36).substring(7);

    console.log("[LinkedIn Auth] Starting auth process with state:", state);

    const authUrl = getLinkedInAuthUrl(state);
    console.log("[LinkedIn Auth] Redirecting to:", authUrl);

    return NextResponse.redirect(authUrl);
  } catch (error) {
    console.error("[LinkedIn Auth] Error:", error);
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/?error=auth_failed`
    );
  }
}
