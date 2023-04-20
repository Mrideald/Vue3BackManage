<template>
    <el-container class="bg-white rounded" :style="{height:h+'px'}">
      <el-header class="image-header">
        <el-button type="primary" size="small" @click="handleOpenClick">新增图片分类</el-button>
        <el-button type="warning" size="small" @click="handleUpload">上传图片</el-button>
      </el-header>
      <el-container>
        <!-- 主体和侧边抽离 -->
        <ImageAside ref="ImageAsideRef" @change="handleAsideChange"/>
        <ImageMain ref="ImageMainRef"/>
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
const ImageMainRef=ref(null)

//使用子组件内方法打开表单
const handleOpenClick=()=>{
  ImageAsideRef.value.handleCreate()
}
//接收分类列表的自定义
const handleAsideChange=(image_class_id)=>{
  ImageMainRef.value.loadData(image_class_id)
}
//上传图片
const handleUpload=()=>{
  ImageMainRef.value.openUploadFile()
}
</script>

<style>
.image-header{
  border-bottom: 1px solid #eeeeee;
  @apply flex items-center;
}
</style>