import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import {
  getAuthorizationUrl,
  requestTokens,
  refreshAccessToken,
  logout,
} from "@/api";

const mock = new MockAdapter(axios);

describe("API Module Tests", () => {
  const CLIENT_ID = process.env.API_KEY;
  const CLIENT_SECRET = process.env.SECRET;
  const redirectUri = "https://example.com/callback";

  afterEach(() => {
    mock.reset();
  });

  test("getAuthorizationUrl should return the correct URL", () => {
    const url = getAuthorizationUrl(redirectUri);
    expect(url).toContain("http://rest.cameramanager.com/oauth/authorize");
    expect(url).toContain(`client_id=${CLIENT_ID}`);
    expect(url).toContain(`redirect_uri=${encodeURIComponent(redirectUri)}`);
  });

  test("requestTokens should return tokens on success", async () => {
    const mockCode = "mockCode";
    const mockResponse = {
      access_token: "mockAccessToken",
      refresh_token: "mockRefreshToken",
      expires_in: 43199,
      scope: "write",
    };

    mock
      .onPost("http://rest.cameramanager.com/oauth/token")
      .reply(200, mockResponse);

    const response = await requestTokens(mockCode, redirectUri);
    expect(response).toEqual(mockResponse);
  });

  test("requestTokens should handle errors", async () => {
    const mockCode = "mockCode";

    mock.onPost("http://rest.cameramanager.com/oauth/token").reply(400, {
      error: "invalid_request",
    });

    await expect(requestTokens(mockCode, redirectUri)).rejects.toThrow();
  });

  test("refreshAccessToken should return new token", async () => {
    const mockRefreshToken = "mockRefreshToken";
    const mockResponse = {
      access_token: "newMockAccessToken",
      refresh_token: "mockRefreshToken",
      expires_in: 43199,
      scope: "write",
    };

    mock
      .onPost("http://rest.cameramanager.com/oauth/token")
      .reply(200, mockResponse);

    const response = await refreshAccessToken(mockRefreshToken);
    expect(response).toEqual(mockResponse);
  });

  test("logout should make the correct request", async () => {
    const mockAccessToken = "mockAccessToken";
    mock
      .onDelete(
        "http://rest.cameramanager.com/rest/v2.0/users/self/tokens/current"
      )
      .reply(200, {});

    const response = await logout(mockAccessToken);
    expect(response).toEqual({});
  });
});
