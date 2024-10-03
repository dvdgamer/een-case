import { handleError } from "@/utils/errorHandler";
import { Camera } from "./types";
// import CameraDetails from "./views/CameraDetails.vue";

// Interface representing the structure of the OAuth token response
interface OAuthTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
}

interface CameraStatusResponse {
  audioEnabled: boolean;
  cameraId: number;
  online: boolean;
  passwordKnown: boolean;
  recordingOnCloud: boolean;
  recordingOnSd: boolean;
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

export const fetchCameraAPI = async (
  accessToken: string
): Promise<Record<string, never>> => {
  if (!accessToken) {
    throw new Error("No access token found in Vuex store");
  }

  try {
    const response = await fetch("api/rest/v2.4/users/self/", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch cameras: ${response.statusText}`);
    }
    return {};
  } catch (error) {
    console.error("Error in fetchCameras:", error);
    throw error;
  }
};

export const fetchCameraList = async (
  accessToken: string
): Promise<Camera[]> => {
  try {
    const response = await fetch("api/rest/v2.4/cameras", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch camera list: ${response.statusText}`);
    }

    const cameraList = await response.json();
    return cameraList;
  } catch (error) {
    console.error("Error in fetchCameraList:", error);
    throw error;
  }
};

export const addCamera = async (
  accessToken: string,
  cameraId: unknown
): Promise<Response> => {
  try {
    const response = await fetch(`/api/rest/v2.4/cameras/${cameraId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to add camera: ${response.statusText}`);
    }
    console.log("Success with the addCamera :", response);
    return response;
  } catch (error) {
    console.error("Error in addCamera:", error);
    throw error;
  }
};

export const checkCameraAdditionStatus = async (
  accessToken: string,
  cameraId: number
): Promise<CameraStatusResponse> => {
  if (!cameraId) {
    throw new Error("Camera ID is required to check addition status");
  }
  const response = await fetch(
    `api/rest/v2.4/cameras/${cameraId}/additionStatus/poll`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json, text/plain, */*",
      },
    }
  );

  if (!response.ok) {
    throw new Error(
      `Failed to check camera addition status: ${response.statusText}`
    );
  }

  const data = await response.json();
  console.log("checkCameraAdditionStatus: ", data);
  return data;
};

export const addAndCheckCameraStatus = async (
  accessToken: string,
  cameraId: number
): Promise<unknown> => {
  // first addCamera
  const addResponse = await addCamera(accessToken, cameraId);

  // let status: CameraAdditionStatus = { Status: "inProgress", SubStatus: "" };
  let status;
  let retries = 0;
  const maxRetries = 10; // 10 * 18 seconds = 180 seconds (3 minutes)
  const retryDelay = 18000; // 18 seconds

  console.log("addAndCheckCameraStatus :", addResponse);

  while (status === undefined && retries < maxRetries) {
    try {
      status = await checkCameraAdditionStatus(accessToken, cameraId);
      console.log("Camera addition status:", status);
      await new Promise((resolve) => setTimeout(resolve, retryDelay));
      retries++;
    } catch (error) {
      console.error("Error in checkCameraAdditionStatus:", error);
      throw error;
    }
  }
  console.log("status: ", status);
  return status;
};
