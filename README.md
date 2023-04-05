# Vue3+vite

## 积累Space

### EventTarget.addEventListener()

> 给指定的EventTarget添加方法 （监听这个对象并触发方法） 可以是某一个对象，元素，document，window
>
> 理解 document是给本页面加 window给全局加 只在本页面用的话记得销毁
>
> ```
> addEventListener(type, listener);
> addEventListener(type, listener, options);
> 
> 参数：
> type：字符串，表示事件的类型，比如 "click"、"mousedown" 等。
> listener：函数，表示事件被触发时执行的函数。
> options：可选参数，一个布尔值，表示 listener 在捕获阶段执行还是冒泡阶段执行。
> ```



### Element: keyup event

键盘按下事件 **keyup** 事件在按键被松开时触发。回调函数接收一个参数，是关于按下键盘相关信息的

~~~
一般发生在给指定的eventtraget添加事件
比如给页面添加回车事件
document.addEventListener("keyup",(e)=>{
console.log(e)
})
~~~



### EventTarget.removeEventListener()

```
removeEventListener(type, listener);
removeEventListener(type, listener, options);
removeEventListener(type, listener, useCapture);
```

这些和添加指定的事件参数一样 你怎么添加就怎么移除

# 使用vue-router

下载路由四版本

~~~
import {
 createRouter,createWebHashHistory
} from 'vue-router'
import routes from './routes'


const router=createRouter({
    history:createWebHashHistory(),
    routes
})

export default router
~~~

再到main.js引入并且使用

# 路由的权限管理

~~~
在src下写permission.js文件专门处理权限
并在main.js引用
//引入权限管理内容
import "@/permission"

permission.js:
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
  next();
});

~~~



# 取别名@

~~~
//nodejs内置path模块 处理路径
/*
全局变量 __dirname是一个字符串,代表当前js文件所在目录的路径(绝对路径)
全局变量 __filename是一个字符串,代表当前js文件的路径(绝对路径)
*/
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({

  resolve:{
    //取别名  后面直接使用@就可以获取到src
   alias:{
    "@":path.resolve(__dirname,"src")
   }
  },
  })
~~~



# 404地址页面配置

配置404路由

~~~
import NotFound from "@/pages/404.vue";
{ path: "/:pathMatch(.*)*", //找到非配置的路由页面
    name: "NotFound",
    component: NotFound
  },
~~~

~~~
<template>
  <div>
    <el-result
      icon="warning"
      title="404提示"
      sub-title="你找的页面走丢了~"
    >
      <template #extra>
        <el-button  type="primary" @click="this.$router.push('/')">点击回到首页</el-button>
      </template>
    </el-result>
  </div>
</template>
~~~



# 响应式布局

基于element ui 的layout布局

~~~
通过基础的 24 分栏，迅速简便地创建布局 把页面分成二十四份 每份占多少
  <el-row>
    <el-col :span="24"><div class="grid-content ep-bg-purple-dark" /></el-col>
  </el-row>
  <el-row>
    <el-col :span="12"><div class="grid-content ep-bg-purple" /></el-col>
    <el-col :span="12"><div class="grid-content ep-bg-purple-light" /></el-col>
  </el-row>
  <el-row>
    <el-col :span="8"><div class="grid-content ep-bg-purple" /></el-col>
    <el-col :span="8"><div class="grid-content ep-bg-purple-light" /></el-col>
    <el-col :span="8"><div class="grid-content ep-bg-purple" /></el-col>
  </el-row>
  <el-row>
    <el-col :span="6"><div class="grid-content ep-bg-purple" /></el-col>
    <el-col :span="6"><div class="grid-content ep-bg-purple-light" /></el-col>
    <el-col :span="6"><div class="grid-content ep-bg-purple" /></el-col>
    <el-col :span="6"><div class="grid-content ep-bg-purple-light" /></el-col>
  </el-row>
  <el-row>
    <el-col :span="4"><div class="grid-content ep-bg-purple" /></el-col>
    <el-col :span="4"><div class="grid-content ep-bg-purple-light" /></el-col>
    <el-col :span="4"><div class="grid-content ep-bg-purple" /></el-col>
    <el-col :span="4"><div class="grid-content ep-bg-purple-light" /></el-col>
    <el-col :span="4"><div class="grid-content ep-bg-purple" /></el-col>
    <el-col :span="4"><div class="grid-content ep-bg-purple-light" /></el-col>
  </el-row>
~~~

~~~
当页面大小改变时 页面布局会错乱

响应式布局：
<el-row :gutter="10">
    <el-col :xs="8" :sm="6" :md="4" :lg="3" :xl="1"
      ><div class="grid-content ep-bg-purple"
    /></el-col>
    <el-col :xs="4" :sm="6" :md="8" :lg="9" :xl="11"
      ><div class="grid-content ep-bg-purple-light"
    /></el-col>
    <el-col :xs="4" :sm="6" :md="8" :lg="9" :xl="11"
      ><div class="grid-content ep-bg-purple"
    /></el-col>
    <el-col :xs="8" :sm="6" :md="4" :lg="3" :xl="1"
      ><div class="grid-content ep-bg-purple-light"
    /></el-col>
  </el-row>
  
  当页面宽度大于多少时显示几比几的布局
  
  
