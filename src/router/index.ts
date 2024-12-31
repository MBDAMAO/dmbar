import { createRouter, createWebHashHistory } from "vue-router";

const router = createRouter({
  // import.meta.env.BASE_URL
  history: createWebHashHistory("/"),
  routes: [
    {
      path: "",
      redirect: "/start",
    },
    {
      path: "/start",
      name: "start",
      component: () => import("@/components/layouts/SimpleLayout.vue"),
      children: [
        {
          path: "",
          redirect: "/start/start_page",
        },
        {
          path: "start_page",
          name: "start_page",
          component: () => import("@/pages/app_start/index.vue"),
        },
      ],
    },
    {
      path: "/root",
      component: () => import("@/components/layouts/HeaderLayout.vue"),
      children: [
        {
          path: "",
          redirect: "/root/videos",
        },
        {
          path: "settings",
          name: "settings",
          component: () => import("@/pages/settings/index.vue"),
        },
        {
          path: "words",
          name: "words",
          component: () => import("@/pages/enwords/index.vue"),
        },
        {
          path: "crypto_coin",
          name: "crypto_coin",
          component: () => import("@/pages/crypto_coin/index.vue"),
        },
        {
          path: "translation",
          name: "translation",
          component: () => import("@/pages/translation/index.vue"),
        },
        {
          path: "rss",
          name: "rss",
          component: () => import("@/pages/rss/index.vue"),
        },
        {
          path: "vpn",
          name: "vpn",
          component: () => import("@/pages/vpn/index.vue"),
        },
        {
          path: "live",
          name: "live",
          component: () => import("../pages/live/index.vue"),
        },
        {
          path: "videos",
          name: "videos",
          component: () => import("@/pages/videos/index.vue"),
          redirect: "/root/videos/rcmd",
          children: [
            {
              path: "rcmd",
              name: "rcmd",
              component: () =>
                import("@/pages/videos/ContentContainer/index.vue"),
            },
            {
              path: "search",
              name: "search",
              component: () =>
                import("@/pages/videos/SearchContainer/index.vue"),
            },
            {
              path: "search_page",
              name: "search_page",
              component: () => import("@/pages/videos/SearchPage/index.vue"),
            },
          ],
        },
        {
          path: "help",
          name: "help",
          component: () => import("@/pages/help_feedback/index.vue"),
        },
        {
          path: "test",
          name: "test",
          component: () => import("@/pages/test/index.vue"),
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
          component: () => import("@/pages/player/index.vue"),
        },
      ],
    },
  ],
});

export default router;
