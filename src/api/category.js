import axios from '@/axios.js'

export function getCategoryList(){
    return axios.get('/admin/category')
}

//新增分类
export function createCategory(data){
    return axios.post("/admin/rule",data)
}

//修改
export function updateCategory(id,data){
    return axios.post(`/admin/rule/${id}`,data)
}

//更改状态 status 0禁 1启
export function updateCategoryStatus(id,status){
    axios.post(`/admin/rule/${id}/update_status`,{status})
 }

 //删除
export function deleteCategory(id){
    axios.post(`/admin/rule/${id}/delete`)
  }