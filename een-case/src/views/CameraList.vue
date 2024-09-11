<template>
  <div class="camera-list">
    <h1>Welcome to your Camera List</h1>
    <li v-for="camera in cameras" :key="camera.id">{{ camera.name }}</li>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import { useStore } from "vuex";

export default defineComponent({
  name: "CameraListView",
  setup() {
    const store = useStore();

    store.dispatch("fetchCameras");

    const cameras = computed(() => store.getters.allCameras);

    return {
      cameras,
    };
  },
});
</script>

<style scoped>
/* Your styles here */
</style>
