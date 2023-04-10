<template>
  <div>
    <el-drawer
      v-model="showDrawer"
      :title=title
      :size=size
      :close-on-click-modal="false"
      :destroy-on-close="destroyOnClose"
    >
   <div class="formDrawer">
    <div class="body">
        <!-- 插槽区 -->
     <slot>
     </slot>
    </div>
    <div class="actions">
        <el-button type="primary" @click="submit" :loading="loading">提交</el-button>
        <el-button type="default" @click="close">取消</el-button>
    </div>
   </div>
    </el-drawer>
  </div>
</template>

<script setup>
import {ref} from 'vue'
const showDrawer=ref(false)
const loading=ref(false)

const showLoading=()=>loading.value=true
const hideLoading=()=>loading.value=false

const open =()=>showDrawer.value=true

const close=()=>showDrawer.value=false

defineProps({
    title:String,
    size:{
        type:String,
        default:"45%"
    },
    destroyOnClose:{
      type:Boolean,
      default:false
    },
    comfirmText:{
        type:String,
        default:"提交"
    }
})
const emit = defineEmits(['submit'])  //可以写多个事件
const submit=()=>emit("submit")

//暴露方法
defineExpose({
    open,
    close,
    showLoading,
    hideLoading
})
</script>

<style>
.formDrawer{
    width: 100%;
    height: 100%;
    position: relative;
    @apply  flex flex-col; 
}
.formDrawer .body{
    flex:1;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 50px;
    overflow-y:auto;
}
.formDrawer .actions{
    height: 50px;
    @apply mt-auto flex items-center;
}
</style>
