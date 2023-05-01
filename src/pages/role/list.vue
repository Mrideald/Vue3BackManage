<template>
  <el-card shadow="never" class="border-0">
    <!-- 新增和刷新 -->
    <ListHeader @create="handleCreate" @refresh="getData" />

    <!-- 表格 -->
    <el-table :data="list" stripe style="width: 100%" v-loading="loading">
      <el-table-column prop="name" label="角色名称" />
      <el-table-column prop="desc" label="角色描述" width="300" />
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
            @click="openSetRule(scope.row)"
            >配置权限</el-button
          >
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
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="form.name" placeholder="公告标题"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="desc">
          <el-input
            v-model="form.desc"
            placeholder="公告内容"
            type="textarea"
            :rows="5"
          ></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-switch
            v-model="form.status"
            :active-value="1"
            :inactive-value="0"
          >
          </el-switch>
        </el-form-item>
      </el-form>
    </FormDrawer>

    <!-- 权限配置组件-->
    <FormDrawer
      ref="SetRuleFormRef"
      title="配置权限"
      @submit="handleSetRuleSubmit"
    >
      <el-tree-v2
        ref="elTreeRef"
        :check-strictly="check_strictly"
        :data="ruleList"
        :props="{ label: 'name', children: 'child' }"
        show-checkbox
        :height="treeHeight"
        node-key="id"
        :default-expanded-keys="defaultExpandedKeys"
        @check="handleTreeCheck"
      >
        <template #default="{ node, data }">
          <div class="flex items-center">
            <el-tag :type="data.menu ? '' : 'info'" size="small">
              {{ data.menu ? "菜单" : "权限" }}
            </el-tag>
            <span class="ml-2 text-sm">{{ data.name }}</span>
          </div>
        </template>
      </el-tree-v2>
    </FormDrawer>
  </el-card>
</template>
<!-- 修改状态接口有点问题 -->
<script setup>
import { ref } from "vue";
import {
  getRoleList,
  createRole,
  changeRole,
  deleteRole,
  updataRoleStatus,
  setRoleRules,
} from "@/api/role.js";
import FormDrawer from "@/components/FormDrawer.vue";
import { getRuleList } from "@/api/rule.js";
import { useInitTable, useInitForm } from "@/composables/useCommon.js";
import ListHeader from "../../components/ListHeader.vue";
import { toast } from "@/composables/util.js";
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
} = useInitTable({
  getList: getRoleList,
  delete: deleteRole,
  updataStatus: updataRoleStatus,
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
    desc: "",
    status: 1,
  },
  rules: {
    name: [
      {
        required: true,
        message: "角色的名称不能为空",
        trigger: "blur",
      },
    ],
    desc: [
      {
        required: true,
        message: "角色的描述不能为空",
        trigger: "blur",
      },
    ],
  },
  getData,
  update: changeRole,
  create: createRole,
});

//打开权限修改的表单
const SetRuleFormRef = ref(null);
const ruleList = ref([]);
const treeHeight = ref(0);
const roleId = ref(0);
const defaultExpandedKeys = ref([]);
const elTreeRef = ref(null);
const ruleIds = ref([]); //当前用户拥有的权限id
const check_strictly = ref(false);
//打开formdrawer
const openSetRule = (row) => {
  roleId.value = row.id;
  treeHeight.value = window.innerHeight - 180;
  check_strictly.value = true;
  getRuleList(1).then((res) => {
    ruleList.value = res.list;
    defaultExpandedKeys.value = res.list.map((o) => o.id);
    SetRuleFormRef.value.open();
    //当前角色拥有的权限id
    ruleIds.value = row.rules.map((o) => o.id);
    setTimeout(() => {
      elTreeRef.value.setCheckedKeys(ruleIds.value); //默认选中角色拥有的权限
      check_strictly.value = false;
    }, 150);
  });
};

//提交
const handleSetRuleSubmit = () => {
  SetRuleFormRef.value.showLoading();
  //传当前角色id 和拥有的权限id
  setRoleRules(roleId.value, ruleIds.value);
  setTimeout(() => {
    toast("配置成功");
    getData();
    SetRuleFormRef.value.close();
    SetRuleFormRef.value.hideLoading();
  }, 2000);
};

//修改权限
const handleTreeCheck = (...e) => {
  //当前角色拥有的权限
  const { checkedKeys, halfCheckedKeys } = e[1];
  ruleIds.value = [...checkedKeys, ...halfCheckedKeys];
};
</script>
