import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'
import HomeView from '../pages/enwords/index.vue'

const router = createRouter({
    // import.meta.env.BASE_URL
    history: createWebHashHistory("/options/"),
    routes: [
        {
            path: '/',
            name: 'home',
            component: HomeView,
        },
        {
            path: '/about',
            name: 'about',
            // route level code-splitting
            // this generates a separate chunk (About.[hash].js) for this route
            // which is lazy-loaded when the route is visited.
            component: () => import('../pages/crypto_coin/index.vue'),
        },
    ],
})

export default router
