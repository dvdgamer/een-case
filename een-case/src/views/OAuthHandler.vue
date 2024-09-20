<template>
  <div>
    <p v-if="loading">Logging in...</p>
    <p v-if="error">{{ error }}</p>
  </div>
</template>

<script>
import { onMounted, ref } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { getAccessToken } from "@/api";

export default {
  name: "OAuthHandler",
  setup() {
    const loading = ref(true);
    const error = ref(null);
    const store = useStore();
    const router = useRouter();

    const handleError = (message, err) => {
      error.value = message + (err?.message ? `: ${err.message}` : "");
      console.error("Detailed error:", err);
    };
    const handleAccessToken = async (code) => {
      try {
        const tokenData = await getAccessToken(code);
        console.log("Received token data:", tokenData);

        store.commit("setAccessToken", tokenData.access_token);
        store.commit("setRefreshToken", tokenData.refresh_token);
      } catch (err) {
        handleError("Failed to get access token", err);
      }
    };

    onMounted(async () => {
      const code = new URLSearchParams(window.location.search).get("code");
      if (code) {
        await handleAccessToken(code);
      } else {
        error.value = "No authorization code found in the URL";
      }
      router.push({ name: "CameraList" });
      loading.value = false;
    });

    return { loading, error };
  },
};
</script>
