<template>
  <!-- 修改密码 -->
  <div class="f-header">
    <span class="logo">
      <el-icon class="mr-1"><Cpu /></el-icon>
      EdgeDiary
    </span>
    <el-tooltip
        effect="dark"
        content="目录"
        placement="bottom"
      >
      <el-icon class="icon-btn"><fold /></el-icon>
      </el-tooltip>
    <el-tooltip
        effect="dark"
        content="刷新"
        placement="bottom"
      >
      <el-icon class="icon-btn" @click="handleRefresh"><refresh /></el-icon>
      </el-tooltip>

    <div class="ml-auto flex items-center">

      <el-tooltip
        effect="dark"
        :content="isFullscreen? '退出全屏':'全屏' "
        placement="bottom"
      >
      <el-icon @click="handleFullScreen" class="icon-btn">
        <Aim v-if="isFullscreen" />
        <full-screen v-if="!isFullscreen" />
      </el-icon>
      </el-tooltip>
      <el-dropdown class="dropdown">
        <span class="flex items-center text-light-50">
          <el-avatar class="mr-2" :size="30" :src="$store.state.user.avatar" />
          {{$store.state.user.username}}
          <el-icon class="el-icon--right">
            <arrow-down />
          </el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item >修改密码</el-dropdown-item>
            <el-dropdown-item @click="handleLogout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import {showModal,toast} from '@/composables/util.js'
import { useStore } from 'vuex';
//全屏
import { useFullscreen } from '@vueuse/core'
const {
  //是否全屏状态
   isFullscreen,
   //进入全屏
   //enter,
   //退出全屏
   //exit,
   //切换全屏
   toggle } = useFullscreen()

const router =useRouter()
const store =useStore()
function handleLogout(){
    //展示确认页
    showModal("是否确认退出?").then(res=>{
        store.dispatch('logOut').then(res=>{
            toast("退出登录成功")
            //跳转回登录页
            router.push('/login')
        })
    })
}
//处理刷新
const handleRefresh=()=>{
 window.location.reload()
}
//处理全屏
const handleFullScreen=()=>{
  toggle()
}

</script>

<style scoped>
.f-header{
 @apply flex items-center bg-lime-600 text-light-50 fixed top-0 left-0 right-0;
 height: 64px;
}
.logo{
  width: 250px;
  @apply flex justify-center items-center text-xl font-medium;
}
.icon-btn{
  @apply flex justify-center items-center;
  width: 42px;
  height: 64px;
  cursor: pointer;
}
.icon-btn:hover{
  @apply bg-lime-500;
}
.f-header .dropdown{
  height: 64px;
  cursor: pointer;
  @apply flex justify-center items-center mx-5;
}
</style>
