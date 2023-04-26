<template>
  <el-card shadow="never" class="border-0">
    <!-- 搜索 -->
    <el-form :model="searchForm" label-width="80px" class="mb-3" size="small">
      <el-row :gutter="20">
        <el-col :span="8" :offset="0">
          <el-form-item label="关键词">
            <el-input
              v-model="searchForm.keyword"
              placeholder="管理员昵称"
              clearable
            ></el-input>
          </el-form-item>
        </el-col>
        <!-- offset	栅格左侧的间隔格数 -->
        <el-col :span="8" :offset="8">
          <div class="flex items-center justify-end">
            <el-button type="primary" @click="getData">搜索</el-button>
            <el-button @click="resetSearchForm">重置</el-button>
          </div>
        </el-col>
      </el-row>
    </el-form>

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
      <!-- 头像部分 -->
      <el-table-column label="管理员" width="200px">
        <!-- 结构出当前的对象 本来的形式是默认插槽是scope 当前对象是scope.row -->
        <template #default="{ row }">
          <div class="flex items-center">
            <!-- 头像 -->
            <el-avatar :size="60" :src="row.avatar">
              <!-- 失败的话显示下面这个 -->
              <img
                src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png"
              />
            </el-avatar>
            <!-- 右边部分 -->
            <div class="ml-3">
              <h6>{{ row.username }}</h6>
              <small>ID:{{ row.id }}</small>
            </div>
          </div>
        </template>
      </el-table-column>
      <!-- //所属管理员 -->
      <el-table-column label="所属管理员" align="center">
        <template #default="{ row }">
          <!-- row.role?row.role.name:"" -->
          {{ row.role?.name || "-" }}
        </template>
      </el-table-column>

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

      <!-- 修改和删除 -->
      <el-table-column label="操作" width="180" align="center">
        <template #default="scope">
          <small v-if="scope.row.super == 1" class="text-sm text-gray-500"
            >暂无操作</small
          >
          <!-- 插槽可以接收到父组件的data值 scope.row就是每一行的tableData -->
          <!-- <h1>{{ scope.row }}</h1> -->
          <div v-else>
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
          </div>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
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
        <!-- 表单内容 用户名 -->
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" placeholder="用户名"></el-input>
        </el-form-item>
        <!-- 表单内容 密码 -->
        <el-form-item label="密码" prop="password">
          <el-input v-model="form.password" placeholder="密码"></el-input>
        </el-form-item>
        <!-- 表单内容 头像 -->
        <el-form-item label="头像" prop="avatar">
          <ChooseImage v-model="form.avatar" />
        </el-form-item>
        <!-- 表单内容 管理员-->
        <el-form-item label="所属角色" prop="role_id">
          <!-- 下拉框 -->
          <el-select v-model="form.role_id" placeholder="选择所属角色">
            <el-option
              v-for="item in roles"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <!-- 表单内容 密码 -->
        <el-form-item label="状态" prop="content">
          <el-switch
            v-model="form.status"
            :active-value="1"
            :inactive-value="0"
          >
          </el-switch>
        </el-form-item>
      </el-form>
    </FormDrawer>
  </el-card>
</template>
<!-- .then一直报错 用定时器取代了异步操作   8.5 -->
<script setup>
import { computed, reactive, ref } from "vue";
import {
  getManagerList,
  updataManagerStatus,
  createManager,
  updataManager,
  deleteManager,
} from "@/api/manager.js";
import FormDrawer from "@/components/FormDrawer.vue";
import ChooseImage from "@/components/chooseImage.vue";
// 引入封装组件
import { useInitTable, useInitForm } from "../../composables/useCommon";
const roles = ref([]);
// 使用封装组件 分页器 获取数据 搜索内容 删除 修改状态
const {
  searchForm,
  resetSearchForm,
  list,
  loading,
  currentPage,
  total,
  limit,
  getData,
  handleStatusChange,
  handleDelete,
} = useInitTable({
  searchForm: { keyword: "" },
  getList: getManagerList,
  onGetListSuccess: (res) => {
    //给list添加一个statusloading属性 加载中 其实可以用不到 因为下面返回的是函数不是promise对象 函数一下就执行了 显示不出加载中
    list.value = res.list.map((o) => {
      o.statusLoading = false;
      return o;
    });
    total.value = res.totalCount;
    roles.value = res.roles;
  },
  delete:deleteManager,
  updataStatus:updataManagerStatus,
});

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
    username: "",
    password: "",
    role_id: null,
    status: 1,
    avatar: "",
  },
  rules:{
    username: [
      {
        required: true,
        message: "用户名不能为空",
        trigger: "blur",
      },
    ],
    password: [
      {
        required: true,
        message: "密码不能为空",
        trigger: "blur",
      },
    ],
    status: [
      {
        required: true,
        message: "状态不能为空",
        trigger: "blur",
      },
    ],
    role_id: [
      {
        required: true,
        message: "id不能为空",
        trigger: "blur",
      },
    ],
  },
  getData,
  update: updataManager,
  create: createManager,
});
</script>
