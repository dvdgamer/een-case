<template>
  <AppNavbar />
  <router-view />
</template>

<script lang="ts">
import AppNavbar from "@/components/Navbar.vue";

export default {
  components: {
    AppNavbar,
  },
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  min-height: 100vh;
}
</style>
