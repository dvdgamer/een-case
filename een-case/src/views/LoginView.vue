<template>
  <div class="login-container">
    <h1>Login</h1>
    <form @submit.prevent="handleLogin">
      <div>
        <label for="username">Username:</label>
        <input type="text" v-model="username" required />
      </div>
      <div>
        <label for="password">Password:</label>
        <input type="password" v-model="password" required />
      </div>
      <button type="submit">Login</button>
      <div v-if="errorMessage">{{ errorMessage }}</div>
    </form>
  </div>
</template>

<script>
export default {
  name: "LoginView",
  data() {
    return {
      username: "",
      password: "",
      errorMessage: "",
    };
  },
  methods: {
    async handleLogin() {
      try {
        const response = await this.$http.post("https://api.een.com/login", {
          username: this.username,
          password: this.password,
        });

        // Assuming the API response contains a token
        const token = response.data.token;

        // Save the token in Vuex store
        localStorage.setItem("token", token);

        this.$router.push("/camera-list");
      } catch (error) {
        this.errorMessage = "Invalid username or password";
      }
    },
  },
};
</script>

<style scoped>
/* Add styles here */
</style>
