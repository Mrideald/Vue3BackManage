#  Vue3+vite



难点：封装组件 formDrawer 面试前看懂

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

### 获取模板中组件的方式

~~~
  <form-drawer ref="formDrawerRef">
    123
  </form-drawer>
  
  <script setup>
  import FormDrawer from '@/components/FormDrawer.vue'
  //控制修改密码框
   const formDrawerRef=ref(null);
   后续可以使用组件内的方法
  </script>
~~~

### 模板中动态绑定图标

~~~
<el-icon>
  <component :is="item.icon"></component>
</el-icon>
~~~

### 检查路由是否存在

- [`router.hasRoute()`](https://router.vuejs.org/zh/api/interfaces/Router.html#Methods-hasRoute)：检查路由是否存在。

 参数为路由的名字 name 返回值为布尔值

+ router.getRoutes():获取当前所有路由	



### 直接用elementui的class写样式无效问题

~~~
elementui的样式都添加了scoped属性，以确保它们只适用于当前组件，不会影响全局样式。这是一种常见的Vue组件样式隔离方法。

element标签上的class写样式无效     深度选择器
在vue中，我们为了避免父组件的样式影响到子组件的样式，会在 <style> 标签上设置scoped属性，这样它的 CSS 只会应用到当前组件的元素上，即使父组件中有跟子组件相同的class名称或者选择器的时候，也不会影响到子组件的样式。
但是有的时候我们需要在一个组件中改变被引入组件的样式（即父组件改变子组件的样式），直接使用class命名改变样式没有任何反应，这种情况就需要使用/deep/或::v-deep vue3中:deep()了。

~~~

~~~

:deep(.el-tabs__header){
    @apply mb-0;
}
在前面用:deep包裹起class名字 并且要在style中加入scoped
~~~

~~~
正常使用

    :deep(.el-input__wrapper) {
      box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.1) inset;
      background: rgba(0, 0, 0, 0.1);
    }
    :deep(.el-input-group--append > .el-input__wrapper) {
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
    }
    :deep(.el-input-group--prepend > .el-input__wrapper) {
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
    }
~~~

### onBeforeRouteUpdate

路由更新之前可以做的一些事情

import {onBeforeRouteUpdate} from 'vue-router'

> *//添加一个新的标签导航*

onBeforeRouteUpdate((*to*,*from*)=>{

​    activeTab.value=*to*.path

   addTags({title:*to*.meta.title,path:*to*.path});

})





### KeepAlive

缓存包裹在其中的动态切换组件。

- **Props**

  ts

  ```ts
  interface KeepAliveProps {
    /**
     * 如果指定，则只有与 `include` 名称
     * 匹配的组件才会被缓存。
     */
    include?: MatchPattern
    /**
     * 任何名称与 `exclude`
     * 匹配的组件都不会被缓存。
     */
    exclude?: MatchPattern
    /**
     * 最多可以缓存多少组件实例。
     */
    max?: number | string
  }
  
  type MatchPattern = string | RegExp | (string | RegExp)[]
  ```

- **详细信息**

  `<KeepAlive>` 包裹动态组件时，会缓存不活跃的组件实例，而不是销毁它们。

  任何时候都只能有一个活跃组件实例作为 `<KeepAlive>` 的直接子节点。

  当一个组件在 `<KeepAlive>` 中被切换时，它的 `activated` 和 `deactivated` 生命周期钩子将被调用，用来替代 `mounted` 和 `unmounted`。这适用于 `<KeepAlive>` 的直接子节点及其所有子孙节点。

