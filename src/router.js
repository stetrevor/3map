import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";

Vue.use(Router);

const options = {
  routes: [
    {
      path: "/",
      name: "home",
      component: Home
    },
    {
      path: "*",
      redirect: "/"
    }
  ]
};

if (process.env.NODE_ENV === "development") {
  options.routes.push({
    path: "/playground",
    name: "playground",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "./views/Playground.vue"),
    children: [
      {
        path: "layout-algorithm",
        component: () => import("@/components/Playground/LayoutAlgorithm")
      }
    ]
  });
}

export default new Router(options);
