import { createRouter, createWebHashHistory } from "vue-router";
import HomeView from "../pages/enwords/index.vue";

const router = createRouter({
  // import.meta.env.BASE_URL
  history: createWebHashHistory("/"),
  routes: [
    {
      path: "/",
      redirect: "/crypto_coin",
    },
    {
      path: "/words",
      name: "words",
      component: HomeView,
    },
    {
      path: "/crypto_coin",
      name: "crypto_coin",
      component: () => import("../pages/crypto_coin/index.vue"),
    },
    {
      path: "/translation",
      name: "translation",
      component: () => import("../pages/translation/index.vue"),
    },
    {
      path: "/rss",
      name: "rss",
      component: () => import("../pages/rss/index.vue"),
    },
    {
      path: "/vpn",
      name: "vpn",
      component: () => import("../pages/vpn/index.vue"),
    },
    {
      path: "/live",
      name: "live",
      component: () => import("../pages/live/index.vue"),
    },
    {
      path: "/player",
      name: "player",
      component: () => import("../pages/player/index.vue"),
    },
  ],
});

export default router;
