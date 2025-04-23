"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LinkedInCallback() {
  const router = useRouter();

  useEffect(() => {
    const handleCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get("code");
      const state = urlParams.get("state");
      const storedState = localStorage.getItem("linkedin_auth_state");

      if (!code || !state || state !== storedState) {
        console.error("Invalid state or missing code");
        router.push("/");
        return;
      }

      try {
        const response = await fetch("/api/linkedin/token", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ code }),
        });

        if (!response.ok) {
          throw new Error("Failed to get access token");
        }

        const data = await response.json();
        localStorage.setItem("linkedin_access_token", data.access_token);

        // Clear the stored data
        localStorage.removeItem("form_text");
        localStorage.removeItem("form_image");
        localStorage.removeItem("linkedin_auth_state");

        // Redirect back to the home page
        router.push("/");
      } catch (error) {
        console.error("Error getting access token:", error);
        router.push("/");
      }
    };

    handleCallback();
  }, [router]);

  return <div>Processing LinkedIn authentication...</div>;
}
