import { NextResponse } from "next/server";
import { LINKEDIN_CONFIG } from "@/lib/linkedin";
import { cookies } from "next/headers";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");

  console.log("[LinkedIn Callback] Received state:", state);
  console.log("[LinkedIn Callback] Using config:", {
    clientId: LINKEDIN_CONFIG.clientId,
    redirectUri: LINKEDIN_CONFIG.redirectUri,
    tokenUrl: LINKEDIN_CONFIG.tokenUrl,
  });

  // Check for errors
  if (error) {
    console.error("[LinkedIn] Auth error:", error);
    return NextResponse.redirect(new URL("/?error=auth_failed", request.url));
  }

  if (!code) {
    console.error("[LinkedIn] No authorization code received");
    return NextResponse.redirect(new URL("/?error=no_code", request.url));
  }

  if (!state) {
    console.error("[LinkedIn] No state parameter received");
    return NextResponse.redirect(new URL("/?error=no_state", request.url));
  }

  try {
    // Exchange code for access token
    const requestBody = new URLSearchParams({
      grant_type: "authorization_code",
      code: code,
      client_id: LINKEDIN_CONFIG.clientId,
      client_secret: LINKEDIN_CONFIG.clientSecret,
      redirect_uri: LINKEDIN_CONFIG.redirectUri,
    });

    console.log("[LinkedIn] Token exchange request:", {
      url: LINKEDIN_CONFIG.tokenUrl,
      body: {
        grant_type: "authorization_code",
        code: "***", // Don't log the actual code
        client_id: LINKEDIN_CONFIG.clientId,
        redirect_uri: LINKEDIN_CONFIG.redirectUri,
      },
    });

    const tokenResponse = await fetch(LINKEDIN_CONFIG.tokenUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: requestBody,
    });

    console.log("[LinkedIn] Token response status:", tokenResponse.status);

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error("[LinkedIn] Token exchange error response:", errorText);
      throw new Error(`Failed to get access token: ${errorText}`);
    }

    const tokenData = await tokenResponse.json();
    console.log("[LinkedIn] Successfully obtained access token");

    // Create a response that will set the cookies
    const response = NextResponse.redirect(new URL("/", request.url));

    // Set the tokens as secure HTTP-only cookies
    response.cookies.set("linkedin_access_token", tokenData.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: tokenData.expires_in,
    });

    if (tokenData.refresh_token) {
      response.cookies.set("linkedin_refresh_token", tokenData.refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 30, // 30 days
      });
    }

    // Set token expiry
    response.cookies.set(
      "linkedin_token_expiry",
      (Date.now() + tokenData.expires_in * 1000).toString(),
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: tokenData.expires_in,
      }
    );

    // Also store in localStorage through a script
    const script = `
      <script>
        localStorage.setItem('linkedin_access_token', '${
          tokenData.access_token
        }');
        localStorage.setItem('linkedin_token_expiry', '${
          Date.now() + tokenData.expires_in * 1000
        }');
        ${
          tokenData.refresh_token
            ? `localStorage.setItem('linkedin_refresh_token', '${tokenData.refresh_token}');`
            : ""
        }
        window.location.href = '/';
      </script>
    `;

    return new Response(script, {
      headers: {
        "Content-Type": "text/html",
      },
    });
  } catch (error) {
    console.error("[LinkedIn] Token exchange error:", error);
    return NextResponse.redirect(
      new URL("/?error=token_exchange_failed", request.url)
    );
  }
}
