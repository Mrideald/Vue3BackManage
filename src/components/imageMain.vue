<template>
  <el-main class="image-main" v-loading="loading">
    <div class="top p-3">
      <!-- <div v-for="(item,index) in list" :key="item.id">{{ item.url}}</div> -->
      <el-row :gutter="10">
        <el-col
          :span="6"
          :offset="0"
          v-for="(item, index) in list"
          :key="item.id"
        >
          <el-card
            shadow="hover"
            class="relative mb-3"
            :body-style="{ padding: 0 }"
            :class="{ 'border-green-500': item.checked }"
          >
            <el-image
              :src="item.url"
              fit="cover"
              class="h-[150px]"
              style="width: 100%"
              :preview-src-list="[item.url]"
              :initial-index="0"
            >
            </el-image>
            <div class="image_title">{{ item.name }}</div>
            <div class="flex justify-center items-center p-2">
              <!-- 复选框 -->
              <el-checkbox
                v-if="openChoose"
                v-model="item.checked"
                @change="handleChooseChange(item)"
              />
              <!-- 重命名 -->
              <el-button
                type="primary"
                size="small"
                text
                @click="handleEdit(item)"
                class="!m-0"
                >重命名</el-button
              >
              <!-- 气泡确认框 确认删除-->
              <el-popconfirm
                title="是否要删除该图片?"
                confirm-button-text="确认"
                cancel-button-text="取消"
                @confirm="handleDelete(item.id)"
              >
                <!-- confirm确认删除后调用自定义删除事件 -->
                <template #reference>
                  <el-button type="primary" size="small" text>删除</el-button>
                </template>
              </el-popconfirm>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
    <div class="bottom">
      <el-pagination
        background
        layout="prev, pager, next"
        :total="total"
        :current-page="currentPage"
        :page-size="limit"
        @current-change="getData"
      />
    </div>
  </el-main>
  <!-- 上传图片抽屉组件 -->
  <el-drawer v-model="drawer" title="上传图片">
    <UploadFile :data="{ image_class_id }" @success="handleUploadSuccess" />
  </el-drawer>
</template>
<script setup>
import { computed, ref } from "vue";
import { getImageList, updataImage, deleteImage } from "@/api/image.js";
import { toast, showPrompt } from "@/composables/util.js";
import UploadFile from "@/components/UploadFile.vue";

//上传图片
const drawer = ref(false);
const openUploadFile = () => {
  drawer.value = true;
};

const props = defineProps({
  openChoose: {
    type: Boolean,
    default: false,
  },
  limit: {
    type: Number,
    default: 1,
  },
});

//分页
const currentPage = ref(1);
const total = ref(0);
const limit = ref(10);
const list = ref([]);
const loading = ref(false);
//当前图库分类
const image_class_id = ref(0);

//获取数据 传的值为页码
function getData(p = null) {
  if (typeof p == "number") {
    currentPage.value = p;
  }
  //加载中动画
  loading.value = true;
  //获取数据的接口
  getImageList(image_class_id.value, currentPage.value)
    .then((res) => {
      //返回的数据装到指定的变量中
      total.value = res.totalCount;
      // 存储数据并复选框的check属性
      list.value = res.list.map((o) => {
        o.checked = false;
        return o;
      });
    })
    .finally(() => {
      //加载关闭
      loading.value = false;
    });
}

//根据分类id加载图片列表  这里的图片数据要等左边列表加载出来之后再加载 默认为第一页 所以把方法暴露出去给左边列表那边加载完之后调用这个方法
const loadData = (id) => {
  (currentPage.value = 1), //当前页为1
    (image_class_id.value = id), //当前分类id等于传过来的值
    //加载图片数据
    getData();
};

//重命名
const handleEdit = (item) => {
  showPrompt("重命名", item.name).then(({ value }) => {
    loading.value = true;
    updataImage(item.id, value)
      .then((res) => {
        toast("修改成功");
        getData();
      })
      .finally(() => {
        loading.value = false;
      });
  });
};

//删除
const handleDelete = (id) => {
  loading.value = true;
  deleteImage([id])
    .then((res) => {
      toast("删除成功");
      getData();
    })
    .finally(() => {
      loading.value = false;
    });
};
//上传成功
const handleUploadSuccess = () => {
  getData(1);
};

// 选中照片后通知父组件
const emit = defineEmits(["choose"]);
//选中图片
// 只能选一张照片 这里计算一下有多少张选中了
const checkedImage = computed(() => list.value.filter((o) => o.checked));
const handleChooseChange = (item) => {
  if (item.checked && checkedImage.value.length > props.limit) {
    item.checked = false;
    return toast("最多只能选中1张照片", "error");
  }
  emit("choose", checkedImage.value);
};

defineExpose({
  loadData,
  openUploadFile,
});
</script>

<style>
.image-main {
  position: relative;
}
.image-main .top {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 50px;
  overflow-y: auto;
}
.image-main .bottom {
  @apply flex items-center justify-center;
  position: absolute;
  bottom: 0;
  height: 50px;
  left: 0;
  right: 0;
}
.image_title {
  position: absolute;
  top: 122px;
  left: -1px;
  right: -1px;
  @apply text-sm truncate text-gray-100 bg-opacity-50 bg-gray-800 px-2 py-1;
}
</style>
