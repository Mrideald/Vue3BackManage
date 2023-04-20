import axios from '@/axios'

//获取图片列表
export function getImageList(id,page=1){
  return axios.get(`/admin/image_class/${id}/image/${page}`)
}

//修改图片名称
export function updataImage(id,name){
  return axios.post(`/admin/image/${id}`,{name})
}
//删除图片
export function deleteImage(ids){
  return axios.post('/admin/image/delete_all',{ids})
}