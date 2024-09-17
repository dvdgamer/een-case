// import base64 from "base-64";
import axios, { AxiosRequestConfig } from "axios";

const API_URL = "https://rest.cameramanager.com";
const CLIENT_ID = process.env.VUE_APP_API_KEY;
const CLIENT_SECRET = process.env.VUE_APP_API_SECRET;

export const getAuthorizationUrl = (redirectUri: string): string => {
  return `${API_URL}/oauth/authorize?scope=write&client_id=${CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(
    redirectUri
  )}`;
};

export const redirectToLogin = (): void => {
  const redirectUri = `${window.location.origin}/#/callback`;
  const authorizationUrl = getAuthorizationUrl(redirectUri);
  window.location.href = authorizationUrl;
};

export const getAccessToken = (
  code: string
): Promise<{ access_token: string; refresh_token: string }> => {
  const config: AxiosRequestConfig = {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
      Authorization: `Basic ${btoa(`${CLIENT_ID}:${CLIENT_SECRET}`)}`,
    },
  };

  const params = new URLSearchParams();
  params.append("grant_type", "authorization_code");
  params.append("scope", "write");
  params.append("code", code);
  params.append("redirect_uri", `${window.location.origin}/#/callback`);

  return axios
    .post(`${API_URL}/oauth/token`, params, config)
    .then((response) => {
      console.log("getAccessToken success!");
      return {
        access_token: response.data.access_token,
        refresh_token: response.data.refresh_token,
      };
    })
    .catch((error) => {
      console.error("Error getting access token:", error);
      throw error;
    });
};
