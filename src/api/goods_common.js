import axios from "@/axios";
import { queryParams } from "@/composables/util.js";


//获取管理员列表 传入参数是limit 和keyword 页面限制大小 和名称
export function getGoodsCommonList(page, query = {}) {
  let r = queryParams(query);
  return axios.get(`/admin/goods_comment/${page}${r}`);
}



//修改管理员 body参数 username password roleid status avatar
export function updateGoodsCommonStatus(id, status) {
  axios.post(`/admin/user_level/${id}/update_status`, {status});
}
