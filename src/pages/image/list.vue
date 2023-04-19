<template>
    <el-container class="bg-white rounded" :style="{height:h+'px'}">
      <el-header class="image-header">
        <el-button type="primary" size="small" @click="handleOpenClick">新增图片分类</el-button>
      </el-header>
      <el-container>
        <!-- 主体和侧边抽离 -->
        <ImageAside ref="ImageAsideRef"/>
        <ImageMain/>
      </el-container>
    </el-container>
</template>

<script setup>
import {ref} from 'vue'
import ImageAside from '@/components/imageAside.vue'
import ImageMain from '@/components/imageMain.vue'
const windowHeight=window.innerHeight||document.body.clientHeight
const h=windowHeight-64-44-40

//获取到子组件节点
const ImageAsideRef=ref(null)

//使用子组件内方法打开表单
const handleOpenClick=()=>{
  ImageAsideRef.value.handleCreate()
}

</script>

<style>
.image-header{
  border-bottom: 1px solid #eeeeee;
  @apply flex items-center;
}
</style>