<template>
  <!-- Display loading message while fetching cameras -->
  <div v-if="loading" class="loading">Loading cameras...</div>

  <!-- Display error message if there is an error -->
  <div v-else-if="error">{{ error }}</div>

  <!-- Display camera list when data is available -->
  <div v-else>
    <h1 class="title">Camera List</h1>

    <!-- Header showing the number of online cameras and a refresh icon -->
    <div class="camera-header">
      <h3>Cameras online: {{ cameraList.length }}</h3>
      <div @click="fetchCameras" class="icon-container">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          version="1.1"
          width="30"
          height="30"
          viewBox="0 0 256 256"
          preserveAspectRatio="xMidYMid meet"
          xml:space="preserve"
          shape-rendering="geometricPrecision"
        >
          <defs></defs>
          <g
            style="
              stroke: black;
              stroke-width: 4;
              stroke-dasharray: none;
              stroke-linecap: butt;
              stroke-linejoin: miter;
              stroke-miterlimit: 10;
              fill: none;
              fill-rule: nonzero;
              opacity: 1;
            "
            transform="translate(1.4065934065934016 1.4065934065934016) scale(2.81 2.81)"
          >
            <path
              d="M 81.521 31.109 c -0.86 -1.73 -2.959 -2.438 -4.692 -1.575 c -1.73 0.86 -2.436 2.961 -1.575 4.692 c 2.329 4.685 3.51 9.734 3.51 15.01 C 78.764 67.854 63.617 83 45 83 S 11.236 67.854 11.236 49.236 c 0 -16.222 11.501 -29.805 26.776 -33.033 l -3.129 4.739 c -1.065 1.613 -0.62 3.784 0.992 4.85 c 0.594 0.392 1.264 0.579 1.926 0.579 c 1.136 0 2.251 -0.553 2.924 -1.571 l 7.176 -10.87 c 0.001 -0.001 0.001 -0.002 0.002 -0.003 l 0.018 -0.027 c 0.063 -0.096 0.106 -0.199 0.159 -0.299 c 0.049 -0.093 0.108 -0.181 0.149 -0.279 c 0.087 -0.207 0.152 -0.419 0.197 -0.634 c 0.009 -0.041 0.008 -0.085 0.015 -0.126 c 0.031 -0.182 0.053 -0.364 0.055 -0.547 c 0 -0.014 0.004 -0.028 0.004 -0.042 c 0 -0.066 -0.016 -0.128 -0.019 -0.193 c -0.008 -0.145 -0.018 -0.288 -0.043 -0.431 c -0.018 -0.097 -0.045 -0.189 -0.071 -0.283 c -0.032 -0.118 -0.065 -0.236 -0.109 -0.35 c -0.037 -0.095 -0.081 -0.185 -0.125 -0.276 c -0.052 -0.107 -0.107 -0.211 -0.17 -0.313 c -0.054 -0.087 -0.114 -0.168 -0.175 -0.25 c -0.07 -0.093 -0.143 -0.183 -0.223 -0.27 c -0.074 -0.08 -0.153 -0.155 -0.234 -0.228 c -0.047 -0.042 -0.085 -0.092 -0.135 -0.132 L 36.679 0.775 c -1.503 -1.213 -3.708 -0.977 -4.921 0.53 c -1.213 1.505 -0.976 3.709 0.53 4.921 l 3.972 3.2 C 17.97 13.438 4.236 29.759 4.236 49.236 C 4.236 71.714 22.522 90 45 90 s 40.764 -18.286 40.764 -40.764 C 85.764 42.87 84.337 36.772 81.521 31.109 z"
              style="
                stroke: black;
                stroke-width: 1;
                fill: rgb(44, 62, 80);
                fill-rule: nonzero;
                opacity: 1;
              "
              transform=" matrix(1 0 0 1 0 0) "
              stroke-linecap="round"
            />
          </g>
        </svg>
      </div>
    </div>

    <!-- List of cameras -->
    <ul class="camera-ul">
      <li v-for="camera in cameraList" :key="camera.cameraId">
        <div class="camera-name">
          {{ camera.name }}
          <!-- Tooltip showing additional camera information -->
          <div class="tooltip">
            <p>ID: {{ camera.cameraId }}</p>
            <p>Zone Id: {{ camera.zoneId }}</p>
            <p>Eth Mac Address: {{ camera.ethMacAddress }}</p>
            <!-- Add more camera info as needed -->
          </div>
        </div>
        <div class="buttons">
          <!-- Display status of adding camera -->
          <span v-if="addCameraStatus[camera.cameraId]">
            {{ addCameraStatus[camera.cameraId] }}
          </span>
          <!-- Button to add and check camera status -->
          <button
            @click="addAndCheckStatus(accessToken, camera.cameraId)"
            class="check-status-button"
          >
            Add & Check Status
          </button>
        </div>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { useStore } from "vuex";
