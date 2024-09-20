import { getAccessToken } from "@/api";
import { createStore } from "vuex";

export default createStore({
  state: {
    code: null,
    accessToken: null,
    refreshToken: null,
    cameras: [],
  },
  getters: {
    isAuthenticated: (state) => {
      console.log("state.accessToken :", state.accessToken);
      return !!state.accessToken;
    },
  },
  mutations: {
    setCode(state, code) {
      state.code = code;
      console.log("code :", code);
    },
    setCameras(state, cameras) {
      state.cameras = cameras;
    },
    setAccessToken(state, accessToken) {
      state.accessToken = accessToken;
      console.log("accessToken:", accessToken);
    },
    setRefreshToken(state, refreshToken) {
      state.refreshToken = refreshToken;
      console.log("accessToken:", refreshToken);
    },
  },
  actions: {
    async getAccessToken({ commit }, code) {
      return getAccessToken(code)
        .then((tokens) => {
          commit("setAccessToken", tokens.access_token);
          console.log("tokens :", tokens);

          return tokens;
        })
        .catch((error) => {
          console.error("Error getting access token:", error);
          throw error;
        });
    },
    fetchCameras({ commit, getters }) {
      if (!getters.isAuthenticated) {
        console.log("User is NOT logged in.");
        return;
      }

      // Simulate an API call to fetch cameras
      console.log("User IS logged in.");
      const cameras = [
        { id: 1, name: "Camera 1" },
        { id: 2, name: "Camera 2" },
      ];
      commit("setCameras", cameras);
    },
  },
});
