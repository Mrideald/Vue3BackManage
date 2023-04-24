import axios from '@/axios'

//登录接口
export function login(username,password){
   return axios.post('/admin/login',{username,password})
}

//获取管理员信息和权限
export function getInfo(){
   return axios.post('/admin/getinfo')
}

//退出登录
export function logOut(){
   return axios.post('/admin/logout')
}

//修改密码
export function updatePassword(data){
   return axios.post('/admin/updatepassword',data)
}

//获取管理员列表 传入参数是limit 和keyword 页面限制大小 和名称
export function getManagerList(page,query={}){
   let q=[]  //空数组接收处理后的key=value
   for(const key in query){
      if(query[key]){
         //将limit=对应的值推入到q里面 还有key
         q.push(`${key}=${encodeURIComponent(query[key])}`)//将数据推入q 并处理encode
      }
   }
   let r=q.join("&")  //将q里面的内容拼接成字符串 并且用&连接limit=10&keyword=ceshi
   r=r?("?"+r):""  //在字符串前面加个问号 params参数特性？a=*** 其实可以在下面地址直接写？
   return axios.get(`/admin/manager/${page}${r}`)
}

//更改管理员状态 status 0禁 1启
export function updataManagerStatus(id,status){
   axios.post(`/admin/manager/${id}/update_status`,{status})
}

//增加管理员 body参数 username password roleid status avatar
export function createManager(data){
   axios.post("/admin/manager",data)
}

//修改管理员 body参数 username password roleid status avatar
export function updataManager(id,data){
  axios.post(`/admin/manager/${id}`,data)
}

//删除管理员
export function deleteManager(id){
  axios.post(`/admin/manager/${id}/delete`)
}