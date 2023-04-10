import { updatePassword } from "@/api/manager.js";
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import { toast, showModal } from "@/composables/util.js";
import { useStore } from "vuex";
//修改密码
export function useRepassword() {
  const router = useRouter();
  const store = useStore();

  const formRef = ref(null);
  //控制修改密码框
  const formDrawerRef = ref(null);

  const form = reactive({
    oldpassword: "",
    password: "",
    repassword: "",
  });

  const rules = {
    oldpassword: [
      {
        required: true,
        message: "旧密码不能为空",
        trigger: "blur",
        //触发时机
      },
    ],
    password: [
      {
        required: true,
        message: "新密码不能为空",
        trigger: "blur",
        //触发时机
      },
    ],
    repassword: [
      {
        required: true,
        message: "确认密码不能为空",
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
        formDrawerRef.value.showLoading();
        //修改密码
        updatePassword(form)
          .then((res) => {
            toast("修改密码成功,请重新登录");
            store.dispatch("logOut").then((res) => {
              router.push("/login");
            });
          })
          .finally(() => {
            formDrawerRef.value.hideLoading();
          });
      }
    });
  };

  //处理修改密码
  const handleUpdataPaw = () => {
    formDrawerRef.value.open();
  };
  return {
    formDrawerRef,
    form,
    rules,
    onSubmit,
    formRef,
    handleUpdataPaw,
  };
}
//退出登录
export function useLogout() {
  const router = useRouter();
  const store = useStore();
  function handleLogout() {
    //展示确认页
    showModal("是否确认退出?").then((res) => {
      store.dispatch("logOut").then((res) => {
        toast("退出登录成功");
        //跳转回登录页
        router.push("/login");
      });
    });
  }
  return {
    handleLogout,
  };
}