- **示例**

  基本用法：

  template

  ```
  <KeepAlive>
    <component :is="view"></component>
  </KeepAlive>
  ```

  与 `v-if` / `v-else` 分支一起使用时，同一时间只能有一个组件被渲染：

  template

  ```
  <KeepAlive>
    <comp-a v-if="a > 1"></comp-a>
    <comp-b v-else></comp-b>
  </KeepAlive>
  ```

  与 `<Transition>` 一起使用：

  template

  ```
  <Transition>
    <KeepAlive>
      <component :is="view"></component>
    </KeepAlive>
  </Transition>
  ```

  使用 `include` / `exclude`：

  template

  ```
  <!-- 用逗号分隔的字符串 -->
  <KeepAlive include="a,b">
    <component :is="view"></component>
  </KeepAlive>
  
  <!-- 正则表达式 (使用 `v-bind`) -->
  <KeepAlive :include="/a|b/">
    <component :is="view"></component>
  </KeepAlive>
  
  <!-- 数组 (使用 `v-bind`) -->
  <KeepAlive :include="['a', 'b']">
    <component :is="view"></component>
  </KeepAlive>
  ```

  使用 `max`：

  template

  ```
  <KeepAlive :max="10">
    <component :is="view"></component>
  </KeepAlive>
  ```

例子：

~~~
<!-- v-slot解构到渲染的动态组件 -->
<router-view v-slot="{ Component }">
<!-- 只允许缓存十个，超过十个了最久没有访问的那一个会被销毁 -->
<keep-alive :max="10">
<component :is="Component"></component>
</keep-alive>
</router-view>
~~~

### router-view的几个属性

~~~
<router-view> 标签有以下几个属性：

name：用于命名路由视图。当你需要在同一个组件中渲染多个 <router-view> 时，可以通过 name 属性来区分它们。

:key：用于强制重新渲染路由视图。当你需要动态地更改路由参数（例如从 /user/1 切换到 /user/2）时，可以通过给 <router-view> 组件添加 :key 属性来触发重新渲染。

v-slot：用于定义具名插槽，以便在路由组件中传递数据。例如，你可以使用以下方式向路由组件传递数据：
获取到当前路由信息
<router-view v-slot="{ route }">
  <h1>{{ route.meta.title }}</h1>