import { defineComponent, ref, onMounted } from "vue";
import {
  fetchCameraList,
  addAndCheckCameraStatus,
  checkAllCameraStatus,
} from "@/api";
import { Camera } from "@/types";

export default defineComponent({
  name: "CameraList",
  setup() {
    const store = useStore();
    const loading = ref(true);
    const accessToken = store.state.accessToken;
    const error = ref<string | null>(null);
    const cameraList = ref<Camera[]>([]);
    const addCameraStatus = ref<Record<number, string>>({});

    /**
     * Fetches the list of cameras from the API.
     */
    const fetchCameras = async () => {
      try {
        loading.value = true;
        if (!accessToken) {
          throw new Error("You need to login");
        }
        cameraList.value = await fetchCameraList(accessToken);
        console.log(cameraList.value);
      } catch (err) {
        error.value = err instanceof Error ? err.message : String(err);
      } finally {
        loading.value = false;
      }
    };

    /**
     * Adds a camera and checks its status.
     * @param accessToken - The access token for authorization.
     * @param cameraId - The ID of the camera to add and check.
     */
    const addAndCheckStatus = async (accessToken: string, cameraId: number) => {
      addCameraStatus.value[cameraId] = "Checking...";
      try {
        await checkAllCameraStatus(accessToken);
        await addAndCheckCameraStatus(accessToken, cameraId);
        addCameraStatus.value[cameraId] = "Added & Checked";
      } catch (err) {
        addCameraStatus.value[cameraId] = String(err);
        console.error(err);
      }
    };

    // Fetch cameras when the component is mounted
    onMounted(fetchCameras);

    return {
      loading,
      error,
      fetchCameras,
      addAndCheckStatus,
      cameraList,
      addCameraStatus,
      accessToken,
    };
  },
});
</script>

<style scoped>
.title {
  margin: 20px 0;
  text-align: left;
}

.camera-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 20px 0px;
}

.camera-ul {
  list-style-type: none;
  padding: 0;
}

.camera-ul li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid rgb(202, 197, 197);
  box-shadow: 6px 6px 200px rgb(234, 236, 238);
  margin: 2px;
  padding: 20px;
  font-weight: bold;
}

.camera-name {
  margin-right: 30px;
  position: relative;
}

.tooltip {
  display: none;
  position: absolute;
  top: 100%;
  left: 0;
  background-color: #2626278e;
  color: #fff;
  padding: 5px;
  border-radius: 3px;
  white-space: nowrap;
  z-index: 10;
}

.camera-name:hover .tooltip {
  display: block;
}

.icon-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  transition: transform 0.5s;
  box-sizing: border-box;
}

.icon-container:hover {
  transform: rotate(90deg);
  cursor: pointer;
  font-weight: bolder;
}

.buttons {
  display: flex;
  align-items: center;
}

.buttons button {
  margin: 0px 10px;
  padding: 4px;
}

.buttons button:hover {
  cursor: pointer;
}
</style>
