import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const accessToken = searchParams.get("access_token");
    const { uploadUrl, imageData } = await request.json();

    if (!accessToken) {
      return NextResponse.json(
        { error: "No access token provided" },
        { status: 401 }
      );
    }

    if (!uploadUrl || !imageData) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    // Convert base64 to binary data
    const base64Data = imageData.split(",")[1];
    const binaryData = Buffer.from(base64Data, "base64");

    // Following the share-logic.md guidelines for uploading an image
    // Send a POST request to the uploadUrl with the image as binary data
    const response = await fetch(uploadUrl, {
      method: "POST", // Changed from PUT to POST as per documentation
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: binaryData, // Send the binary data directly
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("[LinkedIn] Upload error:", error);
      return NextResponse.json(
        { error: "Failed to upload image" },
        { status: response.status }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[LinkedIn] Upload error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
