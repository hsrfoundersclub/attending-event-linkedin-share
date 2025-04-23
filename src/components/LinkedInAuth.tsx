import { useEffect, useState } from "react";
import { Button } from "./ui/button";

interface LinkedInAuthProps {
  onAuthChange: (isAuthenticated: boolean, profile: any) => void;
}

export function LinkedInAuth({ onAuthChange }: LinkedInAuthProps) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const accessToken = localStorage.getItem("linkedin_access_token");
      if (accessToken) {
        try {
          const response = await fetch("/api/linkedin/profile", {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });

          if (response.ok) {
            const profileData = await response.json();
            onAuthChange(true, profileData);
          } else {
            // Token might be expired, clear it
            localStorage.removeItem("linkedin_access_token");
            onAuthChange(false, null);
          }
        } catch (error) {
          console.error("Error fetching profile:", error);
          localStorage.removeItem("linkedin_access_token");
          onAuthChange(false, null);
        }
      } else {
        onAuthChange(false, null);
      }
      setIsLoading(false);
    };

    checkAuth();
  }, [onAuthChange]);

  const handleLogin = () => {
    const clientId = process.env.NEXT_PUBLIC_LINKEDIN_CLIENT_ID;
    const redirectUri = `${window.location.origin}/linkedin-callback`;
    const scope = "openid profile w_member_social email";
    const state = Math.random().toString(36).substring(7);

    // Store state in localStorage to verify later
    localStorage.setItem("linkedin_auth_state", state);

    const authUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&state=${state}`;
    window.location.href = authUrl;
  };

  const handleLogout = () => {
    localStorage.removeItem("linkedin_access_token");
    localStorage.removeItem("linkedin_auth_state");
    onAuthChange(false, null);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Button
        onClick={handleLogout}
        className="bg-red-500 hover:bg-red-600 text-white"
      >
        Logout from LinkedIn
      </Button>
    </div>
  );
}