~~~

~~~
xs	<768px 响应式栅格数或者栅格属性对象	number / object
—
sm	≥768px 响应式栅格数或者栅格属性对象	number / object
—
md	≥992px 响应式栅格数或者栅格属性对象	number/ object
—
lg	≥1200px 响应式栅格数或者栅格属性对象	number/ object
—
xl	≥1920px 响应式栅格数或者栅格属性对象	number/ object
—
~~~



# 处理表单验证

~~~html
//写一个ref=formRef
<el-form ref="formRef" :model="form" :rules="rules" class="w-[250px]">
        <el-form-item prop="username">
          <el-input v-model="form.username" placeholder="请输入用户名">
            <template #prefix>
              <el-icon><user /></el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="form.password"
            type="password"
            show-password
            placeholder="请输入密码"
          >
            <template #prefix>
              <el-icon><lock /></el-icon>
            </template>
          </el-input>
        </el-form-item>

      </el-form>

获取到formRef
//同名          和ref()一样 
const formRef=ref(null)

获取到之后用组件的方法

formRef.value.validate((valid) => {
//如果都填了 valid是true

}


~~~

~~~
补:
Vue3中可以使用ref来获取组件中的ref，可以使用ref来获取组件实例，以及组件内部的元素，例如：

```
<template>
  <div>
    <MyComponent ref="myComponent" />
  </div>
</template>

<script>
export default {
  setup() {
    const myComponent = ref(null);
    return {
      myComponent
    };
  }
};
</script>
```

在上面的代码中，我们可以使用`this.myComponent`来获取MyComponent组件的实例，也可以使用`this.$refs.myComponent`来获取MyComponent组件内部的元素。
~~~



# 处理路由跳转

~~~
组件内引入useRouter
import {useRouter} from 'vue-router'

const router=useRouter()  //用一个接收

后面就是正常使用路由了
router.push(..)

~~~



# 写api

1. 配置代理处理跨域

   ~~~
   export default defineConfig({
   ...
   server:{
      proxy:{
       '/api': {
         target: 'http://ceshi13.dishait.cn',  //baseUrl
         changeOrigin: true,
         rewrite: (path) => path.replace(/^\/api/, ''),
       },
      }
     },
   })
   ~~~

   

2. 创建axios.js文件，二次封装axios

   ~~~
   import axios from 'axios'
   
   const request=axios.create({
       baseURL:'/api'   //用/api代替了基础路径
   })
   
   
   export default request
   ~~~

3. 编写请求

   创建api文件夹,编写某个组件的api就专门创一个文件夹

   ~~~
   manage.js
   
   
   import axios from '@/axios'//引入axios
   
   export function login(username,password){
      return axios.post('/admin/login',{username,password})
   }
   
   ~~~

4. 使用接口

   ~~~js
   const onSubmit = () => {
     formRef.value.validate((valid) => {
       if (!valid) {
         return false;
       } else {
         login(form.username, form.password)
           .then((res) => {
             console.log(res.data.data);
             //提示成功
             ElNotification({
               type: "success",
               duration: 3000,
               message:"登录成功",
               position: "top-right",
             });
             //存储token和用户相关的信息
   
             //跳转到后台首页
             router.push('/')
           })
           .catch((err) => {
             ElNotification({
               type: "error",
               duration: 3000,
               message: err.response.data.msg || "请求失败",
               position: "top-right",
             });
           });
       }
     });
   ~~~



# 使用vueuse下的包进行cookie管理

> ```bash
> npm i @vueuse/integrations
> ```

先下载上面这个

> npm i universal-cookie

使用

import { useCookies } from '@vueuse/integrations/useCookies'

~~~
const cookies=useCookies()
function setting(){
    cookies.set('admin-token','123456')
}
function get(){
    console.log(cookies.get('admin-token','123456'))
}
function dele(){
    cookies.remove('admin-token','123456')
}
~~~

~~~
<el-button @click="setting">设置</el-button>
<el-button @click="get">获取</el-button>
<el-button @click="dele">删除</el-button>
~~~



# 使用vuex

~~~js
下载
npm install vuex@next --save

store/index.js
--------------------------------------------------------
import { createStore } from 'vuex'

// 创建一个新的 store 实例
const store = createStore({
  state () {
    return {
   //用户信息
   user:{}
    }
  },
  mutations: {
    //记录用户信息
    SET_USERINFO(state,user){
        state.user=user
    }
  }
})
export default store
~~~



~~~
使用里面的数据  组件内引用并且实例化
import {useStore} from 'vuex'

...
const store =useStore()
...
store.commit("SET_USERINFO",res2)
~~~

# promise及其使用

~~~
Promise是一种异步编程的解决方案，它可以让异步操作以同步的方式进行，使得代码更加简洁。Promise对象有三种状态：pending（进行中）、fulfilled（已成功）和rejected（已失败）。

使用Promise的步骤：

1. 创建Promise对象：使用new Promise()构造函数创建Promise对象，传入一个函数作为参数，该函数有两个参数，分别是resolve和reject，用于控制Promise对象的状态。

2. 调用Promise对象的then()方法：then()方法接收两个参数，分别是resolve和reject，用于指定Promise对象状态变为fulfilled时执行的回调函数和状态变为rejected时执行的回调函数。

3. 调用Promise对象的catch()方法：catch()方法用于指定Promise对象变为rejected状态时执行的回调函数。

4. 调用Promise对象的finally()方法：finally()方法用于指定不管Promise对象最后状态如何，都会执行的操作。


~~~



# 刷新之后数据没有的情况

可以将请求写在vuex中 并存储 再在全局路由守卫或其他写下每次进入都发请求获取数据

例子

~~~
router.beforeEach(async(to, from, next) => {
....

//如果用户登录了，自动获取用户信息并存储在vuex中
  if(token){
   await store.dispatch("getInfo")
  }
  }
....
~~~



# 给登录添加回车事件

~~~
//监听回车事件
function onKeyUp(e){
  if(e.key=="Enter"){
    onSubmit()
  }
}
//挂载完毕后添加事件
onMounted(()=>{
  document.addEventListener("keyup",onKeyUp)
})

//移除键盘监听
onBeforeUnmount(()=>{
  document.removeEventListener("keyup",onKeyUp)
})
~~~



# 发请求获取数据的方式



写一个dispatch,xxx触发action

然后在action中

~~~
如果发请求之后在组件内还有后续操作可以在action中返回一个new promise

//退出登录   action
    logOut({commit}){  //等于是promise包了个promise  比商城项目有更高的容错性
      return new Promise((resolve,reject)=>{  成功和失败的返回
        logOut().then(res=>{   //请求成功后的then 
          //移除token
          removeToken()
          //删除用户信息
          commit("SET_USERINFO","")
          resolve(res)  //返回请求成功的数据
        }).catch(err=>reject(err))  //如果失败的话返回错误 
      })
    }
  }
})

