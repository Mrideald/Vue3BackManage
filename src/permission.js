//处理权限问题
import router from "@/router";
import { getToken } from "@/composables/auth";
import { toast,showFullLoading,hideFullLoading } from "@/composables/util";
import store from '@/store'

//全局前置守卫
router.beforeEach(async(to, from, next) => {
   //显示loading
   showFullLoading()

  const token = getToken();
  if (!token && to.path != "/login") {
    toast("请先登录", "error");
    return next({path:"/login"});
  }

  //防止重复登录
  if (token && to.path == "/login") {
    return next({path:from.path ? from.path : "/"});
  }

  //如果用户登录了，自动获取用户信息并存储在vuex中
  if(token){
   await store.dispatch("getInfo")
  }

  //设置页面标题
  let title=(to.meta.title?to.meta.title:"")+"-EdgeDiary后台管理系统"
  document.title=title
  next();
});

//全局后置守卫
//关闭进度条
router.afterEach((to,from)=>hideFullLoading())
