//处理权限问题
import { router } from "@/router";
import { getToken } from "@/composables/auth";
import { toast, showFullLoading, hideFullLoading } from "@/composables/util";
import store from "@/store";
//引入动态添加路由的方法
import { addRoutes } from "@/router";

//全局前置守卫
//定义一个变量 如果已经获取了info就不再获取了 不然每次路由跳转都要执行这个
let hasGetInfo=false
router.beforeEach(async (to, from, next) => {
  //显示loading
  showFullLoading();

  const token = getToken();
  if (!token && to.path != "/login") {
    toast("请先登录", "error");
    return next({ path: "/login" });
  }

  //防止重复登录
  if (token && to.path == "/login") {
    return next({ path: from.path ? from.path : "/" });
  }

  //如果用户登录了，自动获取用户信息并存储在vuex中
  let hasNewRoutes = false;
  if (token&&!hasGetInfo) {
    //让这个变量为true 不再获取info和动态添加路由
    hasGetInfo=true
    let { menus } = await store.dispatch("getInfo");
    //动态添加路由  hasNewRoutes判断是否动态添加了路由
    hasNewRoutes = addRoutes(menus);
  }

  //设置页面标题
  let title = (to.meta.title ? to.meta.title : "") + "-EdgeDiary后台管理系统";
  document.title = title;

//如果动态添加了路由 则访问指定路由 因为如果访问的指定路由为动态路由 所以要next(to.fullpath) 指定访问 否则next（）
  hasNewRoutes ? next(to.fullPath) : next();
});

//全局后置守卫
//关闭进度条
router.afterEach((to, from) => hideFullLoading());
