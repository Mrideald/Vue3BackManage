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
import { computed, reactive, ref } from "vue";
import {
  getNoticeList,
  createNotice,
  changeNotice,
  deleteNotice,
} from "@/api/notice.js";
import FormDrawer from "@/components/FormDrawer.vue";
import { toast } from "@/composables/util.js";

const loading = ref(false);
//分页
const currentPage = ref(1);
const total = ref(0);
const limit = ref(10);
const list = ref([]);

function getData(p = null) {
  if (typeof p == "number") {
    currentPage.value = p;
  }
  loading.value = true;
  getNoticeList(currentPage.value)
    .then((res) => {
      list.value = res.list;
      total.value = res.totalCount;
    })
    .finally(() => {
      loading.value = false;
    });
}
getData();

//删除公告
const handleDelete = (id) => {
  loading.value = true;
  deleteNotice(id)
    .then((res) => {
      toast("删除成功");
      getData();
    })
    .finally(() => {
      loading.value = false;
    });
};

//表单部分
const FormDrawerRef = ref(null);
const formRef = ref(null);
const form = reactive({
  title: "",
  content: "",
});
const rules = {
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
};
//新增和修改公用一个表单组件 用一个id区分
const editId = ref(0);
//要获取到还要写.value
const drawerTitle = computed(() => editId.value ? "修改" : "新增");
//提交表单 新增和修改公告
const handleSubmit = () => {
  formRef.value.validate((valid) => {
    if (!valid) return;
    FormDrawerRef.value.showLoading();
    //定义一个中间量判别调哪个接口
    const fun = editId.value
      ? changeNotice(editId.value, form)
      : createNotice(form);
//后续操作
    fun.then((res) => {
        //成功的提示
        toast(drawerTitle.value + "成功");
        //获取数据 如果是修改的话就获取这一页的数据
        getData(editId.value ? currentPage.value : 1);
        //关闭弹框
        FormDrawerRef.value.close();
      })
      .finally(() => {
        FormDrawerRef.value.hideLoading();
      });
  });
};

//修改公告
const handleEdit = (row) => {
  editId.value = row.id;
  form.title = row.title;
  form.content = row.content;
  FormDrawerRef.value.open();
};

//新增公告
const handleCreate = () => {
  editId.value = 0;
  form.title = "";
  form.content = "";
  FormDrawerRef.value.open();
};
</script>
