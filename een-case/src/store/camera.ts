// import { Module } from "vuex";
// import { Camera } from "@/types";
// import { fetchCameraList, checkCameraAdditionStatus } from "@/api";
// import store from ".";

// interface CameraState {
//   cameraList: Camera[];
//   loading: boolean;
//   error: string | null;
//   addCameraStatus: Record<number, string>;
// }

// const cameraModule: Module<CameraState, unknown> = {
//   namespaced: true,
//   state: {
//     cameraList: [],
//     loading: false,
//     error: null,
//     addCameraStatus: {},
//   },
//   mutations: {
//     setCameraList(state, cameraList: Camera[]) {
//       state.cameraList = cameraList;
//     },
//     setLoading(state, loading: boolean) {
//       state.loading = loading;
//     },
//     setError(state, error: string | null) {
//       state.error = error;
//     },
//     setAddCameraStatus(
//       state,
//       { cameraId, status }: { cameraId: number; status: string }
//     ) {
//       state.addCameraStatus[cameraId] = status;
//     },
//   },
//   actions: {
//     async loadCameras({ commit }, accessToken: string) {
//       commit("setLoading", true);
//       commit("setError", null);
//       try {
//         const cameraDataList = await fetchCameraList(accessToken);
//         commit("setCameraList", cameraDataList);
//       } catch (error) {
//         commit(
//           "setError",
//           error instanceof Error ? error.message : String(error)
//         );
//       } finally {
//         commit("setLoading", false);
//       }
//     },
//     async pollCameraStatus({ commit }, cameraId: number) {
//       try {
//         const { Status, SubStatus } = await checkCameraAdditionStatus(
//           store.state.accessToken || "",
//           cameraId
//         );
//         const statusMessages: Record<string, string> = {
//           added: "Camera added successfully!",
//           failure: `Failed to add camera: ${SubStatus}`,
//           inProgress: "Failed to add camera: unexpected status",
//           validated: "Failed to add camera: unexpected status",
//         };
//         commit("setAddCameraStatus", {
//           cameraId,
//           status: statusMessages[Status] || "Unknown status",
//         });
//       } catch (err) {
//         commit("setAddCameraStatus", {
//           cameraId,
//           status: `Error checking status: ${
//             err instanceof Error ? err.message : String(err)
//           }`,
//         });
//       }
//     },
//   },
//   getters: {
//     cameraList: (state) => state.cameraList,
//     loading: (state) => state.loading,
//     error: (state) => state.error,
//     addCameraStatus: (state) => state.addCameraStatus,
//   },
// };

// export default cameraModule;
