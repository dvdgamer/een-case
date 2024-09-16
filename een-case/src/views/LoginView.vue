<template>
  <div class="login-container">
    <h1>Login</h1>
    <button @click="redirectToLogin">Login with CameraManager</button>
  </div>
</template>

<script>
import { redirectToLogin } from "@/api";

export default {
  name: "LoginView",
  methods: {
    redirectToLogin,
  },
};
</script>

<style scoped>
.login-container {
  max-width: 400px;
  margin: 0 auto;
  padding: 1em;
  border: 1px solid #ccc;
  border-radius: 4px;
  text-align: center;
}

.login-container h1 {
  margin-bottom: 1em;
}

.login-container button {
  padding: 0.7em;
  color: #fff;
  background-color: #007bff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.login-container button:hover {
  background-color: #0056b3;
}
</style>
