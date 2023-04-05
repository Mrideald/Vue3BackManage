import { useCookies } from '@vueuse/integrations/useCookies'
//封装token 

const cookies=useCookies()
const TokenKey="TOKEN"
//设置token
export function setToken(token){
    cookies.set(TokenKey,token)
}
//获取token
export function getToken(){
    return cookies.get(TokenKey)
}
//清除token
export function removeToken(){
    cookies.remove(TokenKey)
}
