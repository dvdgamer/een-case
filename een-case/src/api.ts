import axios from "axios";

const API_URL = "http://rest.cameramanager.com";
const CLIENT_ID = process.env.API_KEY;
const CLIENT_SECRET = process.env.SECRET;

const getAuthorizationUrl = (redirectUri: string): string => {
  return `${API_URL}/oauth/authorize?scope=write&client_id=${CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(
    redirectUri
  )}`;
};

const requestTokens = async (
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
      Authorization: `Basic ${Buffer.from(
        `${CLIENT_ID}:${CLIENT_SECRET}`
      ).toString("base64")}`,
    },
  });

  return response.data;
};

const refreshAccessToken = async (refreshToken: string): Promise<string> => {
  const response = await axios.post(`${API_URL}/oauth/token`, null, {
    params: {
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    },
    headers: {
      Accept: "application/json",
      Authorization: `Basic ${Buffer.from(
        `${CLIENT_ID}:${CLIENT_SECRET}`
      ).toString("base64")}`,
    },
  });

  return response.data;
};

const logout = async (accessToken: string): Promise<string> => {
  const response = await axios.delete(
    `${API_URL}/rest/v2.0/users/self/tokens/current`,
    {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return response.data;
};

export { getAuthorizationUrl, requestTokens, refreshAccessToken, logout };
