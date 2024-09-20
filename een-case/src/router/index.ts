import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import HomeView from "../views/HomeView.vue";
import CameraListView from "@/views/CameraList.vue";
import LoginView from "@/views/LoginView.vue";
// import CallbackView from "@/views/CallbackView.vue";
import OAuthHandler from "@/views/OAuthHandler.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/about",
    name: "about",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/AboutView.vue"),
  },
  {
    path: "/camera-list",
    name: "CameraList",
    component: CameraListView,
  },
  {
    path: "/login",
    name: "login",
    component: LoginView,
  },
  {
    path: "/callback",
    name: "OAuthHandler",
    component: OAuthHandler,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
