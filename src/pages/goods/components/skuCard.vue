<template>
  <el-form-item label="规格选项" v-loading="bodyLoading">
    <!-- 占满宽度 -->
    <el-card
      shadow="never"
      class="w-full mb-3"
      v-for="(item, index) in sku_card_list"
      :key="item.id"
      v-loading="item.loading"
    >
      <template #header>
        <div class="flex items-center">
          <!-- 卡片头部内容 左边为输入框 右边三个按钮 -->
          <el-input
            v-model="item.text"
            placeholder="规格名称"
            style="width: 200px"
            @change="handleUpdate(item)"
          >
            <template #append>
              <el-icon class="cursor-pointer" @click="handleChooseSku(item)">
                <more />
              </el-icon>
            </template>
          </el-input>
          <!-- 按钮 -->
          <el-button
            class="ml-auto"
            size="small"
            @click="sortCard('up', index)"
            :disabled="index == 0"
          >
            <el-icon> <Top /> </el-icon>
          </el-button>
          <el-button
            size="small"
            @click="sortCard('down', index)"
            :disabled="index == sku_card_list.length - 1"
          >
            <el-icon> <Bottom /> </el-icon>
          </el-button>
          <!-- 气泡确认框 确认删除-->
          <el-popconfirm
            title="是否要删除该规格选项?"
            confirm-button-text="确认"
            cancel-button-text="取消"
            @confirm="handleDelete(item)"
          >
            <!-- confirm确认删除后调用自定义删除事件 -->
            <template #reference>
              <el-button size="small">
                <el-icon> <Delete /> </el-icon>
              </el-button>
            </template>
          </el-popconfirm>
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

  <ChooseSku ref="ChooseSkuRef"/>
</template>

<script setup>
import {ref} from 'vue'
import SkuCardItem from "./skuCardItem.vue";
import ChooseSku from '@/components/ChooseSku.vue'
import {
  sku_card_list,
  btnLoading,
  addSkuCardEvent,
  handleUpdate,
  handleDelete,
  sortCard,
  bodyLoading,
} from "@/composables/useSku.js";

const ChooseSkuRef=ref(null)
const handleChooseSku=(item)=>{
  ChooseSkuRef.value.open()
}
</script>

<style>
.el-card__header {
  @apply !p-2 bg-gray-50;
}
</style>
