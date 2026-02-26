import { createRouter, createWebHistory } from "vue-router";
import Login from "@/views/Login.vue";
import Cadastro from "@/views/Cadastro.vue";
import Home from "@/views/Home.vue";
import SendEmailReset from "@/views/SendEmailReset.vue";
import ResetPassword from "@/views/ResetPassword.vue";

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
    name: "home",
    component: Home,
    meta: { requiresAuth: true },
  },
  {
    path: "/forgot-password",
    name: "forgot-password",
    component: SendEmailReset,
  },
  {
    path: "/reset-password/:token",
    name: "reset-password",
    component: ResetPassword,
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
