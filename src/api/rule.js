import axios from '@/axios'
//获取数据
export function getRuleList(page){
    return axios.get(`/admin/rule/${page}`)
}

//新增分类
export function createRule(data){
    return axios.post("/admin/rule",data)
}

//修改菜单规则
export function changeRule(id,data){
    return axios.post(`/admin/rule/${id}`,data)
}

//更改状态 status 0禁 1启
export function updataRuleStatus(id,status){
    axios.post(`/admin/rule/${id}/update_status`,{status})
 }

 //删除
export function deleteRule(id){
    axios.post(`/admin/rule/${id}/delete`)
  }