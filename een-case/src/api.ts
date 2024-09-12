import axios from "axios";
import base64 from "base-64";

const API_URL = "http://rest.cameramanager.com";
const CLIENT_ID = process.env.API_KEY;
const CLIENT_SECRET = process.env.SECRET;

export const getAuthorizationUrl = (redirectUri: string): string => {
  return `${API_URL}/oauth/authorize?scope=write&client_id=${CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(
    redirectUri
  )}`;
};

export const requestTokens = async (
  code: string,
  redirectUri: string
): Promise<string> => {
  const response = await axios.post(`${API_URL}/oauth/token`, null, {
    params: {
      grant_type: "authorization_code",
      code,
      redirect_uri: redirectUri,
    },
    headers: {
      Accept: "application/json",
      Authorization: `Basic ${base64.encode(`${CLIENT_ID}:${CLIENT_SECRET}`)}`,
    },
  });

  return response.data;
};

export const refreshAccessToken = async (
  refreshToken: string
): Promise<string> => {
  const response = await axios.post(`${API_URL}/oauth/token`, null, {
    params: {
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    },
    headers: {
      Accept: "application/json",
      Authorization: `Basic ${base64.encode(`${CLIENT_ID}:${CLIENT_SECRET}`)}`,
    },
  });

  return response.data;
};

export const logout = async (accessToken: string): Promise<void> => {
  await axios.post(
    `${API_URL}/oauth/revoke`,
    { token: accessToken },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
};
