import axios from "@/axios";
//获取数据
export function getSkusList(page) {
  return axios.get(`/admin/skus/${page}`);
}

//新增
export function createSkus(data) {
  return axios.post("/admin/skus", data);
}

//修改
export function changeSkus(id, data) {
  return axios.post(`/admin/skus/${id}`, data);
}

//更改状态 status 0禁 1启
export function updataSkusStatus(id, status) {
  return axios.post(`/admin/skus/${id}/update_status`, { status });
}

//删除
export function deleteSkus(ids) {
  ids = !Array.isArray(ids) ? [ids] : ids;
  return axios.post(`/admin/skus/delete_all`, { ids });
}
