import axios from "@/axios.js";

import { queryParams } from "@/composables/util";

export function getOrderList(page, query = {}) {
  let r = queryParams(query);
  return axios.get(`/admin/order/${page}${r}`);
}

export function deleteOrder(ids) {
  return axios.post("/admin/order/delete_all", { ids });
}
