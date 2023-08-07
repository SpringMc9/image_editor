import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/",
    name: "home",
    component: () => import("../views/index.vue"),
    children: [
      {
        path: "/",
        name: "MainCanvas",
        component: () => import("../components/MainCanvas.vue"),
      },
      {
        path: "/Adjust",
        name: "AdjustImage",
        component: () => import("../views/Adjust.vue"),
      },
      {
        path: "/Text",
        name: "TextEditor",
        component: () => import("../components/TextEditor.vue"),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
