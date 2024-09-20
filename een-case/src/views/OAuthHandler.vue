<script>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { handleError } from "@/utils/errorHandler";

export default {
  name: "OAuthHandler",
  setup() {
    const loading = ref(true);
    const error = ref(null);
    const router = useRouter();
    const store = useStore();

    /**
     * Handles the process of obtaining the access token using the authorization code.
     * @param code - The authorization code received from the OAuth2 flow.
     */
    const handleAccessToken = async (code) => {
      try {
        // Dispatch the getAccessToken action from the Vuex store
        const tokenData = await store.dispatch("getAccessToken", code);
        console.log("Access token obtained:", tokenData);
      } catch (err) {
        handleError("Failed to get access token", err);
      }
    };

    // Lifecycle hook that runs when the component is mounted
    onMounted(async () => {
      // Get the authorization code from the URL query parameters
      const code = new URLSearchParams(window.location.search).get("code");
      if (code) {
        await handleAccessToken(code);
      } else {
        error.value = "No authorization code found in the URL";
      }
      // Redirect to the CameraList view after handling the token
      router.push({ name: "CameraList" });
      loading.value = false;
    });

    return { loading, error };
  },
};
</script>
