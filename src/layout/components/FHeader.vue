<template>
  <!-- 修改密码 -->
  <div class="f-header">
    <span class="logo">
      <el-icon class="mr-1"><Cpu /></el-icon>
      EdgeDiary
    </span>
    <el-icon class="icon-btn" @click="$store.commit('handleAsideWidth')">
      <Expand v-if="$store.state.asideWidth == '250px'" />
      <fold v-if="$store.state.asideWidth != '250px'" />
    </el-icon>

    <el-icon class="icon-btn" @click="handleRefresh"><refresh /></el-icon>

    <div class="ml-auto flex items-center">
      <el-tooltip
        effect="dark"
        :content="isFullscreen ? '退出全屏' : '全屏'"
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
          {{ $store.state.user.username }}
          <el-icon class="el-icon--right">
            <arrow-down />
          </el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="handleUpdataPaw"
              >修改密码</el-dropdown-item
            >
            <el-dropdown-item @click="handleLogout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
  <form-drawer
    ref="formDrawerRef"
    title="修改密码"
    destroyOnClose
    @submit="onSubmit"
  >
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="80px"
      size="small"
    >
      <el-form-item prop="oldpassword" label="旧密码">
        <el-input
          v-model="form.oldpassword"
          placeholder="请输入旧密码"
          type="password"
          show-password
        >
        </el-input>
      </el-form-item>
      <el-form-item prop="password" label="新密码">
        <el-input
          v-model="form.password"
          type="password"
          show-password
          placeholder="请输入新密码"
        >
        </el-input>
      </el-form-item>
      <el-form-item prop="repassword" label="确认密码">
        <el-input
          v-model="form.repassword"
          type="password"
          show-password
          placeholder="请输入确认密码"
        >
        </el-input>
      </el-form-item>
    </el-form>
  </form-drawer>
</template>

<script setup>
import FormDrawer from "@/components/FormDrawer.vue";
import { useRepassword, useLogout } from "@/composables/useManager.js";
//全屏
import { useFullscreen } from "@vueuse/core";
const {
  //是否全屏状态
  isFullscreen,
  //进入全屏
  //enter,
  //退出全屏
  //exit,
  //切换全屏
  toggle,
} = useFullscreen();

const { formDrawerRef, form, rules, onSubmit, formRef, handleUpdataPaw } =
  useRepassword();
const { handleLogout } = useLogout();
//处理刷新
const handleRefresh = () => {
  window.location.reload();
};
//处理全屏
const handleFullScreen = () => {
  toggle();
};
</script>

<style scoped>
.f-header {
  @apply flex items-center bg-lime-600 text-light-50 fixed top-0 left-0 right-0;
  height: 64px;
  z-index: 100;
}
.logo {
  width: 250px;
  @apply flex justify-center items-center text-xl font-medium;
}
.icon-btn {
  @apply flex justify-center items-center;
  width: 42px;
  height: 64px;
  cursor: pointer;
}
.icon-btn:hover {
  @apply bg-lime-500;
}
.f-header .dropdown {
  height: 64px;
  cursor: pointer;
  @apply flex justify-center items-center mx-5;
}
</style>
