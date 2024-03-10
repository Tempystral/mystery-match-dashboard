import { RouteLocationNormalized, RouteRecordRaw, createRouter, createWebHistory } from "vue-router";
import LoginComponent from "./pages/Login.vue";
import HomeComponent from "./pages/Home.vue";
import Matches from "./pages/Matches.vue";
import Players from "./pages/Players.vue";

const authenticate = (to: RouteLocationNormalized, from: RouteLocationNormalized) => {
  return true;
};

const routes: Array<RouteRecordRaw> = [
  { name: "login", path: "/login", component: LoginComponent },
  { name: "home", path: "/", component: HomeComponent, beforeEnter: authenticate },
  { name: "matches", path: "/matches", component: Matches, beforeEnter: authenticate },
  { name: "players", path: "/players", component: Players, beforeEnter: authenticate },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
