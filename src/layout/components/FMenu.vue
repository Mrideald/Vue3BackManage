<template>
  <div class="f-menu" :style="{width:$store.state.asideWidth}">
    <el-menu :default-active="defaultActive" :collapse="isCollapse" class="border-0" @select="handleSelect" :collapse-transition="false" :unique-opened="true">
      <template v-for="(item, index) in asideMenus" :key="index">
        <!-- 二级菜单 -->
        <el-sub-menu
          :index="item.name"
          v-if="item.child && item.child.length > 0"
        >
          <template #title>
            <el-icon>
              <component :is="item.icon"></component>
            </el-icon>
            <span>{{ item.name }}</span>
          </template>
          <el-menu-item
            v-for="(item2, index2) in item.child"
            :key="index2"
            :index="item2.frontpath"
          >
          <el-icon>
            <component :is="item2.icon"></component>
          </el-icon>
            {{ item2.name }}
          </el-menu-item>
        </el-sub-menu>
        <!-- 一级菜单 -->
        <el-menu-item v-else :index="item.frontpath">
          <el-icon>
            <component :is="item.icon"></component>
          </el-icon>
          <span>{{ item.name }}</span>
        </el-menu-item>
      </template>
    </el-menu>
  </div>
</template>

<script setup>
import { computed,ref } from 'vue';
import {useRouter,useRoute,onBeforeRouteUpdate} from 'vue-router'
import { useStore } from "vuex";
const router =useRouter()
const route=useRoute()
const store=useStore()

//监听路由变化
onBeforeRouteUpdate((to,from)=>{
  //路由变化了改变默认选中 解决点击标签之后侧边列表不变化问题
  defaultActive.value=to.path
})

//是否折叠
const isCollapse=computed(()=>!(store.state.asideWidth=='250px'))
//默认选中
const defaultActive=ref(route.path)
const asideMenus = computed(()=>store.state.menus)
const handleSelect=(e)=>{
 router.push(e)
}
</script>

<style>
.f-menu {
  transition: all 0.2s;
  top: 64px;
  bottom: 0;
  left: 0;
  @apply shadow-md fixed bg-light-50;
  overflow-y: auto;
  overflow-x: hidden;
}
/* 隐藏滚动条 */
.f-menu::-webkit-scrollbar{
  width: 0;
}
</style>
