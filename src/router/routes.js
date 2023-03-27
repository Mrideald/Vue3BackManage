import home from "@/pages/index.vue";
import NotFound from "@/pages/404.vue";

export default [
  {
    path: "/",
    component: home,
  },
  { path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: NotFound
  },
];
