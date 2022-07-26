// router/index.ts 文件

import {
  createRouter,
  createWebHashHistory,
  RouterOptions,
  Router,
  RouteRecordRaw,
} from "vue-router";

import ProblemOne from '../views/ProblemOne.vue';
//由于router的API默认使用了类型进行初始化，内部包含类型定义，所以本文内部代码中的所有数据类型是可以省略的
//RouterRecordRaw是路由组件对象
const routes: RouteRecordRaw[] = [
  { path: "/", name: "Home", component: () => import("../views/HomePage.vue") },
  { path: "/problem1", name: "ProblemOne", component: ProblemOne },
  // TODO: Page 404
];

// RouterOptions是路由选项类型
const options: RouterOptions = {
  history: createWebHashHistory(),
  routes,
};

// Router是路由对象类型
const router: Router = createRouter(options);

export default router;
