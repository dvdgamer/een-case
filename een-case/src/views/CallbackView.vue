<template>
  <div>
    <p>Logging in...</p>
  </div>
</template>

<script>
import { onMounted } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { getAccessToken } from "@/api";

export default {
  name: "CallbackView",
  setup() {
    const store = useStore();
    const router = useRouter();

    onMounted(async () => {
      const code = new URLSearchParams(window.location.search).get("code");
      if (!code) {
        console.error("Authorization code not found");
        return;
      }
      store.commit("setCode", code);

      try {
        const tokens = await getAccessToken(code);
        store.commit("setAccessToken", tokens.access_token);
        console.log(
          "setAccessToken ran in CallbackView. tokens.access_token :",
          tokens.access_token
        );

        router.push({ name: "CameraList" });
      } catch (error) {
        console.error("Error during login:", error);
      }
    });
  },
};
</script>