//mutations 后续都是一样 mutations作为中介传到action 和state的值
~~~

组件内后续操作可以用then  因为action返回的是promise

~~~
store.dispatch('logOut').then(res=>{
    toast("退出登录成功")
    //跳转回登录页
    router.push('/login')
})
~~~



# 进度条

Nprogress

~~~
下载
npm i nprogress
~~~

~~~
NProgress.start();
NProgress.done();
进度条开始和结束
~~~

~~~
//vue3进度条nprogress写在axios二次封装中还是写在main.js中好

一般来说，建议将NProgress写在axios二次封装中，因为axios二次封装中可以更好地控制请求和响应，从而更好地控制进度条的显示和隐藏。

~~~

~~~
写在axios二次封装中
~~~

~~~
....
//引入进度条
import nprogress from 'nprogress';
//引入进度条样式
import "nprogress/nprogress.css";
....


请求拦截器内写下
   //start 进度条开始
    nprogress.start();
    
    响应拦截器内写下
    //done 进度条结束
   nprogress.done();
~~~

> 此课二次封装然后写在路由前置中 路由跳转都会有进度条

~~~
封装
//进度条封装 全屏loading

export function showFullLoading(){
 nprogress.start();
}

export function hideFullLoading(){
  nprogress.done();
 }
~~~

使用

~~~
//全局前置守卫
router.beforeEach(async(to, from, next) => {
   //显示loading
   showFullLoading()
   ....
   });
//全局后置守卫
//关闭进度条
router.afterEach((to,from)=>hideFullLoading())
~~~

# 动态标题实现

给路由设置meta:{title:“名字”}

~~~
在路由前置守卫中
let title=to.meta.title   可以适当加判断 如果没有标题就显示空
let title=(to.meta.title?to.meta.title:"")+"-EdgeDiary后台管理系统"
document.title=title
~~~



# 页面布局

~~~
创建layout文件夹
写下主页面.vue
<template>
  <el-container>
    <el-header>
      <f-header />
    </el-header>
    <el-container>
      <el-aside>
        <f-menu />
      </el-aside>
      <el-main>
        <f-tag-list />
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import FHeader from './components/FHeader.vue'
import FMenu from './components/FMenu.vue'
import FTagList from './components/FTagList.vue'
</script>
components就在此文件夹下创建
以上是布局内容 
~~~

# 全屏显示

> 使用vueuse 
>
> 先下载核心 

~~~
npm i @vueuse/core
再引入
import { useFullscreen } from '@vueuse/core'
注册
const {
  //是否全屏状态
   isFullscreen,
   //进入全屏
   //enter,
   //退出全屏
   //exit,
   //切换全屏
   toggle } = useFullscreen()
   
   使用
      <el-tooltip
        effect="dark"
        :content="isFullscreen? '退出全屏':'全屏' "
        placement="bottom">
      <el-icon @click="handleFullScreen" class="icon-btn">
        <Aim v-if="isFullscreen" />
        <full-screen v-if="!isFullscreen" />
      </el-icon>
      </el-tooltip>
~~~

