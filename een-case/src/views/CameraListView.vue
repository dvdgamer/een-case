<template>
  <div class="camera-list">
    <div v-if="!accessToken" class="login">
      <h1>You need to <a @click="redirectToLogin">LOGIN</a></h1>
    </div>
    <div v-else class="camera-list-container">
      <CameraList />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { useStore } from "vuex";
import { redirectToLogin } from "@/api";
import CameraList from "@/components/CameraList.vue";

export default defineComponent({
  name: "CameraListView",
  components: {
    CameraList,
  },
  setup() {
    const store = useStore();
    const error = ref<string | null>(null);
    const accessToken = store.state.accessToken;

    return {
      error,
      accessToken,
      redirectToLogin,
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

.login a {
  text-decoration: none;
  color: #fff;
  background-color: #2273ca;
  border-radius: 4px;
  padding: 15px 30px;
  font-weight: lighter;
}

.login a:hover {
  background-color: #0056b3;
  transition: 50ms;
  cursor: pointer;
}

.loading {
  margin: 100px;
  font-size: xx-large;
}

.camera-list {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}

.camera-list-container {
  width: 80%;
}
</style>
