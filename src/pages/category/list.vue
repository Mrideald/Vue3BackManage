<template>
    <el-card shadow="never" class="border-0">
      <ListHeader @refresh="getData" @create="handleCreate" />
      <el-tree
        :data="list"
        :props="{ label: 'name', children: 'child' }"
        v-loading="loading"
        node-key="id"
      >
        <template #default="{ node, data }">
          <div class="custom-tree-node">
            <el-icon v-if="data.icon" :size="16" class="ml-2">
              <component :is="data.icon"></component>
            </el-icon>
            <span>{{ data.name }}</span>

            <div class="ml-auto">
                <el-button
                text
                type="primary"
                size="small"
                >推荐商品</el-button
              >
              <el-switch
                :model-value="data.status"
                :active-value="1"
                :inactive-value="0"
                @change="handleStatusChange($event, data)"
              >
              </el-switch>
              <el-button
                text
                type="primary"
                size="small"
                @click.stop="handleEdit(data)"
                >修改</el-button
              >

              <!-- 气泡确认框 确认删除-->
              <el-popconfirm
                title="是否要删除该记录?"
                confirm-button-text="确认"
                cancel-button-text="取消"
                @confirm="handleDelete(data.id)"
              >
                <!-- confirm确认删除后调用自定义删除事件 -->
                <template #reference>
                  <el-button size="small" text type="primary">删除</el-button>
                </template>
              </el-popconfirm>
            </div>
          </div>
        </template>
      </el-tree>
      <!-- 表单信息组件 -->
      <FormDrawer ref="FormDrawerRef" :title="drawerTitle" @submit="handleSubmit">
        <el-form
          :model="form"
          ref="formRef"
          :rules="rules"
          label-width="80px"
          :inline="false"
        >
          <!-- 菜单规则 -->
          <el-form-item label="菜单/规则" prop="menu">
            <el-radio-group v-model="form.menu">
              <el-radio :label="1" size="large">菜单</el-radio>
              <el-radio :label="0" size="large">规则</el-radio>
            </el-radio-group>
          </el-form-item>
          <!-- 权限名称 -->
          <el-form-item label="名称" prop="name">
            <el-input v-model="form.name" style="width: 30%"></el-input>
          </el-form-item>
          <!-- 菜单图标 -->
          <el-form-item label="菜单图标" prop="icon" v-if="form.menu == 1">
            <IconSelect v-model="form.icon" />
          </el-form-item>
          <!-- 前端路由 -->
          <el-form-item
            label="前端路由"
            prop="frontpath"
            v-if="form.menu == 1 && form.rule_id > 0"
          >
            <el-input v-model="form.frontpath"></el-input>
          </el-form-item>
          <!-- 后端规则 -->
          <el-form-item label="后端规则" prop="condition" v-if="form.menu == 0">
            <el-input v-model="form.condition"></el-input>
          </el-form-item>
          <!-- 请求方式 -->
          <el-form-item label="请求方式" prop="method" v-if="form.menu == 0">
            <el-select v-model="form.method" placeholder="请选择请求方式">
              <el-option
                v-for="item in ['GET', 'POST', 'PUT', 'DELETE']"
                :key="item"
                :label="item"
                :value="item"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <!-- 排序 -->
          <el-form-item label="排序" prop="order">
            <el-input-number v-model="form.order" :min="0" :max="1000" />
          </el-form-item>
        </el-form>
      </FormDrawer>
    </el-card>
  </template>

  <script setup>
  import { ref } from "vue";
  import ListHeader from "@/components/ListHeader.vue";
  import FormDrawer from "@/components/FormDrawer.vue";
  import IconSelect from "@/components/iconSelect.vue";
  import {
    getCategoryList,
    createCategory,
    updateCategory,
    updateCategoryStatus,
    deleteCategory,
  } from "@/api/category.js";

  import { useInitTable, useInitForm } from "@/composables/useCommon.js";
  const { loading, list, getData, handleDelete, handleStatusChange } =
    useInitTable({
      getList: getCategoryList, //请求方法
      onGetListSuccess: (res) => {
        list.value = res;
      }, //请求成功后回调
      delete: deleteCategory,
      updataStatus: updateCategoryStatus,
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
      rule_id: 0,
      menu: 0,
      name: "",
      condition: "",
      method: "GET",
      status: 1,
      order: 50,
      icon: "",
      frontpath: "",
    },
    rules: {},
    getData,
    update: updateCategory,
    create: createCategory,
  });  
  </script>

  <style>
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    font-size: 14px;
    padding-right: 14px;
  }
  .el-tree-node__content {
    padding: 20px 0;
  }
  </style>
