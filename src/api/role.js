import axios from '@/axios'
//获取数据
export function getRoleList(page){
    return axios.get(`/admin/role/${page}`)
}

//新增分类
export function createRole(data){
    return axios.post("/admin/role",data)
}

//修改菜单规则
export function changeRole(id,data){
    return axios.post(`/admin/role/${id}`,data)
}

//更改状态 status 0禁 1启
export function updataRoleStatus(id,status){
    axios.post(`/admin/Role/${id}/update_status`,{status})
 }

 //删除
export function deleteRole(id){
    axios.post(`/admin/role/${id}/delete`)
  }

//配置权限
export function setRoleRules(id,rule_ids){
    axios.post('/admin/role/set_rules',{id,rule_ids})
}