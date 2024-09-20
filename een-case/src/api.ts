interface OAuthTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
}

// const API_URL = "https://rest.cameramanager.com";
const CLIENT_ID = process.env.VUE_APP_API_KEY;
const CLIENT_SECRET = process.env.VUE_APP_API_SECRET;

export const getAuthorizationUrl = (redirectUri: string): string => {
  if (!CLIENT_ID) {
    throw new Error("CLIENT_ID is not defined");
  }
  const authUrl = "https://rest.cameramanager.com/oauth/authorize";
  const params = new URLSearchParams({
    scope: "write",
    client_id: CLIENT_ID,
    response_type: "code",
    redirect_uri: redirectUri,
  });
  return `${authUrl}?${params.toString()}`;
};

export const redirectToLogin = (): void => {
  const redirectUri = `${window.location.origin}/#/callback`;
  const authorizationUrl = getAuthorizationUrl(redirectUri);
  window.location.href = authorizationUrl;
};

export const getAccessToken = async (
  code: string
): Promise<OAuthTokenResponse> => {
  const config: RequestInit = {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
      Authorization: `Basic ${btoa(`${CLIENT_ID}:${CLIENT_SECRET}`)}`,
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      scope: "write",
      code: code,
      redirect_uri: `${window.location.origin}/#/callback`,
      client_id: CLIENT_ID || "",
      client_secret: CLIENT_SECRET || "",
    }),
  };

  try {
    const response = await fetch("/api/oauth/token", config);
    console.log("Response status:", response.status);
    console.log("Response headers:", response.headers);
    const text = await response.text();
    console.log("Response body:", text);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return JSON.parse(text);
  } catch (error) {
    console.error("Error getting access token:", error);
    throw error;
  }
};

export const refreshAccessToken = async (
  refreshToken: string
): Promise<OAuthTokenResponse> => {
  const config: RequestInit = {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
      Authorization: `Basic ${btoa(`${CLIENT_ID}:${CLIENT_SECRET}`)}`,
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    }),
  };

  try {
    const response = await fetch("api/oauth/token", config);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `Failed to refresh access token: ${errorData.error} - ${errorData.error_description}`
      );
    }
    const data: OAuthTokenResponse = await response.json();
    return data;
  } catch (error) {
    console.error("Error refreshing access token:", error);
    if (error instanceof Error) {
      throw error;
    } else {
      throw new Error(
        "An unknown error occurred while refreshing the access token."
      );
    }
  }
  // Ensure a return statement is present
  return {} as OAuthTokenResponse;
};
