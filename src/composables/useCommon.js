import { reactive, ref, computed } from "vue";
import { toast } from "@/composables/util.js";
//// 封装 搜索和列表分页 获取数据 内容 删除 修改状态
export function useInitTable(opt = {}) {
  let searchForm = null; //接收传来的数据  搜索内容 这个也作为getdata的参数去发请求
  let resetSearchForm = null; //重置表单 默认定义一下
  if (opt.searchForm) {
    //解构传来的数据 比如{keyword:""}  用reactive接收 变成响应式
    searchForm = reactive({ ...opt.searchForm });

    //重置表单
    resetSearchForm = () => {
      // 遍历searchForm的key
      for (const key in opt.searchForm) {
        // 传来的数据都是默认的空 或者值 重置的直接遍历之后让他等于传来的即可
        searchForm[key] = opt.searchForm[key];
      }
      getData();
    };
  }

  const loading = ref(false); //加载中
  //分页
  const currentPage = ref(1); //当前页
  const total = ref(0); //总共几条
  const limit = ref(10); //限制
  const list = ref([]); //列表

  // 获取数据
  function getData(p = null) {
    // 获取数据的方法
    if (typeof p == "number") {
      currentPage.value = p;
    }
    loading.value = true;
    // 两个组件获取数据的接口不一样 用getlist替代接口 在外面传数据过来
    opt
      .getList(currentPage.value, searchForm)
      .then((res) => {
        // 如果外面配置了回调函数 就使用外面的 没有的话就执行默认的else
        if (opt.onGetListSuccess && typeof opt.onGetListSuccess == "function") {
          opt.onGetListSuccess(res); //把成功的回调拿回去
        } else {
          list.value = res.list;
          total.value = res.totalCount;
        }
      })
      //最后
      .finally(() => {
        loading.value = false;
      });
  }
  getData();

  //修改状态
  const handleStatusChange = async (status, row) => {
    console.log(status,row,'status,row');
    row.statusLoading = true; //加载中开启
    await opt.updataStatus(row.id, status);
    toast("修改状态成功");
    row.status = status;
    row.statusLoading = false; //加载中关闭
  };

  //删除功能
  const handleDelete = (id) => {
    loading.value = true;
    opt.delete(id);
    setTimeout(() => {
      toast("删除成功");
      getData();
      loading.value = false;
    }, 1000);
  };

  //多选选中id
const multiSelectionIds = ref([]);
const handleSelectionChange = (e) => {
  // 拿到选中的每一个的id组成数组
  multiSelectionIds.value = e.map((o) => o.id);
};

  //批量删除
const multipleTableRef=ref(null)
const handleMultDelete = () => {
  loading.value = true;
  opt.delete(multiSelectionIds.value)
    .then((res) => {
      toast("删除成功")
      if(multipleTableRef.value){
        multipleTableRef.value.clearSelection()
      }
      getData()
    })
    .finally(() => {
      loading.value = false;
    });
};

  return {
    searchForm, //接收关键词
    resetSearchForm, //接收重置
    list, //列表
    loading, //加载中
    currentPage, //当前页
    total,
    limit,
    getData, //获取数据
    handleStatusChange, //修改状态
    handleDelete, //删除
    handleSelectionChange,//多选id
    multipleTableRef,//表格节点获取
    handleMultDelete//多选删除
  };
}

// 封装新增 修改
export function useInitForm(opt = {}) {
  //表单部分
  const FormDrawerRef = ref(null);
  const formRef = ref(null);
  //opt会传过来
  const form = reactive({});
  const rules = opt.rules || {};
  //新增和修改公用一个表单组件 用一个id区分
  const editId = ref(null);
  //要获取到还要写.value
  const drawerTitle = computed(() => (editId.value ? "修改" : "新增"));
  //提交表单 新增和修改公告
  const handleSubmit = () => {
    formRef.value.validate((valid) => {
      if (!valid) return;
      FormDrawerRef.value.showLoading();
      //定义一个中间量判别调哪个接口
      editId.value ? opt.update(editId.value, form) : opt.create(form);
      //后续操作 promise.then不管用
      setTimeout(() => {
        //成功的提示
        toast(drawerTitle.value + "成功");
        //获取数据 如果是修改的话就获取这一页的数据 opt传来getdata 这个是请求后的.then内容
        opt.getData(editId.value ? false : 1);
        //关闭加载
        FormDrawerRef.value.hideLoading();
        //关闭弹框
        FormDrawerRef.value.close();
      }, 1000);
    });
  };

  //修改管理员
  const handleEdit = (row) => {
    editId.value = row.id;
    // 表单内容为当前对象
    // 重置表单内容
    for (const key in row) {
      form[key] = row[key];
    }
    FormDrawerRef.value.open();
  };

  //新增管理员
  const handleCreate = () => {
    editId.value = 0;
    // 重置表单内容
    for (const key in opt.form) {
      form[key] = opt.form[key];
    }
    FormDrawerRef.value.open();
  };

  return {
    FormDrawerRef,
    formRef,
    form,
    rules,
    editId,
    drawerTitle,
    handleSubmit,
    handleEdit,
    handleCreate,
  };
}
