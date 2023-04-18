//用来判断不同用户的不同权限展示 比如我没有访问图表的权限 我就不能展示图表 配置配置相应的v-permission才能展示相应的东西 否则将节点移除

import store from "@/store";
//判断别名
function hasPermission(value, el = false) {
  if (!Array.isArray(value)) {
    throw new Error("需要配置权限,例如v-permission='['getStatistic3,GET']'");
  }
//表示有这个别名  value.findIndex找到value里面的某一项 用它和总权限做比较 如果包含则不会等于负一
  const hasAuth =
    value.findIndex((v) => store.state.ruleNames.includes(v)) != -1;
  if (el && !hasAuth) {
    //el有父节点 然后移除这个节点
    el.parentNode &&el.parentNode.removeChild(el)
  }
  return hasAuth
}

export default {
  install(app) {
    app.directive("permission", {
      //第一个是当前节点 第二个是一些属性
      mounted(el, binding) {
        //判断别名
        hasPermission(binding.value, el);
      },
    });
  },
};
