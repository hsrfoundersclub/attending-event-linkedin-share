export const LINKEDIN_CONFIG = {
  clientId: process.env.NEXT_PUBLIC_LINKEDIN_CLIENT_ID || "",
  clientSecret: process.env.LINKEDIN_CLIENT_SECRET || "",
  redirectUri: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/linkedin/callback`,
  scope: "openid profile email w_member_social", // Required scopes for Share on LinkedIn and Sign In
  authUrl: "https://www.linkedin.com/oauth/v2/authorization",
  tokenUrl: "https://www.linkedin.com/oauth/v2/accessToken",
  apiUrl: "https://api.linkedin.com/v2", // Latest API version
  userInfoUrl: "https://api.linkedin.com/v2/userinfo", // OpenID Connect endpoint
};

export function getLinkedInAuthUrl(state: string): string {
  const params = new URLSearchParams({
    response_type: "code",
    client_id: LINKEDIN_CONFIG.clientId,
    redirect_uri: LINKEDIN_CONFIG.redirectUri,
    scope: LINKEDIN_CONFIG.scope,
    state,
  });

  return `${LINKEDIN_CONFIG.authUrl}?${params.toString()}`;
}
