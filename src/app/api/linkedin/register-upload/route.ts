import { NextResponse } from "next/server";
import { LINKEDIN_CONFIG } from "@/lib/linkedin";

export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const accessToken = searchParams.get("access_token");
    const { owner } = await request.json();

    if (!accessToken) {
      return NextResponse.json(
        { error: "No access token provided" },
        { status: 401 }
      );
    }

    if (!owner) {
      return NextResponse.json({ error: "No owner provided" }, { status: 400 });
    }

    // Following the share-logic.md guidelines for registering an image upload
    const response = await fetch(
      `${LINKEDIN_CONFIG.apiUrl}/assets?action=registerUpload`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
          "X-Restli-Protocol-Version": "2.0.0",
        },
        body: JSON.stringify({
          registerUploadRequest: {
            recipes: ["urn:li:digitalmediaRecipe:feedshare-image"],
            owner: "urn:li:person:" + owner,
            serviceRelationships: [
              {
                relationshipType: "OWNER",
                identifier: "urn:li:userGeneratedContent",
              },
            ],
          },
        }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error("[LinkedIn] Register upload error:", error);
      return NextResponse.json(
        { error: "Failed to register upload" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("[LinkedIn] Register upload error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
