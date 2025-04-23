import { NextResponse } from "next/server";
import { LINKEDIN_CONFIG } from "@/lib/linkedin";

export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const accessToken = searchParams.get("access_token");
    const { author, text, asset } = await request.json();

    if (!accessToken) {
      return NextResponse.json(
        { error: "No access token provided" },
        { status: 401 }
      );
    }

    if (!author || !text || !asset) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    // Create the UGC post with image following the share-logic.md guidelines
    const response = await fetch(`${LINKEDIN_CONFIG.apiUrl}/ugcPosts`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        "X-Restli-Protocol-Version": "2.0.0",
      },
      body: JSON.stringify({
        author: "urn:li:person:" + author,
        lifecycleState: "PUBLISHED",
        specificContent: {
          "com.linkedin.ugc.ShareContent": {
            shareCommentary: {
              text: text,
            },
            shareMediaCategory: "IMAGE",
            media: [
              {
                status: "READY",
                description: {
                  text: "The AfterParty 2025",
                },
                media: asset,
                title: {
                  text: "HSR Founders Club Event",
                },
              },
            ],
          },
        },
        visibility: {
          "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC",
        },
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("[LinkedIn] Create post error:", error);
      return NextResponse.json(
        { error: "Failed to create post" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("[LinkedIn] Create post error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
