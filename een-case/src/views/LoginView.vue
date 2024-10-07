<template>
  <div class="container">
    <!-- Display login status based on authentication state -->
    <div v-if="isAuthenticated" class="login-box">
      <h1>You are logged in! :D</h1>
    </div>
    <div v-else class="login-box">
      <h1>Login</h1>
      <!-- Button to trigger login with CameraManager -->
      <button @click="redirectToLogin">Login with CameraManager</button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { redirectToLogin } from "@/api";

export default {
  name: "LoginView",
  methods: {
    // Method to redirect user to the login page
    redirectToLogin,
  },
  computed: {
    // Map Vuex getter to check if the user is authenticated
    ...mapGetters(["isAuthenticated"]),
  },
  created() {
    // Log the authentication status when the component is created
    console.log("isAuthenticated :", this.isAuthenticated);
  },
};
</script>

<style scoped>
.container {
  display: flex;
  height: 80vh;
  justify-content: center;
  align-items: center;
}

.login-box {
  padding: 60px 100px;
  border: 1px solid #ccc;
  border-radius: 4px;
  text-align: center;
  box-shadow: 1px 5px 8px 2px rgb(237, 236, 236);
}

.login-box h1 {
  margin-bottom: 1em;
}

.login-box button {
  padding: 0.9em;
  color: #fff;
  background-color: #007bff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.login-box button:hover {
  background-color: #0056b3;
}
</style>
