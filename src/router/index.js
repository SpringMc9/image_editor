import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import("../views/index.vue"),
    children: [
      {
        path: '/Adjust',
        name: 'AdjustImage',
        component: () => import("../views/Adjust.vue"),
      },
      {
        path: '/Watermark',
        name: 'WatermarkImage',
        component: () => import("../views/Watermark.vue"),
      }
    ]
  },
  
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
