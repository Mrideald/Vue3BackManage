<template>
  <el-aside width="220px" class="image-aside" v-loading="loading">
    <div class="top">
      <AsideList
        :active="activeId == item.id"
        v-for="item in list"
        :key="item.id"
        @edit="handleEdit(item)"
        @delete="handleDelete(item.id)"
        @click="handleChangeActive(item.id)"
      >
        {{ item.name }}
      </AsideList>
    </div>
    <div class="bottom">
      <el-pagination
        background
        layout="prev,next"
        :total="total"
        :current-page="currentPage"
        :page-size="limit"
        @current-change="getData"
      />
    </div>
  </el-aside>
  <!-- 封装的框组件 -->
  <FormDrawer :title="drawerTitle" ref="formDrawer" @submit="handleSubmit">
    <el-form :model="form" ref="formRef" :rules="rules" :inline="false">
      <el-form-item label="分类名称" prop="name">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="排序" prop="order">
        <el-input-number
          v-model="form.order"
          :min="0"
          :max="1000"
        ></el-input-number>
      </el-form-item>
    </el-form>
  </FormDrawer>
</template>
<script setup>
import { computed, reactive, ref } from "vue";
import AsideList from "./asideList.vue";
import FormDrawer from "./FormDrawer.vue";
import {
  getImageClassList,
  createImageClass,
  updataImageClass,
  deleteImageClass,
} from "@/api/image_class.js";
import { toast } from "@/composables/util.js";
//加载动画
const loading = ref(false);
const list = ref([]);

//分页
const currentPage = ref(1);
const total = ref(0);
const limit = ref(10);

//获取数据 传的值为页码
function getData(p = null) {
  if (typeof p == "number") {
    currentPage.value = p;
  }
  //加载中动画
  loading.value = true;
  //获取数据的接口
  getImageClassList(currentPage.value)
    .then((res) => {
      //返回的数据装到指定的变量中
      total.value = res.totalCount;
      list.value = res.list;
      //默认选中第一个
      let item = list.value[0];
      //将现在活跃的id编程item的id
      if (item) {
        //修改id
        handleChangeActive(item.id)
      }
    })
    .finally(() => {
      //加载关闭
      loading.value = false;
    });
}
getData();

//定义一个id中间变量
const editId = ref(0);
//如果有这个id的话就是修改的 下面编辑打开弹框的时候将点击的那个id赋值给了editid
const drawerTitle = computed(() => (editId.value ? "修改" : "新增"));

//封装组件配置formDrawwer
const formDrawer = ref(null);
//表单
const form = reactive({
  // 相册名称以及排序
  name: "",
  order: 50,
});
//规则
const rules = {
  name: [
    {
      required: true,
      message: "图库分类不能为空",
      trigger: "blur", //失去焦点
      //触发时机
    },
  ],
};

//触发验证要获取到表单的ref
const formRef = ref(null);

//提交表单
const handleSubmit = () => {
  formRef.value.validate((validate) => {
    if (!validate) return; //如果没填则返回掉 否则提交成功
    formDrawer.value.showLoading();
    //如果有id就是更新 没id就是新增
    const fun = editId.value
      ? updataImageClass(editId.value, form)
      : createImageClass(form);
    fun
      .then((res) => {
        //弹窗
        toast(drawerTitle.value + "成功");
        //刷新数据 如果是编辑 就传当前页页码 如果是新增就传第一页页码
        getData(editId.value ? currentPage.value : 1);
        //关闭弹框
        formDrawer.value.close();
      })
      .finally(() => {
        formDrawer.value.hideLoading();
      });
  });
};

//打开组件
const handleCreate = () => {
  editId.value = 0;
  //初始化一下form
  form.name = "";
  form.order = 50;
  formDrawer.value.open();
};

//编辑
const handleEdit = (row) => {
  //将表单里面的名字编号都变成现在的
  editId.value = row.id;
  form.name = row.name;
  form.order = row.order;
  //然后打开窗口开始编辑
  formDrawer.value.open();
};
//删除分类
const handleDelete=(id)=>{
  loading.value=true
  deleteImageClass(id).then((res)=>{
   toast("删除成功")
   getData()
  }).finally(()=>{
    loading.value=false
  })
}


//自定义事件
const emit=defineEmits(['change'])

//切换分类
const activeId = ref(0);
const handleChangeActive=(id)=>{
  //将现有的id改变
   activeId.value=id
   //将change事件传到父组件 父组件通知另外一个兄弟组件发请求获取数据
   emit("change",id)
}


//在header组件调用Aside组件内的方法打开表单 =》暴露方法
defineExpose({
  handleCreate,
});
</script>
<style>
.image-aside {
  border-right: 1px solid #eeeeee;
  position: relative;
}
.image-aside .top {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 50px;
  overflow-y: auto;
}
.image-aside .bottom {
  @apply flex items-center justify-center;
  position: absolute;
  bottom: 0;
  height: 50px;
  left: 0;
  right: 0;
}
</style>
