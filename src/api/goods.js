import axios from "@/axios";
import {queryParams} from '@/composables/util.js'

//获取商品列表 /admin/goods/:page?tab=all&title=关键词&category_id=2&limit=10  //问号后面全是query值
export function getGoodsList(page, query = {}) {
  let r=queryParams(query) //使用封装方法
  return axios.get(`/admin/goods/${page}${r}`);
}

//批量上架和下架 body参数 status  ids
export function updataGoodsStatus(ids, status) {
  return axios.post("/admin/goods/changestatus", { ids, status });
}

//创建商品
export function createGoods(data) {
  return axios.post("/admin/goods", data);
}

//修改商品
export function updataGoods(id, data) {
  return axios.post(`/admin/goods/${id}`, data);
}

//删除商品 批量
export function deleteGoods(ids) {
  return axios.post("/admin/goods/delete_all", { ids });
}

//查看商品资料
export function readGoods(id){
 return axios.get(`/admin/goods/read/${id}`)
}

//设置商品轮播图
export function setGoodsBanner(id,data){
  return axios.post(`/admin/goods/banners/${id}`,data)
}

//设置商品规格
export function updateGoodsSkus(id,data){
  return axios.post(`/admin/goods/updateskus/${id}`,data)
}

//新增规格方法 新增一个card
export function createGoodsSkusCard(data){
  return axios.post("/admin/goods_skus_card",data)
}


//修改商品规格选项（标题）
export function updateGoodsSkusCard(id,data){
  return axios.post(`/admin/goods_skus_card/${id}`,data)
}

//删除规格选项
export function deleteGoodsSkusCard(id){
  return axios.post(`/admin/goods_skus_card/${id}/delete`)
}

//排序规格选项
export function sortGoodsSkusCard(data){
  return axios.post(`/admin/goods_skus_card/sort`,data)
}

//添加商品规格选项的值
export function createGoodsSkusCardValue(data){
  return axios.post("/admin/goods_skus_card_value",data)
}

//修改商品规格选项的值
export function updateGoodsSkusCardValue(id,data){
  return axios.post(`/admin/goods_skus_card_value/${id}`,data)
}

//删除规格选项的值
export function deleteGoodsSkusCardValue(id){
  return axios.post(`/admin/goods_skus_card_value/${id}/delete`)
}