<template>
  <div>
    <el-tabs v-model="searchForm.tab" @tab-change="getData" :model="searchForm">
      <el-tab-pane
        v-for="item in tabbars"
        :key="item.key"
        :label="item.name"
        :name="item.key"
      >
      </el-tab-pane>
    </el-tabs>

    <el-card shadow="never" class="border-0">
      <!-- 搜索 组件 内部使用插槽-->
      <Search @search="getData" @reset="resetSearchForm" :model="searchForm">
        <SearchItem label="订单编号">
          <el-input
            v-model="searchForm.no"
            placeholder="订单编号"
            clearable
          ></el-input>
        </SearchItem>
        <!-- 商品分类插槽 -->
        <template #show>
            <SearchItem label="订单编号">
                <el-input v-model="searchForm.no" placeholder="订单编号" clearable></el-input>
            </SearchItem>
            <SearchItem label="收货人">
                <el-input v-model="searchForm.name" placeholder="收货人" clearable></el-input>
            </SearchItem>
            <SearchItem label="手机号">
                <el-input v-model="searchForm.phone" placeholder="手机号" clearable></el-input>
            </SearchItem>
            <SearchItem label="开始时间">
               <el-date-picker
               v-model="searchForm.starttime"
               type="date"
               placeholder="开始日期"
               style="width: 90%;"
               value-format="YYYY-MM-DD"
               >
               </el-date-picker>
            </SearchItem>
            <SearchItem label="结束时间">
              <el-date-picker
               v-model="searchForm.endtime"
               type="date"
               placeholder="结束日期"
               style="width: 90%;"
               value-format="YYYY-MM-DD"
               >
               </el-date-picker>
            </SearchItem>
          </template>
      </Search>
      <!-- 刷新按钮显示不出来-->
      <ListHeader layout="refresh,download" @refresh="getData" @download="handleExportExcel">
        <el-button size="small" type="danger" @click="handleMultDelete"
          >批量删除</el-button
        >
      </ListHeader>
      <!-- 表格 -->
      <el-table
        @selection-change="handleSelectionChange"
        ref="multipleTableRef"
        :data="list"
        stripe
        style="width: 100%"
        v-loading="loading"
      >
        <!-- 多选 -->
        <el-table-column type="selection" width="55" />
        <el-table-column label="商品" width="300px">
          <!-- 结构出当前的对象 本来的形式是默认插槽是scope 当前对象是scope.row -->
          <template #default="{ row }">
            <div>
              <div class="flex text-sm">
                <div class="flex-1">
                  <p>订单号:</p>
                  <small>{{ row.no }}</small>
                </div>
                <div>
                  <p>下单时间</p>
                  <small> {{ row.create_time }} </small>
                </div>
              </div>
              <div
                class="flex py-2"
                v-for="(item, index) in row.order_items"
                :key="index"
              >
                <el-image
                  :src="item.goods_item ? item.goods_item.cover : ''"
                  fit="cover"
                  :lazy="true"
                  style="width: 30px; height: 30px"
                ></el-image>
                <p class="text-blue-500 ml-2">
                  {{ item.goods_item ? item.goods_item.title : "商品已被删除" }}
                </p>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="实际付款"
          width="120"
          prop="total_price"
          align="center"
        />

        <el-table-column label="买家" align="center">
          <template #default="{ row }">
            <p>{{ row.user.nickname || row.user.username }}</p>
            <small> (用户id:{{ row.user.id }}) </small>
          </template>
        </el-table-column>
        <el-table-column label="交易状态" align="center">
          <template #default="{ row }">
            <div>
              <div>
                付款状态:
                <el-tag
                  v-if="row.payment_method == 'wechat'"
                  type="success"
                  size="small"
                  >微信支付</el-tag
                >
                <el-tag
                  v-if="row.payment_method == 'alipay'"
                  size="small"
                  >支付宝支付</el-tag
                >
                <el-tag v-else type="info" size="small">未支付</el-tag>
              </div>
              <div>
                发货状态:
                <el-tag :type="row.ship_data ? 'success' : 'info'" size="small">
                  {{ row.ship_data ? "已发货" : "未发货" }}
                </el-tag>
              </div>
              <div>
                收货状态:
                <el-tag
                  :type="row.ship_status == 'received' ? 'success' : 'info'"
                  size="small"
                >
                  {{ row.ship_status ? "已收货" : "未收货" }}
                </el-tag>
              </div>
            </div>
          </template>
        </el-table-column>
        <!-- 操作 -->
        <el-table-column label="操作" align="center">
          <template #default="scope">
            <el-button class="px-1" type="primary" size="small" text
              >订单详情</el-button
            >
            <el-button v-if="searchForm.tab==='noship'" class="px-1" type="primary" size="small" text
              >订单发货</el-button
            >
            <el-button v-if="searchForm.tab==='refunding'" class="px-1" type="primary" size="small" text
              >同意退款</el-button
            >
            <el-button v-if="searchForm.tab==='refunding'" class="px-1" type="primary" size="small" text
              >拒绝退款</el-button
            >
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
  </div>
</template>
<script setup>
import { getOrderList, deleteOrder } from "@/api/order.js";
import ListHeader from "@/components/ListHeader.vue";
import Search from "@/components/Search.vue";
import SearchItem from "../../components/SearchItem.vue";
// 引入封装组件
import { useInitTable } from "../../composables/useCommon";
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
  handleSelectionChange,
  multipleTableRef,
  handleMultDelete,
} = useInitTable({
  searchForm: {
    no: "",
    tab: "all",
    starttime: "",
    endtime: "",
    phone: "",
  },
  getList: getOrderList,
  onGetListSuccess: (res) => {
    //给list添加一个statusloading属性 加载中 其实可以用不到 因为下面返回的是函数不是promise对象 函数一下就执行了 显示不出加载中
    list.value = res.list.map((o) => {
      o.bannersLoading = false;
      o.contentLoading = false;
      o.skusLoading = false;
      return o;
    });
    total.value = res.totalCount;
  },
  delete: deleteOrder,
});

const tabbars = [
  {
    key: "all",
    name: "全部",
  },
  {
    key: "nopay",
    name: "待支付",
  },
  {
    key: "noship",
    name: "待发货",
  },
  {
    key: "shiped",
    name: "待收货",
  },
  {
    key: "received",
    name: "已收货",
  },
  {
    key: "finish",
    name: "已完成",
  },
  {
    key: "closed",
    name: "已关闭",
  },
  {
    key: "refunding",
    name: "退款中",
  },
];

const handleExportExcel=()=>{
  console.log("导出数据")
}
</script>
