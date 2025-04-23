import { useState, useEffect } from "react";

import { toast } from "sonner";
import { toPng } from "html-to-image";
import { Button } from "./ui/button";
import { LinkedInAuth } from "./LinkedInAuth";

interface LinkedInShareButtonProps {
  text: string;
  imageRef: React.RefObject<HTMLDivElement | null>;
}

export function LinkedInShareButton({
  text,
  imageRef,
}: LinkedInShareButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);

  // Check authentication status only once on mount
  useEffect(() => {
    const checkAuth = async () => {
      const accessToken = localStorage.getItem("linkedin_access_token");
      const storedProfile = localStorage.getItem("linkedin_profile");

      if (storedProfile) {
        setUserProfile(JSON.parse(storedProfile));
        setIsAuthenticated(true);
        return;
      }

      if (accessToken) {
        try {
          const response = await fetch("/api/linkedin/profile", {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });

          if (response.ok) {
            const profileData = await response.json();
            localStorage.setItem(
              "linkedin_profile",
              JSON.stringify(profileData)
            );
            setUserProfile(profileData);
            setIsAuthenticated(true);
          } else {
            localStorage.removeItem("linkedin_access_token");
            localStorage.removeItem("linkedin_profile");
            setIsAuthenticated(false);
          }
        } catch (error) {
          console.error("Error checking auth:", error);
          localStorage.removeItem("linkedin_access_token");
          localStorage.removeItem("linkedin_profile");
          setIsAuthenticated(false);
        }
      }
    };

    checkAuth();
  }, []);

  const handleAuthChange = (authenticated: boolean, profile: any) => {
    setIsAuthenticated(authenticated);
    setUserProfile(profile);
    if (profile) {
      localStorage.setItem("linkedin_profile", JSON.stringify(profile));
    } else {
      localStorage.removeItem("linkedin_profile");
    }
  };

  const handleLogin = () => {
    const clientId = process.env.NEXT_PUBLIC_LINKEDIN_CLIENT_ID;
    const redirectUri = `${window.location.origin}/linkedin-callback`;
    const scope = "openid profile w_member_social email";
    const state = Math.random().toString(36).substring(7);

    // Store the current form state in localStorage
    localStorage.setItem("linkedin_auth_state", state);
    localStorage.setItem("form_text", text);
    if (imageRef.current) {
      toPng(imageRef.current, {
        quality: 1.0,
        pixelRatio: 2,
        cacheBust: true,
      }).then((dataUrl) => {
        localStorage.setItem("form_image", dataUrl);
        // Now redirect to LinkedIn
        window.location.href = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&state=${state}`;
      });
    } else {
      window.location.href = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&state=${state}`;
    }
  };

  const handleShare = async () => {
    try {
      setIsLoading(true);

      if (!imageRef.current) {
        throw new Error("Image reference is not available");
      }

      const accessToken = localStorage.getItem("linkedin_access_token");
      if (!accessToken || !userProfile) {
        throw new Error("Not authenticated with LinkedIn");
      }

      // Convert the preview to an image
      const imageUrl = await toPng(imageRef.current, {
        quality: 1.0,
        pixelRatio: 2,
        cacheBust: true,
      });

      // First, register the upload
      const registerUploadResponse = await fetch(
        "https://api.linkedin.com/v2/assets?action=registerUpload",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
            "X-Restli-Protocol-Version": "2.0.0",
          },
          body: JSON.stringify({
            registerUploadRequest: {
              owner: `urn:li:person:${userProfile.sub}`,
              recipes: ["urn:li:digitalmediaRecipe:feedshare-image"],
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

      if (!registerUploadResponse.ok) {
        const errorData = await registerUploadResponse.json();
        console.error("Register upload error:", errorData);
        throw new Error("Failed to register upload");
      }

      const uploadData = await registerUploadResponse.json();
      const uploadUrl =
        uploadData.value.uploadMechanism[
          "com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest"
        ].uploadUrl;
      const asset = uploadData.value.asset;

      // Upload the image
      const uploadResponse = await fetch(uploadUrl, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "image/jpeg",
        },
        body: await fetch(imageUrl).then((res) => res.blob()),
      });

      if (!uploadResponse.ok) {
        throw new Error("Failed to upload image");
      }

      // Create the post
      const postResponse = await fetch("https://api.linkedin.com/v2/ugcPosts", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
          "X-Restli-Protocol-Version": "2.0.0",
        },
        body: JSON.stringify({
          author: `urn:li:person:${userProfile.sub}`,
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
                    text: text,
                  },
                  media: asset,
                  title: {
                    text: "Shared Image",
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

      if (!postResponse.ok) {
        const errorData = await postResponse.json();
        console.error("Post creation error:", errorData);
        throw new Error("Failed to create post");
      }

      toast.success("Successfully shared to LinkedIn!");
    } catch (error) {
      console.error("Error sharing to LinkedIn:", error);
      toast.error("Failed to share to LinkedIn");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      {isAuthenticated ? (
        <>
          <div className="text-sm text-gray-600">
            Logged in as: {userProfile?.given_name} {userProfile?.family_name}
          </div>
          <LinkedInAuth onAuthChange={handleAuthChange} />
          <Button
            onClick={handleShare}
            disabled={isLoading}
            className="bg-[#0077B5] hover:bg-[#005E93] text-white"
          >
            {isLoading ? "Sharing..." : "Share on LinkedIn"}
          </Button>
        </>
      ) : (
        <Button
          onClick={handleLogin}
          className="bg-[#0077B5] hover:bg-[#005E93] text-white"
        >
          Login with LinkedIn
        </Button>
      )}
    </div>
  );
}
