import axios from '@/axios'

//获取公告列表
export function getNoticeList(page){
  return axios.get(`/admin/notice/${page}`)
}
//新增公告
export function createNotice(data){
    return axios.post("/admin/notice",data)
}

//修改公告 /admin/notice/:id  body部分是title和content
export function changeNotice(id,data){
    return axios.post(`/admin/notice/${id}`,data)
}

//删除公告 /admin/notice/:id/delete
export function deleteNotice(id){
     return axios.post(`/admin/notice/${id}/delete`)
}