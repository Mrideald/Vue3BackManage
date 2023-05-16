<template>
  <el-form-item label="规格选项">
    <!-- 占满宽度 -->
    <el-card
      shadow="never"
      class="w-full mb-3"
      v-for="(item, index) in sku_card_list"
      :key="item.id"
    >
      <template #header>
        <div class="flex items-center">
          <!-- 卡片头部内容 左边为输入框 右边三个按钮 -->
          <el-input
            v-model="item.text"
            placeholder="规格名称"
            style="width: 200px"
          >
            <template #append>
              <el-icon>
                <more />
              </el-icon>
            </template>
          </el-input>
          <!-- 按钮 -->
          <el-button class="ml-auto" size="small">
            <el-icon> <Top /> </el-icon>
          </el-button>
          <el-button size="small">
            <el-icon> <Bottom /> </el-icon>
          </el-button>
          <el-button size="small">
            <el-icon> <Delete /> </el-icon>
          </el-button>
        </div>
      </template>
      <!-- 卡片主体 规格属性值 封装成一个组件 -->
      <SkuCardItem :skuCardId="item.id" />
    </el-card>
    <el-button
      type="success"
      size="small"
      :loading="btnLoading"
      @click="addSkuCardEvent"
      >添加规格</el-button
    >
  </el-form-item>
</template>

<script setup>
import SkuCardItem from "./skuCardItem.vue";
import {
  sku_card_list,
  btnLoading,
  addSkuCardEvent,
} from "@/composables/useSku.js";
</script>

<style>
.el-card__header {
  @apply !p-2 bg-gray-50;
}
</style>
