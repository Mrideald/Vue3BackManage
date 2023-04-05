import { createStore } from 'vuex'
import {login,getInfo,logOut} from '@/api/manager'
import {setToken,removeToken} from '@/composables/auth.js'

// 创建一个新的 store 实例
const store = createStore({
  state () {
    return {
   //用户信息
   user:{}
    }
  },
  mutations: {
    //记录用户信息
    SET_USERINFO(state,user){
        state.user=user
    },
  },
  actions:{
    //登录
     login({commit},{username,password}){
        return new Promise((resolve,reject)=>{
          login(username,password).then(res=>{
             setToken(res.token)
             resolve(res)
          }).catch(err=>reject(err))
        })
     },
    //获取当前登录的用户信息
    getInfo({commit}){
      return new Promise((resolve,reject)=>{
        getInfo().then(res=>{
          commit("SET_USERINFO",res)
          resolve(res)
        }).catch(err=>reject(err))
      })
    },
    //退出登录
    logOut({commit}){
      return new Promise((resolve,reject)=>{
        logOut().then(res=>{
          //移除token
          removeToken()
          //删除用户信息
          commit("SET_USERINFO","")
          resolve(res)
        }).catch(err=>reject(err))
      })
    }
  }
})
export default store