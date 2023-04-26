<template>
  <div v-if="modelValue">
  <el-image :src="modelValue" fit="cover" class="w-[100px] h-[100px] rounded border mr-2"></el-image>
  </div>
  <div class="choose-image-btn" @click="open">
    <el-icon :size="25" class="text-gray-500"> <Plus /> </el-icon>
  </div>
<!-- model绑定对话框的显示 为true时显示对话框-->
  <el-dialog
    title="选择图片"
    v-model="dialogVisible"
    width="80%"
  >
    <!-- 主体部分 将图库组件全部复制过来 -->
    <el-container class="bg-white rounded" style="height: 60vh;">
      <el-header class="image-header">
        <el-button type="primary" size="small" @click="handleOpenClick">新增图片分类</el-button>
        <el-button type="warning" size="small" @click="handleUpload">上传图片</el-button>
      </el-header>
      <el-container>
        <!-- 主体和侧边抽离 -->
        <ImageAside ref="ImageAsideRef" @change="handleAsideChange"/>
        <ImageMain :openChoose="true" ref="ImageMainRef" @choose="handleChoose"/>
      </el-container> 
    </el-container>
    <template #footer>
      <span>
        <el-button>取消</el-button>
        <el-button type="primary" @click="submit">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script setup>
import { ref } from "vue";
import ImageAside from '@/components/imageAside.vue'
import ImageMain from '@/components/imageMain.vue'


const dialogVisible = ref(false);

// 打开和关闭dialog
const open=()=>{
 dialogVisible.value=true;
}
const close=()=>{
  dialogVisible.value=false
}


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

//处理上传图片 子组件的自定义事件
let urls=[]//接收选中图片地址
const handleChoose=(e)=>{
   urls= e.map(o=>o.url)  //找出指定的key，将value形成数组
}

//接收传来的值 名字得是modelValue
const prop=defineProps({
 modelValue:[String,Array]
})

//绑定自定义事件 给父组件传递数据更新
const emit=defineEmits(["update:modelValue"])

const submit=()=>{
  //确定之后调用数据更新事件
  if(urls.length){
    // 将新的值传给父组件 实现双向链接
    emit("update:modelValue",urls[0])
  }
  close()
}
</script>

<style>
.choose-image-btn {
  @apply w-[100px] h-[100px] rounded border flex justify-center items-center cursor-pointer hover:(bg-gray-100);
}
.image-header{
  border-bottom: 1px solid #eeeeee;
  @apply flex items-center;
}
</style>
