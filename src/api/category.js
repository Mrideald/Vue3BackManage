import axios from '@/axios.js'

export function getCategoryList(){
    return axios.get('/admin/category')
}