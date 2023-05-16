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
        <SearchItem label="关键词">
          <el-input
            v-model="searchForm.title"
            placeholder="商品名称"
            clearable
          ></el-input>
        </SearchItem>
        <!-- 商品分类插槽 -->
        <template #show>
          <SearchItem label="商品分类">
            <el-select
              v-model="searchForm.category_id"
              placeholder="请选择商品分类"
              clearable
            >
              <el-option
                v-for="item in category_list"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </SearchItem>
        </template>
      </Search>
      <!-- 新增和刷新等等五个按钮 -->
      <ListHeader
        layout="create,delete,refresh"
        @create="handleCreate"
        @refresh="getData"
        @delete="handleMultDelete"
      >
        <!-- 上架状态就是1 反之是0 -->
        <!-- 上架和下架都在all显示 其中上架在所有下架中显示 下架在所有上架中显示 -->
        <el-button
          v-if="searchForm.tab == 'all' || searchForm.tab == 'off'"
          size="small"
          @click="handleMultStatusChange(1)"
          >上架</el-button
        >
        <el-button
          v-if="searchForm.tab == 'all' || searchForm.tab == 'saling'"
          size="small"
          @click="handleMultStatusChange(0)"
          >下架</el-button
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
        <!-- 头像部分 -->
        <el-table-column label="商品" width="300px">
          <!-- 结构出当前的对象 本来的形式是默认插槽是scope 当前对象是scope.row -->
          <template #default="{ row }">
            <div class="flex">
              <el-image
                class="mr-3 rounded"
                :src="row.cover"
                fit="cover"
                :lazy="true"
                style="width: 50px; height: 50px"
              >
              </el-image>
              <div class="flex-1">
                <p>{{ row.title }}</p>
                <div>
                  <span class="text-rose-500">￥{{ row.min_price }}</span>
                  <el-divider direction="vertical" />
                  <span class="text-gray-500 text-xs"
                    >￥{{ row.min_price }}</span
                  >
                </div>
                <p class="text-gray-400 text-xs mb-1">
                  分类:{{ row.category ? row.category.name : "未分类" }}
                </p>
                <p class="text-gray-400 text-xs">
                  创建时间:{{ row.create_time }}
                </p>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="实际销量"
          width="100"
          prop="sale_count"
          align="center"
        />

        <el-table-column label="商品状态" width="110" align="center">
          <template #default="{ row }">
            <el-tag :type="row.status ? 'success' : 'danger'" size="small">
              {{ row.status ? "上架" : "仓库" }}
            </el-tag>
          </template>
        </el-table-column>

        <!-- 审核状态 为0就是没审核的 为1就是通过 为2就是拒绝 -->
        <el-table-column
          label="审核状态"
          width="110"
          align="center"
          v-if="searchForm.tab != 'delete'"
        >
          <template #default="{ row }">
            <div v-if="row.ischeck == 0">
              <el-button type="success" size="small" plain>审核通过</el-button>
              <el-button
                style="margin: 4px 0 0"
                type="danger"
                size="small"
                plain
                >审核拒绝</el-button
              >
            </div>
            <span v-else>
              {{ row.ischeck == 1 ? "通过" : "拒绝" }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          label="总库存"
          width="110"
          prop="stock"
          align="center"
        />
        <!-- 操作 -->
        <el-table-column label="操作" align="center">
          <template #default="scope">
            <!-- 插槽可以接收到父组件的data值 scope.row就是每一行的tableData -->
            <!-- <h1>{{ scope.row }}</h1> -->
            <div v-if="searchForm.tab != 'delete'">
              <el-button
                class="px-1"
                size="small"
                text
                type="primary"
                @click="handleEdit(scope.row)"
                >修改</el-button
              >
              <el-button class="px-1" size="small" text type="primary"
              @click="handleSetGoodsSkus(scope.row)"
              :loading="scope.row.skusLoading"
                >商品规格</el-button
              >
              <el-button
                class="px-1"
                size="small"
                text
                :type="
                  scope.row.goods_banner.length == 0 ? 'danger' : 'primary'
                "
                @click="handleSetGoodsBanners(scope.row)"
                :loading="scope.row.bannersLoading"
                >设置轮播图</el-button
              >
              <el-button
                class="px-1"
                size="small"
                text
                :type="scope.row.content== null ? 'danger' : 'primary'"
                @click="handleSetGoodsContent(scope.row)"
                :loading="scope.row.contentLoading"
                >商品详情</el-button
              >
              <!-- 气泡确认框 确认删除-->
              <el-popconfirm
                title="是否要删除该商品?"
                confirm-button-text="确认"
                cancel-button-text="取消"
                @confirm="handleDelete(scope.row.id)"
              >
                <!-- confirm确认删除后调用自定义删除事件 -->
                <template #reference>
                  <el-button size="small" text type="primary">删除</el-button>
                </template>
              </el-popconfirm>
            </div>
            <span v-else>暂无操作</span>
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
      <!-- 表单信息组件 -->
      <FormDrawer
        ref="FormDrawerRef"
        :title="drawerTitle"
        @submit="handleSubmit"
      >
        <el-form
          :model="form"
          ref="formRef"
          :rules="rules"
          label-width="80px"
          :inline="false"
        >
          <!-- 表单内容 商品名称 -->
          <el-form-item label="商品名称" prop="title">
            <el-input
              v-model="form.title"
              placeholder="请输入商品名称,不能超过60个字符"
            ></el-input>
          </el-form-item>
          <!-- 封面 -->
          <el-form-item label="封面" prop="cover">
            <ChooseImage v-model="form.cover" />
          </el-form-item>
          <!-- 商品分类 -->
          <el-form-item label="商品分类" prop="category_id">
            <!-- 下拉框 -->
            <el-select
              v-model="form.category_id"
              placeholder="选择所属商品分类"
            >
              <el-option
                v-for="item in category_list"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <!-- 商品描述-->
          <el-form-item label="商品描述" prop="desc">
            <el-input
              type="textarea"
              v-model="form.desc"
              placeholder="选填，商品卖点"
            ></el-input>
          </el-form-item>
          <!-- 单位 -->
          <el-form-item label="单位" prop="unit">
            <el-input
              v-model="form.unit"
              placeholder="请输入单位"
              style="width: 50%"
            ></el-input>
          </el-form-item>
          <!-- 四个同类型-->
          <el-form-item label="总库存" prop="stock">
            <el-input v-model="form.stock" type="number" style="width: 30%">
              <template #append>件</template>
            </el-input>
          </el-form-item>
          <el-form-item label="库存预警" prop="min_stock">
            <el-input v-model="form.min_stock" type="number" style="width: 30%">
              <template #append>件</template>
            </el-input>
          </el-form-item>
          <el-form-item label="最低销售价" prop="min_price">
            <el-input v-model="form.min_price" type="number" style="width: 30%">
              <template #append>元</template>
            </el-input>
          </el-form-item>
          <el-form-item label="最低原价" prop="min_oprice">
            <el-input
              v-model="form.min_oprice"
              type="number"
              style="width: 30%"
            >
              <template #append>元</template>
            </el-input>
          </el-form-item>
          <el-form-item label="库存显示" prop="stock_display">
            <el-radio-group v-model="form.stock_display">
              <el-radio :label="0">隐藏</el-radio>
              <el-radio :label="1">显示</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="是否上架" prop="status">
            <el-radio-group v-model="form.status">
              <el-radio :label="0">放入仓库</el-radio>
              <el-radio :label="1">立即上架</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </FormDrawer>
    </el-card>
    <!-- 一些点击的属性 -->
    <Banners ref="BannersRef" @reloadData="getData" />
    <Content ref="ContentRef" @reloadData="getData" />
    <Skus ref="SkusRef" @reloadData="getData" />
  </div>
</template>
<script setup>
import { ref } from "vue";
import {
  getGoodsList,
  updataGoodsStatus,
  createGoods,
  updataGoods,
  deleteGoods,
} from "@/api/goods.js";
import { getCategoryList } from "@/api/category.js";
import FormDrawer from "@/components/FormDrawer.vue";
import ChooseImage from "@/components/chooseImage.vue";
import ListHeader from "@/components/ListHeader.vue";
import Search from "@/components/Search.vue";
import SearchItem from "../../components/SearchItem.vue";
import Banners from "./banners.vue";
import Content from "./content.vue";
import Skus from "./skus.vue";
// 引入封装组件
import { useInitTable, useInitForm } from "../../composables/useCommon";
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
  handleDelete,
  handleSelectionChange,
  multipleTableRef,
  handleMultDelete,
  handleMultStatusChange,
} = useInitTable({
  searchForm: {
    title: "",
    tab: "all",
    category_id: null,
  },
  getList: getGoodsList,
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
  delete: deleteGoods,
  updataStatus: updataGoodsStatus,
});

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
    title: null, //商品名称
    category_id: null, //商品分类
    cover: null, //商品封面
    desc: null, //商品描述
    unit: "件", //商品单位
    stock: 100, //总库存
    min_stock: 10, //库存预警
    status: 1, //是否上架 0仓库1上架
    stock_display: 1, //库存显示 0隐藏 1显示
    min_price: 0, //最低销售价
    min_oprice: 0, //最低原价
  },
  rules: {
    username: [
      {
        required: true,
        message: "用户名不能为空",
        trigger: "blur",
      },
    ],
    password: [
      {
        required: true,
        message: "密码不能为空",
        trigger: "blur",
      },
    ],
  },
  getData,
  update: updataGoods,
  create: createGoods,
});
//订单类型：all全部，checking审核中，saling出售中，off已下架，min_stock库存预警，delete回收站
const tabbars = [
  {
    key: "all",
    name: "全部",
  },
  {
    key: "checking",
    name: "审核中",
  },
  {
    key: "saling",
    name: "出售中",
  },
  {
    key: "off",
    name: "已下架",
  },
  {
    key: "min_stock",
    name: "库存预警",
  },
  {
    key: "delete",
    name: "回收站",
  },
];

//商品分类
const category_list = ref([]);
getCategoryList().then((res) => {
  category_list.value = res;
});

//设置轮播图
const BannersRef = ref(null);
const handleSetGoodsBanners = (row) => {
  BannersRef.value.open(row);
};

//设置商品详情
const ContentRef = ref(null);
const handleSetGoodsContent = (row) => {
  ContentRef.value.open(row);
};

//设置商品规格
const SkusRef = ref(null);
const handleSetGoodsSkus = (row) => {
  SkusRef.value.open(row);
};
</script>
