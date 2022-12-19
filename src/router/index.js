import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    redirect: "/login",
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("@/components/login/Login.vue"),
  },
  {
    path: "/home",
    name: "Home",
    component: () => import("@/components/home/Home.vue"),
  },
];

const router = new VueRouter({
  mode: "hash",
  routes,
});

// 路由守卫
router.beforeEach((to, from, next) => {
  if (to.path == "/login") {
    next();
  } else {
  }
});

export default router;
