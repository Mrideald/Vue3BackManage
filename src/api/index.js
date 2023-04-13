import axios from '@/axios'

//登录接口
export function getStatistics1(){
    return axios.get('/admin/statistics1')
 }

 //echarts表格
 //登录接口
export function getStatistics3(type){
    return axios.get('/admin/statistics3?type='+type)
 }