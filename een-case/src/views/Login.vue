<template>
  <div class="login">
    <h1>Login</h1>
    <form @submit.prevent="login">
      <div>
        <label for="username">Username:</label>
        <input type="text" v-model="username" id="username" />
      </div>
      <div>
        <label for="password">Password:</label>
        <input type="password" v-model="password" id="password" />
      </div>
      <button type="submit">Login</button>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";

export default defineComponent({
  name: "LoginView",
  setup() {
    const username = ref("");
    const password = ref("");
    const router = useRouter();
    const store = useStore();

    const login = () => {
      if (username.value === "admin" && password.value === "password") {
        console.log("Login successful");
        router.push({ name: "CameraList" });
      } else {
        alert("Invalid username and/or password");
      }
    };

    return {
      username,
      password,
      login,
    };
  },
});
</script>

<style scoped>
/* Your component styles here */
</style>
