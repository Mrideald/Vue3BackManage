<template>
  <div ref="el">
    <el-card shadow="never">
      <template #header>
        <div class="flex justify-between">
          <span class="text-sm">订单统计</span>
          <div>
            <el-check-tag
              v-for="(item, index) in options"
              :key="index"
              :checked="current == item.value"
              style="margin-right: 8px"
              @click="handleChoose(item.value)"
            >
              {{ item.text }}
            </el-check-tag>
          </div>
        </div>
      </template>
      <!-- card body 图表区 -->
      <div id="chart" style="width: 100%; height: 300px"></div>
    </el-card>
  </div>
</template>
<!-- 完善echarts表格 -->
<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import * as echarts from "echarts";
import { getStatistics3 } from "@/api/index.js";
import { useResizeObserver } from "@vueuse/core";
const current = ref("week");
const options = [
  { text: "近1个月", value: "month" },
  { text: "近1周", value: "week" },
  { text: "近24小时", value: "hour" },
];
//切换点击的哪个
const handleChoose = (type) => {
  current.value = type;
  getData();
};
var myChart = null;
onMounted(() => {
  //因为setup在组件没创建之前就调用了 所以不能写在外面
  var chartDom = document.getElementById("chart");
  //节点存在才去初始化图标 获取数据 不存在就不操作
  if (chartDom) {
    //init初始化图表
    myChart = echarts.init(chartDom);
    useResizeObserver(el, (entries) => {
      console.log(entries,'entries');
      //每次缩放都会触发这个方法
      myChart.resize(); //改变图标尺寸 参数不指定的话自动获取dom宽度
    });
    getData();
  }
});
onBeforeUnmount(() => {
  if (myChart) {
    //销毁实例
    echarts.dispose(myChart);
  }
});

function getData() {
  var option;

  option = {
    xAxis: {
      type: "category",
      data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        data: [120, 200, 150, 80, 70, 110, 130],
        type: "bar",
        showBackground: true,
        backgroundStyle: {
          color: "rgba(180, 180, 180, 0.2)",
        },
      },
    ],
  };
  myChart.showLoading();
  getStatistics3(current.value)
    .then((res) => {
      option.xAxis.data = res.x;
      option.series[0].data = res.y;
      myChart.setOption(option);
    })
    .finally(() => {
      myChart.hideLoading();
    });
}
//等比例缩放页面
const el = ref(null);
</script>
