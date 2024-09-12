import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { requestTokens } from "../../src/api";

const mock = new MockAdapter(axios);
const redirectUri = "http://localhost/callback";

describe("requestTokens", () => {
  afterEach(() => {
    mock.reset();
  });
  const mockCode = "mockCode";

  test("should return tokens on success", async () => {
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

  test("should handle errors", async () => {
    mock.onPost("http://rest.cameramanager.com/oauth/token").reply(400, {
      error: "invalid_request",
    });

    await expect(requestTokens(mockCode, redirectUri)).rejects.toThrow();
  });

  test("should handle network errors", async () => {
    mock.onPost("http://rest.cameramanager.com/oauth/token").networkError();

    await expect(requestTokens(mockCode, redirectUri)).rejects.toThrow();
  });

  test("should handle timeout errors", async () => {
    mock.onPost("http://rest.cameramanager.com/oauth/token").timeout();

    await expect(requestTokens(mockCode, redirectUri)).rejects.toThrow();
  });

  test("should handle invalid JSON response", async () => {
    mock
      .onPost("http://rest.cameramanager.com/oauth/token")
      .reply(200, "Invalid JSON");

    await expect(requestTokens(mockCode, redirectUri)).rejects.toThrow();
  });

  test("should handle missing tokens in response", async () => {
    const mockResponse = {
      expires_in: 43199,
      scope: "write",
    };

    mock
      .onPost("http://rest.cameramanager.com/oauth/token")
      .reply(200, mockResponse);

    await expect(requestTokens(mockCode, redirectUri)).rejects.toThrow();
  });
});
function afterEach(arg0: () => void) {
  throw new Error("Function not implemented.");
}
