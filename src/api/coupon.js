import axios from '@/axios'

//获取公告列表
export function getCouponList(page){
  return axios.get(`/admin/coupon/${page}`)
}
//新增公告
export function createCoupon(data){
    return axios.post("/admin/coupon",data)
}

//修改公告 /admin/notice/:id  body部分是title和content
export function changeCoupon(id,data){
    return axios.post(`/admin/coupon/${id}`,data)
}

//删除公告 /admin/notice/:id/delete
export function deleteCoupon(id){
     return axios.post(`/admin/coupon/${id}/delete`)
}

//更新状态
export function updateCouponStatus(id){
    return axios.post(`/admin/coupon/${id}/update_status`,{
        status:0
    })
}