</router-view>
```

在上面的例子中，`v-slot` 属性允许你从路由组件中解构出 `route` 参数，并将 `route.meta.title` 渲染为标题。
~~~



### component标签

~~~
在Vue中，<component> 标签是一个动态组件，它允许你在父组件中根据不同的条件渲染不同的子组件。具体来说， <component> 标签会根据 is 属性的值来确定要渲染的组件类型。例如：

<component :is="componentType"></component>
在上面的例子中，componentType 是一个 data 属性，它的值决定了要渲染的组件类型。如果 componentType 的值为 "my-component"，那么 <component> 就会渲染 <my-component> 组件。如果 componentType 的值为 "other-component"，那么 <component> 就会渲染 <other-component> 组件。

<component> 标签也支持使用 v-bind 指令绑定其他属性，例如 class、style 等。这些属性会被传递给被渲染的组件。例如：

<component :is="componentType" class="my-class" :style="{ color: textColor }"></component>
在上面的例子中，被渲染的组件会继承 <component> 标签的 class 和 style 属性，同时也可以在子组件中使用这些属性。
~~~





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



# defineProps() 和 defineEmits() defineExpose()

setup语法糖内使用 的props 以及自定义事件 暴露组件内方法

~~~
defineProps():

在Vue 3中，定义组件的props属性有了新的方式，即使用defineProps() API来定义，它接收一个对象作为参数，对象的属性为props的名称，值为定义的类型和默认值等。defineProps()的作用是定义组件的props属性，通过这个方法定义的props属性会被Vue 3编译器静态分析，这样可以优化组件性能。

defineEmits():

在Vue 3中，定义组件的自定义事件有了新的方式，即使用defineEmits() API来定义，它接收一个数组作为参数，数组的元素为事件名称，这些事件名称是组件可以触发的自定义事件。通过这个方法定义的自定义事件会被Vue 3编译器静态分析，这样可以优化组件性能。

defineExpose():

在Vue 3中，定义组件的公共API有了新的方式，即使用defineExpose() API来定义，它接收一个对象作为参数，对象的属性为组件的公共API名称，值为对应的方法或属性等。通过这个方法定义的公共API会被Vue 3编译器静态分析，这样可以优化组件性能。同时，使用这个方法可以更好地控制组件暴露的API，避免组件内部的实现细节被外部访问到，提高组件的封装性。
~~~

~~~
例子
封装组件内 defineProps()使用
<script setup>
...

直接使用里面的数据在模板中  可以用props接收也可以不用
const props=defineProps({
    title:String,
    size:{
        type:String,
        default:"45%"
    },
    destroyOnClose:{
      type:Boolean,
      default:false
    },
    comfirmText:{
        type:String,
        default:"提交"
    }
})
...
</script>


在使用组件的地方传值 和之前一样
~~~

~~~
自定义事件 defineEmits():
封装组件内：
 <el-button type="primary" @click="submit" :loading="loading">提交</el-button>
 
 //可以理解为定义自定义事件 前面的const emit可写可不写
 放出自定义事件 const emit = defineEmits(['submit'])  //可以写多个事件
 
 封装组件内写一个点击事件  可以理解为放出自定义事件
 回调写为调用这个点击事件const submit=()=>emit("submit")  //使用自定义事件
 上面这个写法可以简化在button里面 免得写多个自定义事件都要写个这个
 <el-button type="primary" @click="$emit('submit')" :loading="loading">提交</el-button>
 
 调用自定义事件  组件标签内
  <form-drawer ref="formDrawerRef" title="修改密码"@submit="onSubmit">
 
 写下自定义事件内容
 const onSubmit = () => {
/////......
};

总结四步
1.定义自定义事件defineEmits(['submit'])
2.放出定义事件 <button @click="$emit('submit')></button>		
3.组件标签内使用自定义事件 <form-drawer ref="formDrawerRef" title="修改密码"@submit="onSubmit">
4.事件回调函数 OnSubmit()写在使用改组件的地方
~~~

~~~
defineExpose() 暴露组件内属性和方法 在其他使用这个组件的地方调用
//暴露方法
defineExpose({
    open,
    close,
    showLoading,
    hideLoading
})

//使用这些方法
  <form-drawer ref="formDrawerRef" title="修改密码" @submit="onSubmit">
  </form-drawer>
  
  上面为组件 
  获取组件
  const formDrawerRef=ref(null)
  使用组件的方法 formDrawer.value.open()  以此类推
~~~



# 封装方法 

> 一个功能完成之后 可以将所用的方法全部集合到一个函数中 函数返回值为这些方法 可以单独携程一个文件封装
>
> 再引入这些方法即可   组合式API方法

~~~
封装登录和修改密码方法  返回方法名

import { updatePassword } from "@/api/manager.js";
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import { toast } from "@/composables/util.js";
import { useStore } from "vuex";

export default function useRepassword() {
  const router = useRouter();
  const store = useStore();

  const formRef = ref(null);
  //控制修改密码框
  const formDrawerRef = ref(null);

  const form = reactive({
    oldpassword: "",
    password: "",
    repassword: "",
  });

  const rules = {
    oldpassword: [
      {
        required: true,
        message: "旧密码不能为空",
        trigger: "blur",
        //触发时机
      },
    ],
    password: [
      {
        required: true,
        message: "新密码不能为空",
        trigger: "blur",
        //触发时机
      },
    ],
    repassword: [
      {
        required: true,
        message: "确认密码不能为空",
        trigger: "blur",
        //触发时机
      },
    ],
  };

  const onSubmit = () => {
    formRef.value.validate((valid) => {
      if (!valid) {
        return false;
      } else {
        formDrawerRef.value.showLoading();
        //修改密码
        updatePassword(form)
          .then((res) => {
            toast("修改密码成功,请重新登录");
            store.dispatch("logOut").then((res) => {
              router.push("/login");
            });
          })
          .finally(() => {
            formDrawerRef.value.hideLoading();
          });
      }
    });
  };

  //处理修改密码
  const handleUpdataPaw = () => {
    formDrawerRef.value.open();
  };
  return {
    formDrawerRef,
    form,
    rules,
    onSubmit,
    formRef,
    handleUpdataPaw,
  };
}

引入使用
import useRepassword from "@/composables/useManager.js";
使用
const { formDrawerRef, form, rules, onSubmit, formRef, handleUpdataPaw } =
 useRepassword();

使用方法和之前一样 任何功能都可以参照这个实现 可以优化代码 然后利于维护
~~~



# 菜单收缩问题

> ​	点击收缩按钮后让菜单收缩

~~~
现在vuex的state中存一下原来的菜单宽度
state:{
  //侧边宽度
   asideWidth:"250px",
   }
   
   mutations中添加修改的方法
   //展开/缩起侧边
    handleAsideWidth(state){
      state.asideWidth=state.asideWidth=="250px"?"64px":"250px"
    },
    如果他是250px 则修改为64px
    
    
    方法添加好之后去设置点击事件
     @click="$store.commit('handleAsideWidth')"  实现宽度的改变
     
     宽度改变之后样式还是有问题 文字还是在显示
     下面用的elementui的collapse方法 :collapse="isCollapse"
     //是否折叠
     const isCollapse=computed(()=>!(store.state.asideWidth=='250px'))
     
     有一些属性去研究一下 比如动画显示太慢会有点问题 可以取消这个动画自己写一个动画
     transition: all 0.2s;
     
     第二个问题是这边宽度变小之后 右边的元素要过来
     给el-aside设置宽度为 <el-aside :width="$store.state.asideWidth">
     并且给整个侧边添加动画
     .el-aside{
     transition: all 0.2s;
      }
      
      /* 隐藏滚动条 */
    .f-menu::-webkit-scrollbar{
       width: 0;
      }
~~~

2. 刷新之后路由还是原来的样子的问题

   ~~~
   :default-active="defaultActive" el-menu的属性
   
   import {useRouter,useRoute} from 'vue-router'
   const route=useRoute()
   const defaultActive=ref(route.path)
   ~~~



# 添加动态路由

实现根据后端传回来的数据，传回来什么就添加什么路由

## 添加路由

动态路由主要通过两个函数实现。`router.addRoute()` 和 `router.removeRoute()`。它们**只**注册一个新的路由，也就是说，如果新增加的路由与当前位置相匹配，就需要你用 `router.push()` 或 `router.replace()` 来**手动导航**，才能显示该新路由。

~~~
添加路由只能一个个添加 router.addRoute() 添加之后跳转这些路由的时候只能用push或者replace跳转才会显示这些路由 如果不是会导致无法显示的问题

~~~

## 动态添加

~~~
默认路由 所有组件共享的路由 比如主页面还有登录页 404页这些要实实在在的注册使用
​~~~
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
  
  ...
  export const router=createRouter({
    history:createWebHashHistory(),
    routes
   })
  ...

//动态路由 用于匹配菜单 动态添加路由，路由的信息都是由后端穿过来然后渲染的 如果有路由组件要注册，则在这里写信息，不直接写在routes里面注册使用，这里写之后在后面动态匹配，匹配上了如果有这个组件在这里注册了，但是路由router里面没有的话就要动态添加上去 
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
  

~~~

~~~js
//添加路由的方法
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
         findAndAddRoutesByMenus(e.child)  //递归
       }
     })
   }
   //执行传入的数组 
   findAndAddRoutesByMenus(menus)
   //console.log(router.getRoutes())
   return hasNewRouters  //如果有新路由 把布尔值返回出去
  }
~~~

~~~
在路由前置守卫中调用
//引入动态添加路由的方法
import { addRoutes } from "@/router";
...
router.beforeEach(async (to, from, next)=>{
//如果用户登录了，自动获取用户信息并存储在vuex中
  let hasNewRoutes = false;//判断是否有新路由添加过啊来
  if (token) {
    let { menus } = await store.dispatch("getInfo");
    //动态添加路由  hasNewRoutes判断是否动态添加了路由
    hasNewRoutes = addRoutes(menus);  //返回值为true就表示有新路由添加过来
  }
  ...
/如果动态添加了路由 则访问指定路由 因为如果访问的指定路由为动态路由 所以要next(to.fullpath) 指定访问 否则next（）
  hasNewRoutes ? next(to.fullPath) : next();
  ...
}
~~~



# 骨架屏占位

~~~
<template>
  <div>
    <el-row :gutter="20">
    //判断 如果有数据就不显示骨架 
      <template v-if="panels.length==0">
      <!-- 骨架屏占位 -->
      <el-col :span="6" v-for="i in 4" :key="i">
        <el-skeleton style="width: 100%;" animated loading>
          <template #template>
            <el-card shadow="hover" class="border-0">
          <template #header>
            <div class="flex justify-between">
            //把要展示的数据全部用这个东西覆盖 并设置阴影长度
                <el-skeleton-item variant="text" style="width: 50%;" />
                <el-skeleton-item variant="text" style="width: 10%;" />
            </div>
          </template>
          <el-skeleton-item variant="text" style="width: 80%;" />
          <el-divider />
          <div class="flex justify-between text-sm text-gray-500">
            <el-skeleton-item variant="text" style="width: 50%;" />
            <el-skeleton-item variant="text" style="width: 10%;" />
          </div>
        </el-card>
          </template>
        </el-skeleton>
      </el-col>
    </template>
<!-- ------------- -->
      <el-col
        :span="6"
        :offset="0"
        v-for="(item, index) in panels"
        :key="index"
      >
        <el-card shadow="hover" class="border-0">
          <template #header>
            <div class="flex justify-between">
              <span class="text-sm">{{ item.title }}</span>
              <el-tag :type="item.unitColor" effect="plain">
                {{ item.unit }}
              </el-tag>
            </div>
          </template>
          <span class="text-3xl font-bold text-gray-500">
            {{ item.value }}
          </span>
          <el-divider />
          <div class="flex justify-between text-sm text-gray-500">
            <span>{{ item.subTitle }}</span>
            <span>{{ item.subValue }}</span>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { getStatistics1 } from "@/api/index.js";
const panels = ref([]);
getStatistics1().then((res) => {
  panels.value = res.panels;
});
</script>


当数据还没返回过来的时候 使用骨架屏占个位 并设置动画和加载中的loading 
用v-if判断 如果有数据的话就不显示骨架
~~~

# 动画展示加载数据gsap

下载 npm i gsap

使用

~~~vue
<template>
  <div>
    <!-- tofix保留几位 -->
      //展示数据
    {{ d.num.toFixed(0) }}
  </div>
</template>

<script setup>
import { reactive, watch } from "vue";
import gsap from 'gsap'
// 接收传来的值
const props=defineProps({
    value:{
        type:Number,
        default:0 //默认为0
    }
})
//初始化数据
const d = reactive({ num: 0 });

function AnimateToValue(){
    //第一个参数是指的哪个对象
    gsap.to(d,{
        duration:0.5,  //动画几秒
        num:props.value  //改变到哪个数字
    })
}
AnimateToValue()  //调用一遍函数
//监听数据改变  如果传回来的数据改变了就再调用一遍函数开启动画
    //第一个参数是监听哪个数据 第二个参数是监听到了做什么
watch(()=>props.value,()=>{
    AnimateToValue()
})
</script>
~~~



# 使用Vue use方法等比例缩放页面

**useResizeObserver**

~~~
import { useResizeObserver } from "@vueuse/core";

//等比例缩放页面
const el = ref(null);

useResizeObserver(el, (entries) => {
  //每次缩放都会触发这个方法
  myChart.resize()  //改变图标尺寸 参数不指定的话自动获取dom宽度
});
~~~





# 自定义指令处理权限问题

~~~js
//用来判断不同用户的不同权限展示 比如我没有访问图表的权限 我就不能展示图表 配置配置相应的v-permission才能展示相应的东西 否则将节点移除

import store from "@/store";
//判断别名
function hasPermission(value, el = false) {
  if (!Array.isArray(value)) {
    throw new Error("需要配置权限,例如v-permission='['getStatistic3,GET']'");
  }
//表示有这个别名  value.findIndex找到value里面的某一项 用它和总权限做比较 如果包含则不会等于负一
  const hasAuth =
    value.findIndex((v) => store.state.ruleNames.includes(v)) != -1;
  if (el && !hasAuth) {
    //el有父节点 然后移除这个节点
    el.parentNode &&el.parentNode.removeChild(el)
  }
}

export default {
    //app就是main.js里面哪个app
  install(app) {
      //第一个是指令名字 v-permission
    app.directive("permission", {
      //第一个是当前节点 第二个是一些属性
      mounted(el, binding) {
        //判断别名
        hasPermission(binding.value, el);
      },
    });
  },
};
~~~

~~~
补充学习

指令钩子

const myDirective = {
  // 在绑定元素的 attribute 前
  // 或事件监听器应用前调用
  created(el, binding, vnode, prevVnode) {
    // 下面会介绍各个参数的细节
  },
  // 在元素被插入到 DOM 前调用
  beforeMount(el, binding, vnode, prevVnode) {},
  // 在绑定元素的父组件
  // 及他自己的所有子节点都挂载完成后调用
  mounted(el, binding, vnode, prevVnode) {},  一般是这个
  // 绑定元素的父组件更新前调用
  beforeUpdate(el, binding, vnode, prevVnode) {},
  // 在绑定元素的父组件
  // 及他自己的所有子节点都更新后调用
  updated(el, binding, vnode, prevVnode) {},
  // 绑定元素的父组件卸载前调用
  beforeUnmount(el, binding, vnode, prevVnode) {},
  // 绑定元素的父组件卸载后调用
  unmounted(el, binding, vnode, prevVnode) {}
}

钩子参数
el：指令绑定到的元素。这可以用于直接操作 DOM。

binding：一个对象，包含以下属性。

value：传递给指令的值。例如在 v-my-directive="1 + 1" 中，值是 2。
oldValue：之前的值，仅在 beforeUpdate 和 updated 中可用。无论值是否更改，它都可用。
arg：传递给指令的参数 (如果有的话)。例如在 v-my-directive:foo 中，参数是 "foo"。
modifiers：一个包含修饰符的对象 (如果有的话)。例如在 v-my-directive.foo.bar 中，修饰符对象是 { foo: true, bar: true }。
instance：使用该指令的组件实例。
dir：指令的定义对象。
vnode：代表绑定元素的底层 VNode。

prevNode：之前的渲染中代表指令所绑定元素的 VNode。仅在 beforeUpdate 和 updated 钩子中可用。



~~~





# 修改和新增动态使用封装组件

~~~vue
  <!-- 封装的框组件 -->
//动态获取标题 获取到当前节点 获取到之后可以使用该组件内暴露的方法 使用组件内的自定义事件 回调写在本组件内
  <FormDrawer :title="drawerTitle" ref="formDrawer" @submit="handleSubmit">
      //绑定表单内容 获取到表单节点供验证 表单规则
    <el-form :model="form" ref="formRef" :rules="rules" :inline="false">
      <el-form-item label="分类名称" prop="name">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="排序" prop="order">
        <el-input-number
          v-model="form.order"
          :min="0"
          :max="1000"
        ></el-input-number>
      </el-form-item>
    </el-form>
</FormDrawer>

自己去看吧src/components/imageAside.vue 注释很完整
~~~

