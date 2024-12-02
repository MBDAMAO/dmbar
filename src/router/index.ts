import { createRouter, createWebHashHistory } from "vue-router";
import HomeView from "../pages/enwords/index.vue";

const router = createRouter({
  // import.meta.env.BASE_URL
  history: createWebHashHistory("/"),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/about",
      name: "about",
      component: () => import("../pages/crypto_coin/index.vue"),
    },
  ],
});

export default router;
