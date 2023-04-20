//封装element方法
import { ElNotification,ElMessageBox} from "element-plus";
//引入进度条
import nprogress from "nprogress";

//消息提示  第三个参数是渲染html提示 如果提示内容为html代码 则自动渲染
export function toast(message,type="success",dangerouslyUseHTMLString=true){
    //默认成功
    ElNotification({
        type,
        duration: 3000,
        message,
        dangerouslyUseHTMLString
      });
}
//确认消息弹出框
export function showModal(content="提示内容",type="warning",title=""){
  return ElMessageBox.confirm(
    content,
    title,
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type
    }
  )
}

//弹出出入框  参数为弹出框名字 和默认数据
export function showPrompt(tip,value=""){
 return ElMessageBox.prompt(tip, {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    inputValue:value,
  })
}

//进度条封装 全屏loading

export function showFullLoading(){
 nprogress.start();
}

export function hideFullLoading(){
  nprogress.done();
 }


