<template>
  <el-card shadow="never" class="border-0">
    <!-- 新增和刷新 -->
    <ListHeader
      layout="create,delete,refresh"
      @delete="handleMultDelete"
      @create="handleCreate"
      @refresh="getData"
    />

    <!-- 表格 -->
    <el-table
      @selection-change="handleSelectionChange"
      :data="list"
      stripe
      style="width: 100%"
      v-loading="loading"
      ref="multipleTableRef"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column prop="name" label="规格名称" />
      <el-table-column prop="default" label="规格值" width="300" />
      <el-table-column prop="order" label="排序" />
      <!-- 状态部分 -->
      <el-table-column label="状态" width="120">
        <template #default="{ row }">
          <el-switch
            :model-value="row.status"
            :active-value="1"
            :inactive-value="0"
            @change="handleStatusChange($event, row)"
            :loading="row.statusLoading"
            :disabled="row.super == 1"
          >
          </el-switch>
        </template>
      </el-table-column>

      <el-table-column label="操作" width="250" align="center">
        <template #default="scope">
          <!-- 插槽可以接收到父组件的data值 scope.row就是每一行的tableData -->
          <!-- <h1>{{ scope.row }}</h1> -->
          <el-button
            size="small"
            text
            type="primary"
            @click="handleEdit(scope.row)"
            >修改</el-button
          >

          <!-- 气泡确认框 确认删除-->
          <el-popconfirm
            title="是否要删除该规格?"
            confirm-button-text="确认"
            cancel-button-text="取消"
            @confirm="handleDelete(scope.row.id)"
          >
            <!-- confirm确认删除后调用自定义删除事件 -->
            <template #reference>
              <el-button size="small" text type="primary">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <div class="flex items-center justify-center mt-5">
      <el-pagination
        background
        layout="prev,pager,next"
        :total="total"
        :current-page="currentPage"
        :page-size="limit"
        @current-change="getData"
      />
    </div>
    <!-- 表单信息组件  关闭了销毁组件-->
    <FormDrawer
      ref="FormDrawerRef"
      :destroyOnClose="true"
      :title="drawerTitle"
      @submit="handleSubmit"
    >
      <el-form
        :model="form"
        ref="formRef"
        :rules="rules"
        label-width="80px"
        :inline="false"
      >
        <el-form-item label="规格名称" prop="name">
          <el-input v-model="form.name" placeholder="规格名称"></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="order">
          <el-input-number v-model="form.order" :min="0" :max="1000">
          </el-input-number>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-switch
            v-model="form.status"
            :active-value="1"
            :inactive-value="0"
          >
          </el-switch>
        </el-form-item>
        <el-form-item label="规格值" prop="default">
          <TagInput v-model="form.default" />
        </el-form-item>
      </el-form>
    </FormDrawer>
  </el-card>
</template>
<!-- 修改状态接口有点问题 -->
<script setup>
import {
  getSkusList,
  createSkus,
  changeSkus,
  deleteSkus,
  updataSkusStatus,
} from "@/api/skus.js";
import FormDrawer from "@/components/FormDrawer.vue";
import { useInitTable, useInitForm } from "@/composables/useCommon.js";
import ListHeader from "../../components/ListHeader.vue";
import TagInput from "@/components/TagInput.vue";
// 使用封装组件 分页器 获取数据 删除
const {
  list,
  loading,
  currentPage,
  total,
  limit,
  getData,
  handleDelete,
  handleStatusChange,
  handleSelectionChange,
  multipleTableRef,
  handleMultDelete,
} = useInitTable({
  getList: getSkusList,
  delete: deleteSkus,
  updataStatus: updataSkusStatus,
});
//新增和修改
// 新增和修改内容
const {
  FormDrawerRef,
  formRef,
  form,
  rules,
  drawerTitle,
  handleSubmit,
  handleEdit,
  handleCreate,
} = useInitForm({
  // 传参~
  form: {
    name: "",
    default: "",
    status: 1,
    order: 50,
  },
  rules: {
    name: [
      {
        required: true,
        message: "规格的名称不能为空",
        trigger: "blur",
      },
    ],
    default: [
      {
        required: true,
        message: "规格值不能为空",
        trigger: "blur",
      },
    ],
  },
  getData,
  update: changeSkus,
  create: createSkus,
});

</script>
