//封装element方法
import { ElNotification, ElMessageBox } from "element-plus";
//引入进度条
import nprogress from "nprogress";

//消息提示  第三个参数是渲染html提示 如果提示内容为html代码 则自动渲染
export function toast(
  message,
  type = "success",
  dangerouslyUseHTMLString = true
) {
  //默认成功
  ElNotification({
    type,
    duration: 3000,
    message,
    dangerouslyUseHTMLString,
  });
}
//确认消息弹出框
export function showModal(content = "提示内容", type = "warning", title = "") {
  return ElMessageBox.confirm(content, title, {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type,
  });
}

//弹出出入框  参数为弹出框名字 和默认数据
export function showPrompt(tip, value = "") {
  return ElMessageBox.prompt(tip, {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    inputValue: value,
  });
}

//进度条封装 全屏loading

export function showFullLoading() {
  nprogress.start();
}

export function hideFullLoading() {
  nprogress.done();
}

//将query对象转成url参数
export function queryParams(query) {
  let q = []; //空数组接收处理后的key=value
  for (const key in query) {
    if (query[key]) {
      //将limit=对应的值推入到q里面 还有key
      q.push(`${key}=${encodeURIComponent(query[key])}`); //将数据推入q 并处理encode
    }
  }
  let r = q.join("&"); //将q里面的内容拼接成字符串 并且用&连接limit=10&keyword=ceshi
  r = r ? "?" + r : ""; //在字符串前面加个问号 params参数特性？a=*** 其实可以在下面地址直接写？
  return r;
}

//上移
export function useArrayMoveUp(arr,index) {
  swapArray(arr,index,index-1)
}

//下移
export function useArrayMoveDown(arr,index) {
  swapArray(arr,index,index+1)
}

//调换位置  [1,2,3,4]   [2,2,3,4] [2,1,3,4]
function swapArray(arr, index1, index2) {
  //删除index2索引代表的值 替换成arr[index1]
  arr[index1] = arr.splice(index2, 1, arr[index1])[0];
  return arr;
}
