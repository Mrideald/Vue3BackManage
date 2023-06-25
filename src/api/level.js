import axios from '@/axios'
//获取数据
export function getLevelList(page){
    return axios.get(`/admin/user_level/${page}`)
}

//新增分类
export function createLevel(data){
    return axios.post("/admin/user_level",data)
}

//修改菜单规则
export function changeLevel(id,data){
    return axios.post(`/admin/user_level/${id}`,data)
}

//更改状态 status 0禁 1启
export function updateLevelStatus(id,status){
   return axios.post(`/admin/user_level/${id}/update_status`,{status})
 }

//删除
export function deleteLevel(id){
   return axios.post(`/admin/user_level/${id}/delete`)
  }
