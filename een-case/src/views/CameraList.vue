<template>
  <div class="camera-list">
    <h1>Welcome to your Camera List</h1>
    <div v-if="loading">Loading cameras...</div>
    <div v-else-if="error">{{ error }}</div>
    <div v-else>
      <h2>Available cameras:</h2>
      <ul>
        <li v-for="camera in cameraList" :key="camera.cameraId">
          {{ camera.name }}
          <button @click="handleAddCamera(accessToken, camera.cameraId)">
            Add Camera
          </button>
          <span v-if="addCameraStatus[camera.cameraId]">
            {{ addCameraStatus[camera.cameraId] }}
          </span>
        </li>
      </ul>
    </div>
    <button @click="fetchCameras">Check for available cameras</button>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import { useStore } from "vuex";
import { fetchCameraList, checkCameraAdditionStatus, addCamera } from "@/api";
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
        cameraList.value = await fetchCameraList(accessToken);
        console.log(cameraList.value);
      } catch (err) {
        error.value = err instanceof Error ? err.message : String(err);
      } finally {
        loading.value = false;
      }
    };

    const handleAddCamera = async (accessToken: string, cameraId: number) => {
      try {
        addCameraStatus.value[cameraId] = "Adding camera...";
        await addCamera(accessToken, cameraId);
        pollCameraStatus(cameraId);
      } catch (err) {
        addCameraStatus.value[cameraId] = `Error: ${
          err instanceof Error ? err.message : String(err)
        }`;
      }
    };

    const pollCameraStatus = async (cameraId: number) => {
      try {
        const status = await checkCameraAdditionStatus(accessToken, cameraId);
        switch (status.Status) {
          case "added":
            addCameraStatus.value[cameraId] = "Camera added successfully!";
            break;
          case "failure":
            addCameraStatus.value[
              cameraId
            ] = `Failed to add camera: ${status.SubStatus}`;
            break;
          case "inProgress":
          case "validated":
            addCameraStatus.value[cameraId] =
              "Failed to add camera: unexpected status";
            break;
        }
      } catch (err) {
        addCameraStatus.value[cameraId] = `Error checking status: ${
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
    };
  },
});
</script>
