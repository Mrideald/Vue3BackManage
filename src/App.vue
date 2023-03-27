<script setup>
</script>

<template>
  <div>
<button class="btn">3123</button>
<el-button>hello</el-button>
<router-view></router-view>
  </div>
</template>

<style scoped>
.btn{
  @apply  bg-purple-500 px-2 py-3 text-indigo-600 rounded-full transition-all duration-500 hover:(bg-purple-900);
}
</style>
