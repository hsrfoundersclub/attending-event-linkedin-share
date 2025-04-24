"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { toPng } from "html-to-image";
import { LINKEDIN_CONFIG } from "@/lib/linkedin";
import { useRouter } from "next/navigation";

interface LinkedInShareButtonProps {
  text: string;
  imageRef: React.RefObject<HTMLDivElement>;
}

export function LinkedInShareButton({
  text,
  imageRef,
}: LinkedInShareButtonProps) {
  const router = useRouter();
  const [isSharing, setIsSharing] = useState(false);

  // Check if we're returning from LinkedIn auth
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    const state = urlParams.get("state");
    const error = urlParams.get("error");

    if (code && state) {
      // We're in the callback, let the server handle it
      return;
    }

    if (error) {
      console.error("[LinkedIn] Auth error:", error);
      // Clear any existing state
      localStorage.removeItem("linkedin_auth_state");
    }
  }, []);

  const getAccessToken = () => {
    return localStorage.getItem("linkedin_access_token");
  };

  const getRefreshToken = () => {
    return localStorage.getItem("linkedin_refresh_token");
  };

  const getTokenExpiry = () => {
    return localStorage.getItem("linkedin_token_expiry");
  };

  const checkAndRefreshToken = async () => {
    const accessToken = getAccessToken();
    const tokenExpiry = getTokenExpiry();

    if (!accessToken || !tokenExpiry) {
      return null;
    }

    // Check if token is expired or will expire in the next 5 minutes
    const expiryTime = parseInt(tokenExpiry);
    if (Date.now() >= expiryTime - 5 * 60 * 1000) {
      try {
        const refreshToken = getRefreshToken();
        if (!refreshToken) {
          return null;
        }

        const response = await fetch(
          "https://www.linkedin.com/oauth/v2/accessToken",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
              grant_type: "refresh_token",
              refresh_token: refreshToken,
              client_id: LINKEDIN_CONFIG.clientId,
              client_secret: LINKEDIN_CONFIG.clientSecret,
            }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to refresh token");
        }

        const tokenData = await response.json();

        // Store the new tokens
        localStorage.setItem("linkedin_access_token", tokenData.access_token);
        localStorage.setItem(
          "linkedin_token_expiry",
          (Date.now() + tokenData.expires_in * 1000).toString()
        );
        if (tokenData.refresh_token) {
          localStorage.setItem(
            "linkedin_refresh_token",
            tokenData.refresh_token
          );
        }

        return tokenData.access_token;
      } catch (error) {
        console.error("[LinkedIn] Token refresh error:", error);
        return null;
      }
    }

    return accessToken;
  };

  const initiateAuth = () => {
    // Generate a random state value to prevent CSRF
    const state = Math.random().toString(36).substring(7);

    // Store the state in localStorage to verify later
    localStorage.setItem("linkedin_auth_state", state);

    // Construct the authorization URL using LINKEDIN_CONFIG
    const authUrl = new URL(LINKEDIN_CONFIG.authUrl);
    authUrl.searchParams.append("response_type", "code");
    authUrl.searchParams.append("client_id", LINKEDIN_CONFIG.clientId);
    authUrl.searchParams.append("redirect_uri", LINKEDIN_CONFIG.redirectUri);
    authUrl.searchParams.append("state", state);
    authUrl.searchParams.append("scope", LINKEDIN_CONFIG.scope);

    console.log("[LinkedIn] Initiating auth with config:", {
      authUrl: LINKEDIN_CONFIG.authUrl,
      redirectUri: LINKEDIN_CONFIG.redirectUri,
      scope: LINKEDIN_CONFIG.scope,
    });

    // Redirect to LinkedIn auth page
    window.location.href = authUrl.toString();
  };

  const handleShare = async () => {
    try {
      setIsSharing(true);
      console.log("[LinkedIn] Starting share process...");

      // Check if we have an access token
      const accessToken = await checkAndRefreshToken();
      console.log("[LinkedIn] Access token found:", !!accessToken);

      if (!accessToken) {
        console.log("[LinkedIn] No access token, initiating auth flow...");
        initiateAuth();
        return;
      }

      // Get user info to get their URN
      const userInfoResponse = await fetch(
        `/api/linkedin/userinfo?access_token=${accessToken}`
      );
      if (!userInfoResponse.ok) {
        throw new Error("Failed to get user info");
      }
      const userInfo = await userInfoResponse.json();

      if (!userInfo.sub) {
        throw new Error("Failed to get user URN");
      }

      // Store userinfo in localStorage
      localStorage.setItem("linkedin_userinfo", JSON.stringify(userInfo));
      console.log("[LinkedIn] User info stored in localStorage");

      const userUrn = userInfo.sub;
      console.log("[LinkedIn] User URN:", userUrn);

      // Convert the image to PNG
      if (!imageRef.current) {
        console.error("[LinkedIn] Image reference not found");
        throw new Error("Image reference not found");
      }

      console.log("[LinkedIn] Converting image to PNG...");
      const dataUrl = await toPng(imageRef.current, {
        quality: 1.0,
        pixelRatio: 2,
        cacheBust: true, // Add cache busting for better iOS compatibility
      });
      console.log("[LinkedIn] Image converted successfully");

      // Step 1: Register the image upload
      console.log("[LinkedIn] Registering image upload...");
      const registerUploadResponse = await fetch(
        `/api/linkedin/register-upload?access_token=${accessToken}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            owner: userUrn,
          }),
        }
      );

      console.log(
        "[LinkedIn] Register upload response status:",
        registerUploadResponse.status
      );
      const registerUploadData = await registerUploadResponse.json();
      console.log("[LinkedIn] Register upload response:", registerUploadData);

      if (!registerUploadResponse.ok) {
        console.error("[LinkedIn] Register upload error:", registerUploadData);
        throw new Error("Failed to register image upload");
      }

      const { value } = registerUploadData;
      const uploadUrl =
        value.uploadMechanism[
          "com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest"
        ].uploadUrl;
      const asset = value.asset;

      console.log("[LinkedIn] Upload URL:", uploadUrl);
      console.log("[LinkedIn] Asset:", asset);

      // Step 2: Upload the image using the upload route
      console.log("[LinkedIn] Uploading image...");
      const uploadResponse = await fetch(
        `/api/linkedin/upload?access_token=${accessToken}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            uploadUrl: uploadUrl,
            imageData: dataUrl,
          }),
        }
      );

      if (!uploadResponse.ok) {
        const uploadError = await uploadResponse.json();
        console.error("[LinkedIn] Upload error:", uploadError);
        throw new Error("Failed to upload image");
      }

      console.log("[LinkedIn] Image upload status:", uploadResponse.status);

      // Step 3: Create the UGC post with image using our server-side API route
      console.log("[LinkedIn] Creating UGC post...");
      const ugcPostResponse = await fetch(
        `/api/linkedin/create-post?access_token=${accessToken}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            author: userUrn,
            text: text,
            asset: asset,
          }),
        }
      );

      console.log(
        "[LinkedIn] UGC post response status:",
        ugcPostResponse.status
      );
      const ugcPostData = await ugcPostResponse.json();
      console.log("[LinkedIn] UGC post response:", ugcPostData);

      if (!ugcPostResponse.ok) {
        console.error("[LinkedIn] UGC post error:", ugcPostData);
        throw new Error("Failed to create UGC post");
      }

      // Extract the post URL from the response
      const postId = ugcPostData.id;
      const postUrl = `https://www.linkedin.com/feed/update/${postId}/`;
      console.log("[LinkedIn] Post URL:", postUrl);

      console.log("[LinkedIn] Share successful!");
      toast.success(
        <div>
          Successfully shared on LinkedIn!
          <br />
          <a
            href={postUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="underline text-blue-500 hover:text-blue-700"
          >
            View your post
          </a>
        </div>
      );
    } catch (error) {
      console.error("[LinkedIn] Error sharing to LinkedIn:", error);
      toast.error("Failed to share on LinkedIn. Please try again.");
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <button
      onClick={handleShare}
      disabled={isSharing}
      className={`px-4 py-2 bg-[#0077b5] text-white rounded-md transition-colors duration-200 flex items-center justify-center space-x-2 ${
        isSharing
          ? "opacity-50 cursor-not-allowed"
          : "hover:bg-[#005e93] cursor-pointer"
      }`}
    >
      {isSharing ? (
        <>
          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span>Sharing...</span>
        </>
      ) : (
        <>
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z" />
          </svg>
          <span>Share</span>
        </>
      )}
    </button>
  );
}
