<template>
  <div class="flex items-center">
    <el-icon :size="20" class="mr-2" v-if="modelValue">
      <component :is="modelValue"></component>
    </el-icon>
    <el-select
      filterable:true
      :model-value="modelValue"
      placeholder="请选择图标"
      clearable
      filterable
      @change="handleChange"
    >
      <el-option v-for="item in icons" :key="item" :label="item" :value="item">
        <div class="flex items-center justify-between">
          <el-icon>
            <component :is="item"></component>
          </el-icon>
          <span class="text-gray-500">{{ item }}</span>
        </div>
      </el-option>
    </el-select>
  </div>
</template>

<script setup>
import { ref } from "vue";
import * as iconList from "@element-plus/icons-vue";

// 拿到所有图标的名称
const icons = ref(Object.keys(iconList));

defineProps({
  modelValue: String||Number,
});
const emit = defineEmits(["update:modelValue"]);
const handleChange = (icon) => {
  emit("update:modelValue", icon);
};
</script>
