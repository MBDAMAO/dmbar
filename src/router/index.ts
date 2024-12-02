import { createRouter, createWebHashHistory } from "vue-router";
import HomeView from "../pages/enwords/index.vue";

const router = createRouter({
  // import.meta.env.BASE_URL
  history: createWebHashHistory("/"),
  routes: [
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
  ],
});

export default router;
