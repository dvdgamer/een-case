<template>
  <div class="camera-list">
    <h1>Welcome to your Camera List</h1>
    <div v-if="loading">Loading cameras...</div>
    <div v-else-if="error">{{ error }}</div>
    <ul v-else>
      <!-- <li v-for="camera in cameras" :key="camera.id">{{ camera.name }}</li> -->
      <div>Responded :D</div>
    </ul>
  </div>
</template>

<script lang="ts">
import { fetchCameraAPI } from "@/api";
import { defineComponent, ref, onMounted } from "vue";
import { useStore } from "vuex";

export default defineComponent({
  name: "CameraListView",
  setup() {
    const store = useStore();
    const loading = ref(true);
    const error = ref<string | null>(null);
    const cameras = ref<unknown[]>([]);

    const loadCameras = async () => {
      try {
        console.log("started the CameraList fetching...");
        const accessToken = store.state.accessToken;
        console.log("Access token from Vuex store:", accessToken);
        if (!accessToken) {
          throw new Error("No access token found in Vuex store");
        }
        await fetchCameraAPI(store.state.accessToken);
        console.log("Accessing Camera API...");
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

    onMounted(() => {
      loadCameras();
    });

    return { loading, error, cameras };
  },
});
</script>
