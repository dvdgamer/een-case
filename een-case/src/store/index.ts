import { createStore } from "vuex";

export default createStore({
  state: {
    cameras: [],
  },
  getters: {
    allCameras: (state) => state.cameras,
  },
  mutations: {
    setCameras(state, cameras) {
      state.cameras = cameras;
    },
  },
  actions: {
    // login({ commit }, user) {
    //   // Simulate a login API call
    //   commit("setUser", user);
    // },
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
