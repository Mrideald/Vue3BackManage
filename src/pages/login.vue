<template>
  <div class="rowContainer">
    <div class="welCome">欢迎光临EdgeDiary后台管理系统</div>
    <div class="rightContainer">
      <span class="baitiao"></span>
      <span>账号密码登录</span>
      <span class="baitiao"></span>
    </div>
    <el-form ref="formRef" :model="form" :rules="rules" class="w-[250px]">
      <el-form-item prop="username">
        <el-input v-model="form.username" placeholder="请输入用户名">
          <template #prefix>
            <el-icon><user /></el-icon>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          v-model="form.password"
          type="password"
          show-password
          placeholder="请输入密码"
        >
          <template #prefix>
            <el-icon><lock /></el-icon>
          </template>
        </el-input>
      </el-form-item>

      <el-form-item>
        <el-button
          class="btn"
          color="#1E9FFF"
          round
          type="primary"
          @click="onSubmit"
          :loading="loading"
          >登录</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onBeforeUnmount } from "vue";
import { useRouter } from "vue-router";
import { toast } from "@/composables/util.js";
import { useStore } from "vuex";

const router = useRouter();
//获取到组件值
const formRef = ref(null);
const loading = ref(false);
const store = useStore();

// do not use same name with ref
const form = reactive({
  username: "",
  password: "",
});

const rules = {
  username: [
    {
      required: true,
      message: "用户名不能为空",
      trigger: "blur",
      //触发时机
    },
    {
      min: 3,
      max: 5,
      message: "用户名长度必须是3-5个字符",
      trigger: "blur",
    },
  ],
  password: [
    {
      required: true,
      message: "用户名不能为空",
      trigger: "blur",
      //触发时机
    },
  ],
};

const onSubmit = () => {
  formRef.value.validate((valid) => {
    if (!valid) {
      return false;
    } else {
      loading.value = true;
      //登录
      store
        .dispatch("login", form)
        .then((res) => {
          toast("登录成功");
          //跳转到后台首页
          router.push("/");
        })
        .finally(() => {
          loading.value = false;
        });
    }
  });
};

//监听回车事件
function onKeyUp(e) {
  if (e.key == "Enter") {
    onSubmit();
  }
}
//挂载完毕后添加事件
onMounted(() => {
  document.addEventListener("keyup", onKeyUp);
});

//移除键盘监听
onBeforeUnmount(() => {
  document.removeEventListener("keyup", onKeyUp);
});
</script>

<style>
/* 抽离样式 */
.rowContainer {
  @apply min-h-screen;
  background-image: url("@/assets/images/login/bg3.jpg");
  background-size: 100% 100%;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.elCol {
  @apply flex items-center justify-center flex-col;
}
.welCome {
  @apply font-bold text-5xl text-rose-900;
}
.welComeJoin {
  @apply text-gray-200 text-sm my-2;
}
.welComeBack {
  @apply font-bold text-3xl text-gray-800;
}
.rightContainer {
  @apply flex items-center space-x-2 justify-center my-5 text-gray-300;
}
.btn{
  width: 250px;
  color: #fff;
  border: none;
}
.btn:hover{
  background-color: #18c184;
  color: #fff;
}
.baitiao {
  @apply h-[1px] w-16 bg-gray-200;
}
</style>
