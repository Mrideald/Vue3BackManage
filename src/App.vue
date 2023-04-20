<script setup>
</script>

<template>
  <div>
<router-view></router-view>
  </div>
</template>
<!--
//图片渲染以及 修改删除完成 -->

<style>
body{
  @apply bg-gray-100;
}
::-webkit-scrollbar{
  width: 4px;
  height: 6px;
}
::-webkit-scrollbar-corner{
  display: block;
}
::-webkit-scrollbar-thumb{
  border-radius: 8px;
  background-color: rgba(0,0,0,0.2);
}
::-webkit-scrollbar-thumb,::-webkit-scrollbar-track{
  border-right-color: transparent;
  border-left-color: transparent;
}
</style>
