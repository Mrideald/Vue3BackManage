<template>
  <!-- 封装搜索 -->
  <el-form :model="model" label-width="80px" class="mb-3" size="small">
    <el-row :gutter="20">
      <slot />
      <template v-if="showSearch">
        <slot name="show" />
      </template>
      <!-- offset	栅格左侧的间隔格数 -->
      <el-col :span="8" :offset="showSearch ? 0 : 8">
        <div class="flex items-center justify-end">
          <el-button type="primary" @click="$emit('search')">搜索</el-button>
          <el-button @click="$emit('reset')">重置</el-button>
          <el-button v-if="hasShowSearch" type="primary" text @click="showSearch = !showSearch">
            {{ showSearch ? "收起" : "展开" }}
            <el-icon>
              <ArrowUp v-if="showSearch" />
              <ArrowDown v-else />
            </el-icon>
          </el-button>
        </div>
      </el-col>
    </el-row>
  </el-form>
</template>

<script setup>
import { ref,useSlots } from "vue";

defineProps({
    model:Object
})

defineEmits(["search", "reset"]);

const showSearch = ref(false);

const slot=useSlots()
//如果有值就是true 没就是false
const hasShowSearch=ref(!!slot.show)
//加一个!将原值取反成false 两个抵消 强行转换成布尔值
</script>
