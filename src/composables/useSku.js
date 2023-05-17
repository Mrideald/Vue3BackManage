import { ref } from "vue";
import {
  createGoodsSkusCard,
  updateGoodsSkusCard,
  deleteGoodsSkusCard,
  sortGoodsSkusCard,
} from "@/api/goods.js";
import { useArrayMoveUp, useArrayMoveDown } from "@/composables/util.js";
//在规格组件中 获取到商品的信息传给当前文件的函数

//当前商品ID
export const goodsId = ref(0);

//规格选项列表 打开弹框之后就把数据存在这里
export const sku_card_list = ref([]);

//初始化规格选项列表
export function initSkuCardList(d) {
  sku_card_list.value = d.goodsSkusCard.map((item) => {
    item.text = item.name; //给列表添加一个中间值 如果修改成功那就是这个 不成功就是原来的name 防止修改了不知道原来是什么值
    item.loading = false;
    item.goodsSkusCardValue.map((v) => {
      v.text = v.value || "属性值";
      return v;
    });
    return item;
  });
}

//初始化规格值   找到列表里面和传入的id一致的item
export function initSkusCardItem(id) {
  const item = sku_card_list.value.find((o) => o.id == id);
  return {
    item,
  };
}

//修改商品规格选项
export function handleUpdate(item) {
  item.loading = true;
  updateGoodsSkusCard(item.id, {
    goods_id: item.goods_id,
    name: item.text,
    order: item.order,
    type: 0,
  })
    .then((res) => {
      item.name = item.text;
    })
    .catch(() => {
      item.text = item.name;
    })
    .finally(() => {
      item.loading = false;
    });
}

//删除规格选项
export function handleDelete(item) {
  item.loading = true;
  deleteGoodsSkusCard(item.id).then((res) => {
    //在列表里面找到当前要删除对象的索引
    const i = sku_card_list.value.findIndex((o) => (o.id = item.id));
    if (i != -1) {
      sku_card_list.value.splice(i, 1);
    }
  });
}

//添加规格选项
export const btnLoading = ref(false);
export function addSkuCardEvent() {
  btnLoading.value = true;
  createGoodsSkusCard({
    goods_id: goodsId.value, //商品ID
    name: "规格选项", //规格名称
    order: 50, //排序
    type: 0, //规格类型 0文字})
  })
    .then((res) => {
      sku_card_list.value.push({
        ...res,
        text: res.name,
        loading: false,
        goodsSkusCardValue: [],
      });
    })
    .finally(() => {
      btnLoading.value = false;
    });
}
//修改和排序完成 下节课看25
//排序规格选项
export const bodyLoading=ref(false)
export function sortCard(action, index) {
  //复制一遍原数组
  let oList = JSON.parse(JSON.stringify(sku_card_list.value));
  //简化执行代码
  let func=action=="up"?useArrayMoveUp:useArrayMoveDown
  //先给复制的排序 处理之后传给服务器 后面再给原来的skulist排序
  func(oList,index)
  //处理排序之后传给服务器的参数
  let sortData=oList.map((o,i)=>{
    return {
      id:o.id,
      order:i+1
    }
  })
  //传给服务器处理好的参数 然后完成之后修改排序
  bodyLoading.value=true
  sortGoodsSkusCard({sortdata:sortData}).then(res=>{
     func(sku_card_list.value,index)
  }).finally(()=>{
    bodyLoading.value=false
  })
}
