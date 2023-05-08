<template>
  <div v-if="modelValue">
    <el-image
      v-if="typeof modelValue == 'string'"
      :src="modelValue"
      fit="cover"
      class="w-[100px] h-[100px] rounded border mr-2"
    ></el-image>
    <div v-else class="flex flex-wrap">
      <div
        class="relative mx-1 mb-2 w-[100px] h-[100px]"
        v-for="(url, index) in modelValue"
        :key="index"
      >
        <el-icon
          class="absolute right-[5px] top-[5px] cursor-pointer rounded-full bg-white"
          style="z-index: 10"
          @click="removeIamge(url)"
        >
          <CircleClose />
        </el-icon>
        <el-image
          :src="url"
          fit="cover"
          class="w-[100px] h-[100px] rounded border mr-2"
        ></el-image>
      </div>
    </div>
  </div>
  <div class="choose-image-btn" @click="open">
    <el-icon :size="25" class="text-gray-500"> <Plus /> </el-icon>
  </div>
  <!-- model绑定对话框的显示 为true时显示对话框-->
  <el-dialog title="选择图片" v-model="dialogVisible" width="80%">
    <!-- 主体部分 将图库组件全部复制过来 -->
    <el-container class="bg-white rounded" style="height: 60vh">
      <el-header class="image-header">
        <el-button type="primary" size="small" @click="handleOpenClick"
          >新增图片分类</el-button
        >
        <el-button type="warning" size="small" @click="handleUpload"
          >上传图片</el-button
        >
      </el-header>
      <el-container>
        <!-- 主体和侧边抽离 -->
        <ImageAside ref="ImageAsideRef" @change="handleAsideChange" />
        <ImageMain
          :limit="limit"
          :openChoose="true"
          ref="ImageMainRef"
          @choose="handleChoose"
        />
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
import ImageAside from "@/components/imageAside.vue";
import ImageMain from "@/components/imageMain.vue";
import { toast } from "@/composables/util.js";

const dialogVisible = ref(false);

// 打开和关闭dialog
const open = () => {
  dialogVisible.value = true;
};
const close = () => {
  dialogVisible.value = false;
};

//获取到子组件节点
const ImageAsideRef = ref(null);
const ImageMainRef = ref(null);

//使用子组件内方法打开表单
const handleOpenClick = () => {
  ImageAsideRef.value.handleCreate();
};
//接收分类列表的自定义
const handleAsideChange = (image_class_id) => {
  ImageMainRef.value.loadData(image_class_id);
};
//上传图片
const handleUpload = () => {
  ImageMainRef.value.openUploadFile();
};

//处理上传图片 子组件的自定义事件
let urls = []; //接收选中图片地址
const handleChoose = (e) => {
  urls = e.map((o) => o.url); //找出指定的key，将value形成数组
};

//接收传来的值 名字得是modelValue
const prop = defineProps({
  modelValue: [String, Array],
  limit: {
    type: Number,
    default: 1,
  },
});

//绑定自定义事件 给父组件传递数据更新
const emit = defineEmits(["update:modelValue"]);

const submit = () => {
  //判断选1张还是多张
  let value = [];
  if (prop.limit == 1) {
    value = urls[0];
  } else {
    // 穿过来的老数组 即本身有的url 与选择的新数组合并
    value = [...prop.modelValue, ...urls];
    if (value.length > prop.limit) {
      return toast(`最多还能选择${prop.limit - value.length}张`);
    }
  }
  // 传给使用本组件的组件选择的图片地址
  if (value) {
    // 将新的值传给父组件 实现双向链接
    emit("update:modelValue", value);
  }
  close();
};

// 删除图片
const removeIamge = (url) => {
  // 过滤掉点击的那个url 然后传给组件的双向绑定
  emit(
    "update:modelValue",
    prop.modelValue.filter((u) => u != url)
  );
};
</script>

<style>
.choose-image-btn {
  @apply w-[100px] h-[100px] rounded border flex justify-center items-center cursor-pointer hover:(bg-gray-100);
}
.image-header {
  border-bottom: 1px solid #eeeeee;
  @apply flex items-center;
}
</style>
