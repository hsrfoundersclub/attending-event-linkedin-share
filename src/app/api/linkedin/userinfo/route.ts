import { NextResponse } from "next/server";
import { LINKEDIN_CONFIG } from "@/lib/linkedin";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const accessToken = searchParams.get("access_token");

    if (!accessToken) {
      return NextResponse.json(
        { error: "No access token provided" },
        { status: 401 }
      );
    }

    const response = await fetch(LINKEDIN_CONFIG.userInfoUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("[LinkedIn] User info error:", error);
      return NextResponse.json(
        { error: "Failed to fetch user info" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("[LinkedIn] User info error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
