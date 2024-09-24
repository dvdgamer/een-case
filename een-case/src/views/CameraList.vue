<template>
  <div class="camera-list">
    <h1>Welcome to your Camera List</h1>
    <div v-if="loading">Loading cameras...</div>
    <div v-else-if="error">{{ error }}</div>
    <ul v-else>
      <li v-for="Camera in cameraList" :key="Camera.cameraId">
        {{ Camera.name }}
      </li>
    </ul>
    <h2>Add a new camera</h2>
    <button @click="handleCameraList">Add New Camera</button>
    <div v-if="addCameraStatus">{{ addCameraStatus }}</div>
  </div>
</template>

<script lang="ts">
import {
  fetchCameraAPI,
  // addAndCheckCameraStatus,
  fetchCameraList,
} from "@/api";
import { useStore } from "vuex";
import { defineComponent, ref, onMounted } from "vue";
import { Camera } from "@/types";

export default defineComponent({
  name: "CameraListView",
  setup() {
    const store = useStore();
    const loading = ref(true);
    const error = ref<string | null>(null);
    // const cameraData = ref<{ name: string }>({ name: "" });
    const addCameraStatus = ref<string | null>(null);
    const accessToken = store.state.accessToken;
    const newCameraData = ref<{ name: string }>({ name: "" });
    const cameraList = ref<Camera[]>([]);

    const loadCameras = async () => {
      try {
        console.log("Access token from Vuex store:", accessToken);
        if (!accessToken) {
          throw new Error("No access token found in Vuex store");
        }
        await fetchCameraAPI(accessToken);
      } catch (err) {
        if (err instanceof Error) {
          error.value = err.message;
        } else {
          error.value = String(err);
        }
      } finally {
        loading.value = false;
      }
    };

    const handleCameraList = async () => {
      try {
        addCameraStatus.value = "Adding camera...";

        addCameraStatus.value = "Camera added successfully!";
        newCameraData.value = { name: "" }; // Reset the new camera data
        // Refresh the camera list after adding a new camera
        const cameraDataList = await fetchCameraList(accessToken);
        console.log("handleCameraList (cameraList.value):", cameraDataList);
      } catch (err) {
        if (err instanceof Error) {
          addCameraStatus.value = `Error: ${err.message}`;
        } else {
          addCameraStatus.value = `Error: ${String(err)}`;
        }
      }
    };
    onMounted(() => {
      loadCameras();
      // handleCameraList();
    });

    return {
      loading,
      error,
      // cameraData,
      handleCameraList,
      addCameraStatus,
      cameraList,
    };
  },
});
</script>
