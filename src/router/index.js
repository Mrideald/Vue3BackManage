import {createRouter,createWebHashHistory} from 'vue-router'
import Index from "@/pages/index.vue";
import NotFound from "@/pages/404.vue";
import login from "@/pages/login.vue";
import Admin  from "@/layout/admin.vue";
import GoodList from '@/pages/goods/list.vue'
import CategoryList from '@/pages/category/list.vue'

//默认路由 所有路由共享
const routes= [
    {
      path: "/",
      name:"admin",
      component: Admin,
    },
    { path: "/:pathMatch(.*)*",
      name: "NotFound",
      component: NotFound
    },
    {
      path: "/login",
      component: login,
      meta: {
        title: "登录页",
      },
    },
  ];

//动态路由 用于匹配菜单 动态添加路由
const asyncRoutes=[
    {
      path: "/",
      name: "/",
      component: Index,
      meta: {
        title: "后台首页",
      },
    },
    {
      path:"/goods/list",
      name:"/goods/list",
      component:GoodList,
      meta:{
        title:"商品管理"
      }
    },
    {
      path:"/category/list",
      name:"/category/list",
      component:CategoryList,
      meta:{
        title:"分类管理"
      }
    }
  ]

//动态添加路由  递归
export function addRoutes(menus){
    //是否有新路由
    let hasNewRouters=false
    //定义一个添加路由的方法 参数为传入的菜单数组
   const findAndAddRoutesByMenus=(arr)=>{
    //foreach获取到数组里的每一项
     arr.forEach(e=>{
    //找到满足条件的第一项 否则返回undefined
       let item=asyncRoutes.find(o=>o.path==e.frontpath)
       //如果有item(有这个组件) 且路由里面没有这个路由
       if(item &&!router.hasRoute(item.path)){
        //添加嵌套路由 第一个参数是父级路由名字 第二个参数是路由
          router.addRoute("admin",item)
          hasNewRouters=true
       }
       //如果存在子菜单 则再调用一次 传入数据为子菜单的数组
       if(e.child &&e.child.length>0){
         findAndAddRoutesByMenus(e.child)
       }
     })
   }
   //执行传入的数组
   findAndAddRoutesByMenus(menus)
   return hasNewRouters  //如果有新路由 把布尔值返回出去
  }


export const router=createRouter({
    history:createWebHashHistory(),
    routes
})


