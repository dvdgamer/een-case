<template>
  <div>
    <p>Logging in...</p>
  </div>
</template>

<script>
export default {
  async created() {
    const code = new URLSearchParams(window.location.search).get("code");
    if (code) {
      const redirectUri = `${window.location.origin}/callback`;
      await this.$store.dispatch("login", { code, redirectUri });
      this.$router.push({ name: "Home" }); // Redirect to home or another page
    } else {
      console.error("Authorization code not found");
    }
  },
};
</script>
