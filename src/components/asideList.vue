<template>
  <div class="aside-list" :class="{ active: active }">
    <!-- 标题部分插槽 -->
    <span class="truncate"><slot /></span>
    <!-- 写内容 -->
    <el-button
      class="ml-auto px-1"
      text
      type="primary"
      size="small"
      @click="$emit('edit')"
    >
      <el-icon :size="12"><Edit /></el-icon>
    </el-button>
    <!-- 气泡确认框 确认删除-->
    <!-- 包一个span 阻止冒泡事件 -->
    <span @click.stop="()=>{}">
    <el-popconfirm title="是否要删除该分类?" confirm-button-text="确认"
    cancel-button-text="取消" @confirm="$emit('delete')">
    <!-- confirm确认删除后调用自定义删除事件 -->
      <template #reference>
        <el-button text type="primary" size="small">
          <el-icon :size="12"><Close /></el-icon>
        </el-button>
      </template>
    </el-popconfirm>
  </span>
  </div>
</template>

<script setup>
const props = defineProps({
  active: {
    type: Boolean,
    default: false,
  },
});

//自定义事件
const emit = defineEmits(["edit", "delete"]); //可以写多个事件
</script>

<style>
.aside-list {
  border-bottom: 1px solid #f4f4f4;
  cursor: pointer;
  @apply flex items-center p-3 text-sm text-gray-600;
}
.aside-list:hover,
.active {
  @apply bg-blue-50;
}
</style>
