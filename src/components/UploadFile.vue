<template>
    <!-- 上传图片需要参数 请求头 后台地址 后台地址写在api中 写了一个常量 请求头是token 动态绑定token 参数body是一个路径名字和图库分类id id需要在aside获取 -->
  <el-upload
    drag
    :action="uploadImageAction"
    multiple
    :headers="{
        token
    }"
    name="img"
    :data="data"
    :on-success="uploadSuccess"
    :on-error="uploadError"
  >
    <el-icon class="el-icon--upload"><upload-filled /></el-icon>
    <div class="el-upload__text">
      把文件拖过来或者 <em>点我上传</em>
    </div>
    <template #tip>
      <div class="el-upload__tip">
        jpg/png files with a size less than 500kb
      </div>
    </template>
  </el-upload>
</template>

<script setup>
import {uploadImageAction} from '@/api/image.js'
import {getToken} from '@/composables/auth.js'
import {toast} from '@/composables/util.js'
const token=getToken()

//上传 带给服务器的数据为一个对象
defineProps({
    data:{
        type:Object
    }
})

//将提交成功的方法返回到父组件
const emit=defineEmits(["success"])

//上传成功 第一个参数是成功后服务器返回的信息 后面也是
const uploadSuccess=(res)=>{
    //使用提交成功后的方法 getData获取数据
     console.log(res,'res');
   emit("success",{
    res
   })
}
//上传失败
const uploadError=(error)=>{
   let msg=JSON.parse(error.message).msg||"上传失败"
   toast(msg,"error")
}
</script>