import { createRouter, createWebHashHistory } from "vue-router";
//直接在下面写回调函数不知道为什么会报错
const NotFound = () => import("@/pages/404.vue");
const login = () => import("@/pages/login.vue");
const Admin = () => import("@/layout/admin.vue");
const Index= () => import("@/pages/index.vue")
const Category = () => import("@/pages/category/list.vue");
const Goods=()=> import("@/pages/goods/list.vue")
const UserList = () => import("@/pages/user/list.vue");
const OrderList = () => import("@/pages/order/list.vue");
const CommentList = () => import("@/pages/comment/list.vue");
const ImageList = () => import("@/pages/image/list.vue");
const NoticeList = () => import("@/pages/notice/list.vue");
const SettingBase = () => import("@/pages/setting/base.vue");
const CouponList=()=>import("@/pages/coupon/list.vue")
const ManagerList=()=>import('@/pages/manager/list.vue')
//默认路由 所有路由共享
const routes = [
  {
    path: "/",
    name: "admin",
    component: Admin,
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

//动态路由 用于匹配菜单 动态添加路由
const asyncRoutes = [
  {
    path: "/",
    name: "/",
    component:Index,
    meta: {
      title: "后台首页",
    },
  },
  {
    path: "/goods/list",
    name: "/goods/list",
    component:Goods,
    meta: {
      title: "商品管理",
    },
  },
  {
    path: "/category/list",
    name: "/category/list",
    component: Category,
    meta: {
      title: "分类列表",
    },
  },
  {
    path: "/user/list",
    name: "/user/list",
    component: UserList,
    meta: {
      title: "用户列表",
    },
  },
  {
    path: "/order/list",
    name: "/order/list",
    component: OrderList,
    meta: {
      title: "订单列表",
    },
  },
  {
    path: "/comment/list",
    name: "/comment/list",
    component: CommentList,
    meta: {
      title: "评价列表",
    },
  },
  {
    path: "/image/list",
    name: "/image/list",
    component: ImageList,
    meta: {
      title: "图库列表",
    },
  },
  {
    path: "/notice/list",
    name: "/notice/list",
    component: NoticeList,
    meta: {
      title: "公告列表",
    },
  },
  {
    path: "/setting/base",
    name: "/setting/base",
    component: SettingBase,
    meta: {
      title: "配置",
    },
  },
  {
    path: "/coupon/list",
    name: "/coupon/list",
    component: CouponList,
    meta: {
      title: "优惠券列表",
    },
  },
  {
    path: "/manager/list",
    name: "/manager/list",
    component: ManagerList,
    meta: {
      title: "管理员管理",
    },
  },
];
//动态添加路由  递归
export function addRoutes(menus) {
  //是否有新路由
  let hasNewRouters = false;
  //定义一个添加路由的方法 参数为传入的菜单数组
  const findAndAddRoutesByMenus = (arr) => {
    //foreach获取到数组里的每一项
    arr.forEach((e) => {
      //找到满足条件的第一项 否则返回undefined
      let item = asyncRoutes.find((o) => o.path == e.frontpath);
      //如果有item(有这个组件) 且路由里面没有这个路由
      if (item && !router.hasRoute(item.path)) {
        //添加嵌套路由 第一个参数是父级路由名字 第二个参数是路由
        router.addRoute("admin", item);
        hasNewRouters = true;
      }
      //如果存在子菜单 则再调用一次 传入数据为子菜单的数组
      if (e.child && e.child.length > 0) {
        findAndAddRoutesByMenus(e.child);
      }
    });
  };
  //执行传入的数组
  findAndAddRoutesByMenus(menus);
  return hasNewRouters; //如果有新路由 把布尔值返回出去
}

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
});
