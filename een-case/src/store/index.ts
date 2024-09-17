import { getAccessToken } from "@/api";
import { createStore } from "vuex";
// import { requestTokens } from "@/api";

export default createStore({
  state: {
    cameras: [],
    code: null,
    accessToken: null,
  },
  getters: {
    allCameras: (state) => state.cameras,
    isAuthenticated: (state) => {
      console.log("Checking isAuthenticated:", !!state.code);
      console.log("state.code :", state.code);
      return !!state.code;
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
      console.log("accessToken:", accessToken);
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
        console.log("User is not logged in.");
        return;
      }
      // Simulate an API call to fetch cameras
      const cameras = [
        { id: 1, name: "Camera 1" },
        { id: 2, name: "Camera 2" },
      ];
      commit("setCameras", cameras);
    },
  },
});
