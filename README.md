# Vue3+vite







# 在Vue3中新建路由方式

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

