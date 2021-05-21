import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store';

import routes from "./routes"
Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  routes
})

router.beforeEach((to, from, next) => {
  if (to.name !== 'Login' && !store.state.apiKey) {
    next({
      name: 'Login'
    })
  }
  else {
    next()
  }
});
export default router
