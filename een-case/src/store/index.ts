import { createStore } from "vuex";
import {
  getAuthorizationUrl,
  requestTokens,
  refreshAccessToken,
  logout,
} from "@/api";

export default createStore({
  state: {
    cameras: [],
    tokens: null,
  },
  getters: {
    allCameras: (state) => state.cameras,
    isAuthenticated: (state) => !!state.tokens,
  },
  mutations: {
    setCameras(state, cameras) {
      state.cameras = cameras;
    },
    setToken(state, tokens) {
      state.tokens = tokens;
    },
    clearTokens(state) {
      state.tokens = null;
    },
  },
  actions: {
    async login({ commit }, { code, redirectUri }) {
      try {
        const tokens = await requestTokens(code, redirectUri);
        commit("setTokens", tokens);
      } catch (error) {
        console.log("Error logging in:", error);
      }
    },
    async refreshToken({ commit }, refreshToken) {
      try {
        const newTokens = await refreshAccessToken(refreshToken);
        commit("setTokens", newTokens);
      } catch (error) {
        console.error("Error refreshing token:", error);
      }
    },
    async logout({ commit }, accessToken) {
      try {
        await logout(accessToken);
        commit("clearTokens");
      } catch (error) {
        console.error("Error logging out:", error);
      }
    },
    fetchCameras({ commit }) {
      // Simulate an API call to fetch cameras
      const cameras = [
        { id: 1, name: "Camera 1" },
        { id: 2, name: "Camera 2" },
      ];
      commit("setCameras", cameras);
    },
  },
  modules: {},
});
