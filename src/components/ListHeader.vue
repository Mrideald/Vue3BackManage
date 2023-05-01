<template>
  <!-- 新增和刷新组件封装 -->
  <div class="flex items-center justify-between mb-4">
    <div>
      <el-button
        v-if="btns.includes('create')"
        type="primary"
        size="small"
        @click="$emit('create')"
        >新增</el-button
      >

      <!-- 气泡确认框 确认删除-->
      <el-popconfirm
        title="是否删除选中记录?"
        confirm-button-text="确认"
        cancel-button-text="取消"
        v-if="btns.includes('delete')"
        @confirm="$emit('delete')"
      >
        <!-- confirm确认删除后调用自定义删除事件 -->
        <template #reference>
          <el-button
            type="danger"
            size="small"
            >批量删除</el-button
          >
        </template>
      </el-popconfirm>
    </div>
    <el-tooltip
      v-if="btns.includes('refresh')"
      effect="dark"
      content="刷新数据"
      placement="top"
    >
      <el-button text @click="$emit('refresh')">
        <el-icon :size="20"><Refresh /></el-icon>
      </el-button>
    </el-tooltip>
  </div>
</template>

<script setup>
import { computed } from "vue";
//接收要显示新增刷新和删除 默认新增和刷新 如果传来删除则显示
const props = defineProps({
  layout: {
    type: String,
    default: "create,refresh",
  },
});
//转化成数组
const btns = computed(() => props.layout.split(","));
defineEmits(["create", "refresh","delete"]);
</script>
