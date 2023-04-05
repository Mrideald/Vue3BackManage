//封装element方法
import { ElNotification,ElMessageBox} from "element-plus";
//引入进度条
import nprogress from "nprogress";

//消息提示
export function toast(message,type="success",dangerouslyUseHTMLString=false){
    //默认成功
    ElNotification({
        type,
        duration: 3000,
        message,
        dangerouslyUseHTMLString
      });
}

//消息弹出框
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

//进度条封装 全屏loading

export function showFullLoading(){
 nprogress.start();
}

export function hideFullLoading(){
  nprogress.done();
 }


