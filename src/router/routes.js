import Index from "@/pages/index.vue";
import NotFound from "@/pages/404.vue";
import login from "@/pages/login.vue";
import Admin  from "@/layout/admin.vue";

export default [
  {
    path: "/",
    component: Admin,
    children: [
      {
        path: "/",
        component: Index,
        meta: {
          title: "后台首页",
        },
      },
    ],
  },
  { path: "/:pathMatch(.*)*", name: "NotFound", component: NotFound },
  {
    path: "/login",
    component: login,
    meta: {
      title: "登录页",
    },
  },
];
