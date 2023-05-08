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
