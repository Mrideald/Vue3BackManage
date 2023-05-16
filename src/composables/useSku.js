import { ref } from "vue";
import { createGoodsSkusCard } from "@/api/goods.js";

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
// 添加规格选项完成 明天看21
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
