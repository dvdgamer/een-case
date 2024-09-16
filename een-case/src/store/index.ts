import { createStore } from "vuex";
import {
  requestTokens,
  // refreshAccessToken,
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
