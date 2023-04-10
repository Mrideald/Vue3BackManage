import Index from "@/pages/index.vue";
import NotFound from "@/pages/404.vue";
import login from "@/pages/login.vue";
import Admin  from "@/layout/admin.vue";
import GoodList from '@/pages/goods/list.vue'
import CategoryList from '@/pages/category/list.vue'

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
      {
        path:"/goods/list",
        component:GoodList,
        meta:{
          title:"商品管理"
        }
      },
      {
        path:"/category/list",
        component:CategoryList,
        meta:{
          title:"分类管理"
        }
      }
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
