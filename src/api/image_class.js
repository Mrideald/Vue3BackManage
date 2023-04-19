import axios from '@/axios'

export function getImageClassList(page){
    return axios.get('/admin/image_class/'+page)
}
//添加图片分类
export function createImageClass(data){
    return axios.post('/admin/image_class',data)
}
//修改图片分类
export function updataImageClass(id,data){
    return axios.post('/admin/image_class/'+id,data)
}

//删除图片分类
export function deleteImageClass(id){
    return axios.post(`/admin/image_class/${id}/delete`)
}