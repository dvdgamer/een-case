<template>
  <div>
    <p>Logging in...</p>
  </div>
</template>

<script>
export default {
  name: "CallbackView",
  async created() {
    const code = new URLSearchParams(window.location.search).get("code");
    if (code) {
      const redirectUri = `${window.location.origin}/callback`;
      await this.$store.dispatch("login", { code, redirectUri });
      this.$router.push({ name: "CameraList" });
    } else {
      console.error("Authorization code not found");
    }
  },
};
</script>
