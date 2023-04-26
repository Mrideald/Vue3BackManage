<template>
  <el-card shadow="never" class="border-0">
    <!-- 新增和刷新 -->
    <div class="flex items-center justify-between mb-4">
      <el-button type="primary" size="small" @click="handleCreate"
        >新增</el-button
      >
      <el-tooltip effect="dark" content="刷新数据" placement="top">
        <el-button text @click="getData">
          <el-icon :size="20"><Refresh /></el-icon>
        </el-button>
      </el-tooltip>
    </div>

    <!-- 表格 -->
    <el-table :data="list" stripe style="width: 100%" v-loading="loading">
      <el-table-column prop="title" label="公告标题" />
      <el-table-column prop="create_time" label="发布时间" width="300" />
      <el-table-column label="操作" width="180" align="center">
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
            title="是否要删除该公告?"
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
    <!-- 表单信息组件 -->
    <FormDrawer ref="FormDrawerRef" :title="drawerTitle" @submit="handleSubmit">
      <el-form
        :model="form"
        ref="formRef"
        :rules="rules"
        label-width="80px"
        :inline="false"
      >
        <el-form-item label="公告标题" prop="title">
          <el-input v-model="form.title" placeholder="公告标题"></el-input>
        </el-form-item>
        <el-form-item label="公告内容" prop="content">
          <el-input
            v-model="form.content"
            placeholder="公告内容"
            type="textarea"
            :rows="5"
          ></el-input>
        </el-form-item>
      </el-form>
    </FormDrawer>
  </el-card>
</template>

<script setup>
import {
  getNoticeList,
  createNotice,
  changeNotice,
  deleteNotice,
} from "@/api/notice.js";
import FormDrawer from "@/components/FormDrawer.vue";
import { useInitTable } from "@/composables/useCommon.js";

// 使用封装组件 分页器 获取数据 删除
const { list, loading, currentPage, total, limit, getData, handleDelete } =
  useInitTable({
    getList: getNoticeList,
    delete: deleteNotice,
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
    title: "",
    content: "",
  },
  rules: {
    title: [
      {
        required: true,
        message: "公告的标题不能为空",
        trigger: "blur",
      },
    ],
    content: [
      {
        required: true,
        message: "公告的内容不能为空",
        trigger: "blur",
      },
    ],
  },
  getData,
  update: changeNotice,
  create: createNotice,
});
</script>
