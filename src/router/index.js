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
    children: [
      {
        path: "/home",
        redirect: "/welcome",
      },
      {
        path: "/welcome",
        name: "Welcome",
        component: () => import("@/components/home/Welcome.vue"),
      },
      {
        path: "/users",
        name: "Users",
        component: () => import("@/components/home/users/Users.vue"),
      },
      {
        path: "/roles",
        name: "Roles",
        component: () => import("@/components/home/roles/Roles.vue"),
      },
      {
        path: "/rights",
        name: "Rights",
        component: () => import("@/components/home/roles/Rights.vue"),
      },
      {
        path: "/goods",
        name: "Goods",
        component: () => import("@/components/home/goods/Goods.vue"),
      },
      {
        path: "/params",
        name: "Params",
        component: () => import("@/components/home/goods/Params.vue"),
      },
      {
        path: "/categories",
        name: "Categories",
        component: () => import("@/components/home/goods/Categories.vue"),
      },
      {
        path: "/orders",
        name: "Orders",
        component: () => import("@/components/home/orders/Orders.vue"),
      },
      {
        path: "/reports",
        name: "Reports",
        component: () => import("@/components/home/reports/Reports.vue"),
      },
    ],
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
    // 判断是否有token值
    if (window.sessionStorage.getItem("token") != "") {
      next();
    } else {
      next("/login");
    }
  }
});

export default router;
