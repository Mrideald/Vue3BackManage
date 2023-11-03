import { createApp } from "vue";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import App from "./App.vue";
import {router} from "@/router";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
import store from '@/store'
import "@/mock"
//创建并挂载实例
const app = createApp(App);

app.use(ElementPlus);
app.use(router);
app.use(store);
//注册图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}
import "virtual:windi.css";
//引入权限管理内容
import "@/permission"

//引入进度条样式
import "nprogress/nprogress.css";

//引入自定义指令
import permission from '@/directives/permission.js'
app.use(permission)
app.mount("#app");
