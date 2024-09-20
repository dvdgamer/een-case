import { getAccessToken, refreshAccessToken } from "@/api";
import { createStore } from "vuex";

export default createStore({
  state: {
    code: null,
    accessToken: null,
    refreshToken: null,
    tokenExpiration: null,
    cameras: null,
  },
  getters: {
    isAuthenticated: (state) => {
      return !!state.accessToken;
    },
    allCameras: (state) => {
      return state.cameras;
    },
  },
  mutations: {
    setCode(state, code) {
      state.code = code;
    },
    setCameras(state, cameras) {
      state.cameras = cameras;
    },
    setAccessToken(state, accessToken) {
      state.accessToken = accessToken;
    },
    setRefreshToken(state, refreshToken) {
      state.refreshToken = refreshToken;
    },
    setTokenExpiration(state, expiration) {
      state.tokenExpiration = expiration;
    },
  },
  actions: {
    async getAccessToken({ commit, dispatch }, code) {
      return getAccessToken(code)
        .then((tokens) => {
          if (!tokens) {
            throw new Error("Tokens are undefined");
          } else {
            console.log("getAccessToken is running");
            commit("setAccessToken", tokens.access_token);
            commit("setRefreshToken", tokens.refresh_token);
            const expirationTime = Date.now() + tokens.expires_in * 1000;
            commit("setTokenExpiration", expirationTime);
            dispatch("scheduleTokenRefresh", tokens.expires_in);
          }
          console.log("tokens :", tokens);

          return tokens;
        })
        .catch((error) => {
          console.error("Error getting access token:", error);
          throw error;
        });
    },
    async refreshAccessToken({ state, commit, dispatch }) {
      console.log("refreshAccessToken is running");
      if (!state.refreshToken) {
        throw new Error("No refresh token available");
      }
      return refreshAccessToken(state.refreshToken)
        .then((tokens) => {
          if (!tokens) {
            throw new Error("Tokens are undefined");
          } else {
            commit("setAccessToken", tokens.access_token);
            commit("setRefreshToken", tokens.refresh_token);
            const expirationTime = Date.now() + tokens.expires_in * 1000;
            commit("setTokenExpiration", expirationTime);
            dispatch("scheduleTokenRefresh", tokens.expires_in);
          }
          console.log("tokens :", tokens);

          return tokens;
        })
        .catch((error) => {
          console.error("Error refreshing access token:", error);
          throw error;
        });
    },
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
