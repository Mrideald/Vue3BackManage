import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import WindiCSS from "vite-plugin-windicss";
//nodejs内置path模块 处理路径
/*
全局变量 __dirname是一个字符串,代表当前js文件所在目录的路径(绝对路径)
全局变量 __filename是一个字符串,代表当前js文件的路径(绝对路径)
*/
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    //取别名  后面直接使用@就可以获取到src
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },

  server: {
    open:true,
    proxy: {
      "/api": {
        target: "http://ceshi13.dishait.cn",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },

  plugins: [WindiCSS(), vue()],
});
