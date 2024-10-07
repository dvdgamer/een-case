import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import CameraListView from "@/views/CameraListView.vue";
import LoginView from "@/views/LoginView.vue";
import OAuthHandler from "@/views/OAuthHandler.vue";

// Define the routes for the application
const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    redirect: "/camera-list", // Redirect root path to /camera-list
  },
  {
    path: "/camera-list",
    name: "CameraList",
    component: CameraListView, // Component to render for /camera-list
  },
  {
    path: "/login",
    name: "login",
    component: LoginView, // Component to render for /login
  },
  {
    path: "/callback",
    name: "OAuthHandler",
    component: OAuthHandler, // Component to handle OAuth callback
  },
];

// Create the router instance
const router = createRouter({
  history: createWebHashHistory(), // Use hash-based history for routing
  routes, // Pass the defined routes to the router
});

export default router; // Export the router instance for use in the application
