<template>
  <div>
    <!-- tofix保留几位 -->
    {{ d.num.toFixed(0) }}
  </div>
</template>

<script setup>
import { reactive, watch } from "vue";
import gsap from 'gsap'
// 接收传来的值
const props=defineProps({
    value:{
        type:Number,
        default:0
    }
})
const d = reactive({ num: 0 });

function AnimateToValue(){
    //第一个参数是指的哪个数字,第二个参数是滚动几秒 和滚动到哪个数字
    gsap.to(d,{
        duration:0.5,
        num:props.value
    })
}
AnimateToValue()
//监听数据改变
watch(()=>props.value,()=>{
    AnimateToValue()
})
</script>
