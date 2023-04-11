<template>
  <div class="f-tag-list" :style="{ left: $store.state.asideWidth }">
    <el-tabs
      v-model="activeTab"
      type="card"
      class="flex-1"
      @tab-remove="removeTab"
      @tab-change="changeTab"
      style="min-width: 100px"
    >
      <el-tab-pane
        :closable="item.path != '/'"
        v-for="item in tabList"
        :key="item.path"
        :label="item.title"
        :name="item.path"
      >
      </el-tab-pane>
    </el-tabs>

    <span class="tag-btn">
      <el-dropdown @command="handleClose">
        <span class="el-dropdown-link">
          <el-icon>
            <arrow-down />
          </el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="clearOther">关闭其他</el-dropdown-item>
            <el-dropdown-item command="clearAll">全部关闭</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </span>
  </div>
  <!-- 占位  -->
  <div style="height: 44px"></div>
</template>

<script setup>
import { ref } from "vue";
import { useRoute, useRouter, onBeforeRouteUpdate } from "vue-router";
import { useCookies } from "@vueuse/integrations/useCookies";
const cookie = useCookies();
const route = useRoute();
const router = useRouter();
const activeTab = ref(route.path);
const tabList = ref([
  {
    title: "后台首页",
    path: "/",
  },
]);

function addTags(tab) {
  //如果找不到的话就是true
  let noTab = tabList.value.findIndex((item) => item.path == tab.path) == -1;
  if (noTab) {
    tabList.value.push(tab);
  }
  cookie.set("tabList", tabList.value);
}
//初始化标签导航列表 防止刷新之后就没了
function initTabList() {
  let tbs = cookie.get("tabList");
  if (tbs) {
    tabList.value = tbs;
  }
}
initTabList();
//添加一个新的标签导航
onBeforeRouteUpdate((to, from) => {
  activeTab.value = to.path;
  addTags({ title: to.meta.title, path: to.path });
});

const changeTab = (e) => {
  activeTab.value = e;
  router.push(e);
};
//删除标签
const removeTab = (t) => {
  //获取到当前展示的标签地址
  let a = activeTab.value;
  //获取到所有标签
  let tabs = tabList.value;
  //如果当前展示的标签是要删的
  if (a == t) {
    tabs.forEach((tab, index) => {
      //如果要删的那个在tablist里面
      if (tab.path == t) {
        //获取到他的下一个标签或者上一个标签
        const nextTab = tabs[index + 1] || tabs[index - 1];
        if (nextTab) {
          //将a赋值个上一个或者下一个标签
          a = nextTab.path;
        }
      }
    });
  }
  //把当前活跃的标签给到a
  activeTab.value = a;
  //过滤掉选中的这个标签
  tabList.value = tabList.value.filter((tab) => tab.path != t);
  //更新存储
  cookie.set("tabList", tabList.value);
};

const handleClose = (c) => {
  //切换回首页
  if (c == "clearAll") {
    activeTab.value = "/";
    //过滤只剩下首页
    tabList.value = tabList.value.filter((tab) => tab.path == "/");
  } else if (c == "clearOther") {
    tabList.value = tabList.value.filter(
      (tab) => tab.path == "/" || tab.path == activeTab.value
    );
  }
  cookie.set("tabList", tabList.value);
};
</script>

<style scoped>
.f-tag-list {
  @apply fixed bg-gray-100 flex items-center px-2;
  top: 64px;
  right: 0;
  height: 44px;
  z-index: 100;
}
.tag-btn {
  @apply bg-white rounded ml-auto flex items-center justify-center px-2;
  height: 32px;
}

:deep(.el-tabs__header) {
  @apply mb-0;
}
:deep(.el-tabs__nav) {
  border: 0 !important;
}
:deep(.el-tabs__header) {
  @apply mb-0;
  border: 0 !important;
}
:deep(.el-tabs__item) {
  border: 0 !important;
  height: 32px;
  line-height: 32px;
  @apply bg-white m-1 rounded;
}

:deep(.is-disabled) {
  cursor: not-allowed;
  @apply text-gray-300;
}
</style>
