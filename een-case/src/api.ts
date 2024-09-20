import { handleError } from "@/utils/errorHandler";

// Interface representing the structure of the OAuth token response
interface OAuthTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
}

// Client ID and Client Secret from environment variables
const CLIENT_ID = process.env.VUE_APP_API_KEY;
const CLIENT_SECRET = process.env.VUE_APP_API_SECRET;

/**
 * Generates the authorization URL for the OAuth2 flow.
 * @param redirectUri - The URI to redirect to after authorization.
 * @returns The full authorization URL.
 */
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

/**
 * Redirects the user to the login page for authorization.
 */
export const redirectToLogin = (): void => {
  const redirectUri = `${window.location.origin}/#/callback`;
  const authorizationUrl = getAuthorizationUrl(redirectUri);
  window.location.href = authorizationUrl;
};

/**
 * Retrieves the access token after successfully logging in.
 * @param code - The authorization code received from the OAuth2 flow.
 * @returns A promise that resolves to the OAuth token response.
 */
export const getAccessToken = async (
  code: string
): Promise<OAuthTokenResponse | undefined> => {
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
    const text = await response.text();

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return JSON.parse(text);
  } catch (error) {
    handleError(error, "getAccessToken");
  }
};

/**
 * Refreshes the access token using the refresh token.
 * @param refreshToken - The refresh token received from the OAuth2 flow.
 * @returns A promise that resolves to the OAuth token response.
 */
export const refreshAccessToken = async (
  refreshToken: string
): Promise<OAuthTokenResponse | undefined> => {
  const config: RequestInit = {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
      Authorization: `Basic ${btoa(`${CLIENT_ID}:${CLIENT_SECRET}`)}`,
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      scope: "write",
      refresh_token: refreshToken,
    }),
  };

  try {
    const response = await fetch("/api/oauth/token", config);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `Failed to refresh access token: ${errorData.error} - ${errorData.error_description}`
      );
    }
    const data: OAuthTokenResponse = await response.json();
    console.log("Refresh Response data:", data);
    return data;
  } catch (error) {
    handleError(error, "refreshAccessToken");
  }
};

/**
 * Accesses the API to be able to add Cameras.
 * @returns an empty object.
 */
export const fetchCameraAPI = async (
  accessToken: string
): Promise<Record<string, never>> => {
  if (!accessToken) {
    throw new Error("No access token found in Vuex store");
  }

  try {
    const response = await fetch("api/rest/v2.0/users/self/", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch cameras: ${response.statusText}`);
    }
    console.log(response);
    return {};
  } catch (error) {
    console.error("Error in fetchCameras:", error);
    throw error;
  }
};

export const addCamera = async (
  accessToken: string,
  cameraData: unknown
): Promise<Response> => {
  try {
    const response = await fetch("api/rest/v2.0/cameras", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(cameraData),
    });

    if (!response.ok) {
      throw new Error(`Failed to add camera: ${response.statusText}`);
    }

    return response;
  } catch (error) {
    console.error("Error in addCamera:", error);
    throw error;
  }
};
