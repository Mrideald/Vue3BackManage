import axios from "@/axios";
import { queryParams } from "@/composables/util.js";

//登录接口
export function login(username, password) {
  return axios.post("/admin/login", { username, password });
}

//获取管理员信息和权限
export function getInfo() {
  return axios.post("/admin/getinfo");
}

//退出登录
export function logOut() {
  return axios.post("/admin/logout");
}

//修改密码
export function updatePassword(data) {
  return axios.post("/admin/updatepassword", data);
}

//获取管理员列表 传入参数是limit 和keyword 页面限制大小 和名称
export function getManagerList(page, query = {}) {
  let r = queryParams(query);
  return axios.get(`/admin/manager/${page}${r}`);
}

//更改管理员状态 status 0禁 1启
export function updataManagerStatus(id, status) {
  axios.post(`/admin/manager/${id}/update_status`, { status });
}

//增加管理员 body参数 username password roleid status avatar
export function createManager(data) {
  axios.post("/admin/manager", data);
}

//修改管理员 body参数 username password roleid status avatar
export function updataManager(id, data) {
  axios.post(`/admin/manager/${id}`, data);
}

//删除管理员
export function deleteManager(id) {
  axios.post(`/admin/manager/${id}/delete`);
}
