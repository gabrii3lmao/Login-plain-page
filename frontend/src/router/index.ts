import { createRouter, createWebHistory } from "vue-router";
import Login from "@/views/Login.vue";
import Cadastro from "@/views/Cadastro.vue";
import Home from "@/views/Home.vue";

const routes = [
  {
    path: "/signin",
    name: "login",
    component: Login,
  },
  {
    path: "/signup",
    name: "register",
    component: Cadastro,
  },
  {
    path: "/",
    name: "Home",
    component: Home,
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("token");
  if (to.meta.requiresAuth && !token) {
    next("/signin");
  } else {
    next();
  }
});

export default router;
