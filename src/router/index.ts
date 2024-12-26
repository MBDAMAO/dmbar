import { createRouter, createWebHashHistory } from "vue-router";

const router = createRouter({
  // import.meta.env.BASE_URL
  history: createWebHashHistory("/"),
  routes: [
    {
      path: "",
      redirect: "/root",
    },
    {
      path: "/root",
      component: () => import("../components/layouts/HeaderLayout.vue"),
      children: [
        {
          path: "",
          redirect: "/root/fast_gpt",
        },
        {
          path: "settings",
          name: "settings",
          component: () => import("../pages/settings/index.vue"),
        },
        {
          path: "words",
          name: "words",
          component: () => import("../pages/enwords/index.vue"),
        },
        {
          path: "crypto_coin",
          name: "crypto_coin",
          component: () => import("../pages/crypto_coin/index.vue"),
        },
        {
          path: "translation",
          name: "translation",
          component: () => import("../pages/translation/index.vue"),
        },
        {
          path: "rss",
          name: "rss",
          component: () => import("../pages/rss/index.vue"),
        },
        {
          path: "vpn",
          name: "vpn",
          component: () => import("../pages/vpn/index.vue"),
        },
        {
          path: "live",
          name: "live",
          component: () => import("../pages/live/index.vue"),
        },
        {
          path: "fast_gpt",
          name: "fast_gpt",
          component: () => import("../pages/fast_gpt/index.vue"),
        },
      ],
    },
    {
      path: "/page",
      name: "page",
      component: () => import("@/components/layouts/SimpleLayout.vue"),
      children: [
        {
          path: "player",
          name: "player",
          component: () => import("../pages/player/index.vue"),
        },
      ],
    },
  ],
});

export default router;
