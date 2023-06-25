<template>
  <el-card shadow="never" class="border-0">
    <!-- 搜索 组件 内部使用插槽-->
    <Search @search="getData" @reset="resetSearchForm" :model="searchForm">
      <SearchItem label="关键词">
        <el-input
          v-model="searchForm.title"
          placeholder="商品标题"
          clearable
        ></el-input>
      </SearchItem>
    </Search>

    <!-- 表格 -->
    <el-table :data="list" stripe style="width: 100%" v-loading="loading">
      <el-table-column type="expand">
        <template #default="{ row }">
          <div class="flex pl-18">
            <el-avatar
              :size="50"
              shape="circle"
              :src="row.user.avatar"
              fit="fill"
              class="mr-3"
            ></el-avatar>
            <div class="flex-1">
              <h6 class="flex item-center">
                {{ row.user.nickname || row.user.username }}
                <small class="text-gray-400 ml-2">{{ row.review_time }}</small>
                <el-button size="small" class="ml-auto">回复</el-button>
              </h6>
              {{ row.review_data }}
              <div class="py-2">
                <el-image
                  v-for="(item, index) in row.review.image"
                  :key="index"
                  :src="item"
                  fit="cover"
                  :lazy="true"
                  style="width:100px;height: 100px;"
                  class="rounded"
                ></el-image>
              </div>
              <div class="mt-3 bg-gray-100 p-3 rounded" v-for="(item,index) in row.extra" :key="index">
                <h6 class="flex font-bold">客服
                    <el-button type="info" size="small" class="ml-auto">修改</el-button>
                </h6>
                <p>{{ item.data }}</p>
              </div>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="ID" align="center" prop="id" />
      <el-table-column label="商品" >
        <template #default="{ row }">
          <div class="flex items-center">
            <el-image
              :src="row.goods_item ? row.goods_item.cover : ''"
              fit="fill"
              :lazy="true"
              style="width: 50px; height: 50px"
              class="rounded"
            ></el-image>
            <!-- 右边部分 -->
            <div class="ml-3">
              <!-- row.goods_item?row.goods_item.title:'商品已被删除' -->
              <h6>{{ row.goods_item?.title ?? "商品已被删除" }}</h6>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="评价信息" >
        <template #default="{ row }">
          <div>
            <p>用户:{{ row.user.nickname || row.user.username }}</p>
            <p>
              <el-rate
                v-model="row.rating"
                disabled
                show-score
                text-color="#ff9900"
              ></el-rate>
            </p>
          </div>
        </template>
      </el-table-column>

      <el-table-column label="评价时间" align="center" prop="review_time">
      </el-table-column>

      <!-- 状态部分 -->
      <el-table-column label="状态">
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
  </el-card>
</template>
<script setup>
import { ref } from "vue";
import {
  getGoodsCommonList,
  updateGoodsCommonStatus,
} from "@/api/goods_common.js";
import Search from "@/components/Search.vue";
import SearchItem from "../../components/SearchItem.vue";
// 引入封装组件
import { useInitTable } from "../../composables/useCommon";
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
} = useInitTable({
  searchForm: { title: "" },
  getList: getGoodsCommonList,
  onGetListSuccess: (res) => {
    //给list添加一个statusloading属性 加载中 其实可以用不到 因为下面返回的是函数不是promise对象 函数一下就执行了 显示不出加载中
    list.value = res.list.map((o) => {
      o.statusLoading = false;
      return o;
    });
    total.value = res.totalCount;
    roles.value = res.roles;
  },
  updataStatus: updateGoodsCommonStatus,
});
</script>
