<template>
  <div class="camera-list">
    <div v-if="!accessToken" class="login">
      <h1>You need to <a href="/#/login">LOGIN</a></h1>
    </div>
    <div v-else>
      <div v-if="loading">Loading cameras...</div>
      <div v-else-if="error">{{ error }}</div>
      <div v-else>
        <h1>Welcome to your Camera List</h1>
        <h2>Available cameras:</h2>
        <ul>
          <li v-for="camera in cameraList" :key="camera.cameraId">
            {{ camera.name }}
            <button @click="handleAddCamera(accessToken, camera.cameraId)">
              Add Camera
            </button>
            <button @click="addAndCheckStatus(accessToken, camera.cameraId)">
              add and check Status
            </button>
            <span v-if="addCameraStatus[camera.cameraId]">
              {{ addCameraStatus[camera.cameraId] }}
            </span>
          </li>
        </ul>
      </div>
      <button @click="fetchCameras">Check for available cameras</button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import { useStore } from "vuex";
import {
  fetchCameraList,
  addAndCheckCameraStatus,
  addCamera,
  // checkSelfStatus,
} from "@/api";
import { Camera } from "@/types";

export default defineComponent({
  name: "CameraListView",
  setup() {
    const store = useStore();
    const loading = ref(true);
    const error = ref<string | null>(null);
    const cameraList = ref<Camera[]>([]);
    const addCameraStatus = ref<Record<number, string>>({});
    const accessToken = store.state.accessToken;

    const fetchCameras = async () => {
      try {
        loading.value = true;
        if (!accessToken) {
          throw new Error("You need to login");
        }
        cameraList.value = await fetchCameraList(accessToken); //retrieves an array with the Camera objects
        // checkSelfStatus(accessToken);
      } catch (err) {
        error.value = err instanceof Error ? err.message : String(err);
      } finally {
        loading.value = false;
      }
    };

    const addAndCheckStatus = async (accessToken: string, cameraId: number) => {
      addAndCheckCameraStatus(accessToken, cameraId);
    };

    const handleAddCamera = async (accessToken: string, cameraId: number) => {
      try {
        addCameraStatus.value[cameraId] = "Adding camera...";
        await addCamera(accessToken, cameraId);
        // await pollCameraStatus(cameraId);
      } catch (err) {
        addCameraStatus.value[cameraId] = `Error: ${
          err instanceof Error ? err.message : String(err)
        }`;
      }
    };

    onMounted(fetchCameras);

    return {
      loading,
      error,
      cameraList,
      addCameraStatus,
      fetchCameras,
      handleAddCamera,
      accessToken,
      addAndCheckStatus,
    };
  },
});
</script>
<style scoped>
.login {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80vh;
}
</style>
