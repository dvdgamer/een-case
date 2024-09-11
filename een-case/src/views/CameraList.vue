<template>
  <div class="camera-list">
    <img alt="Vue logo" src="../assets/logo.png" />
    <HelloWorld msg="Welcome to your Camera List" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import HelloWorld from "@/components/HelloWorld.vue"; // @ is an alias to /src

export default defineComponent({
  name: "CameraListView",
  components: {
    HelloWorld,
  },
});
</script>
