import { getAccessToken, refreshAccessToken } from "@/api";
import { Camera } from "@/types";
import { createStore } from "vuex";

// Create a new Vuex store
export default createStore({
  state: {
    code: null, // Authorization code
    accessToken: null, // Access token for API requests
    refreshToken: null, // Refresh token for renewing the access token
    tokenExpiration: null, // Expiration time of the access token
    cameras: null as Camera[] | null, // List of cameras
  },
  getters: {
    // Check if the user is authenticated
    isAuthenticated: (state) => {
      return !!state.accessToken;
    },
    // Get the list of all cameras
    allCameras: (state) => {
      return state.cameras;
    },
  },
  mutations: {
    // Set the authorization code
    setCode(state, code) {
      state.code = code;
    },
    // Set the list of cameras
    setCameras(state, cameras: Camera[]) {
      state.cameras = cameras;
    },
    // Set the access token
    setAccessToken(state, accessToken) {
      state.accessToken = accessToken;
    },
    // Set the refresh token
    setRefreshToken(state, refreshToken) {
      state.refreshToken = refreshToken;
    },
    // Set the expiration time of the access token
    setTokenExpiration(state, expiration) {
      state.tokenExpiration = expiration;
    },
  },
  actions: {
    // Action to get the access token using the authorization code
    async getAccessToken({ commit, dispatch }, code) {
      try {
        const tokens = await getAccessToken(code);
        if (!tokens) {
          throw new Error("Tokens are undefined");
        }
        commit("setAccessToken", tokens.access_token);
        commit("setRefreshToken", tokens.refresh_token);
        const expirationTime = Date.now() + tokens.expires_in * 1000;
        commit("setTokenExpiration", expirationTime);
        dispatch("scheduleTokenRefresh", tokens.expires_in);
        return tokens;
      } catch (error) {
        console.error("Error getting access token:", error);
        throw error;
      }
    },
    // Action to refresh the access token using the refresh token
    async refreshAccessToken({ state, commit, dispatch }) {
      console.log("refreshAccessToken is running");
      if (!state.refreshToken) {
        throw new Error("No refresh token available");
      }
      try {
        const tokens = await refreshAccessToken(state.refreshToken);
        if (!tokens) {
          throw new Error("Tokens are undefined");
        }
        commit("setAccessToken", tokens.access_token);
        commit("setRefreshToken", tokens.refresh_token);
        const expirationTime = Date.now() + tokens.expires_in * 1000;
        commit("setTokenExpiration", expirationTime);
        dispatch("scheduleTokenRefresh", tokens.expires_in);
        return tokens;
      } catch (error) {
        console.error("Error refreshing access token:", error);
        throw error;
      }
    },
    // Action to schedule the token refresh before it expires
    scheduleTokenRefresh({ dispatch }, expiresIn) {
      console.log("scheduleTokenRefresh is running");
      // Refresh 1 minute before expiration
      const refreshTime = (expiresIn - 60) * 1000;
      setTimeout(() => {
        console.log("Executing refreshAccessToken from scheduleTokenRefresh");
        dispatch("refreshAccessToken");
      }, refreshTime);
    },
  },
});
