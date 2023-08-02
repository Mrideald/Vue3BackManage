<template>
  <el-container>
    <el-header>
      <f-header />
    </el-header>
    <el-container>
      <el-aside :width="$store.state.asideWidth">
        <f-menu />
      </el-aside>
      <el-main>
        <f-tag-list />
        <!-- v-slot解构到渲染的动态组件 -->
        <router-view v-slot="{ Component }">
          <!-- 只允许缓存十个，超过十个了最久没有访问的那一个会被销毁 -->
          <keep-alive :max="10">
            <component :is="Component"></component>
          </keep-alive>
        </router-view>
      </el-main>
    </el-container>
  </el-container>
  <div>随便改点</div>
</template>

<script setup>
import FHeader from "./components/FHeader.vue";
import FMenu from "./components/FMenu.vue";
import FTagList from "./components/FTagList.vue";
</script>

<style>
.el-aside {
  transition: all 0.2s;
}
</style>
