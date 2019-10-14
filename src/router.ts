import Vue from 'vue'
import Router from 'vue-router'
import Auction from './views/Auction.vue'
import FAQ from './views/FAQ.vue'

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'concept',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/Concept.vue')
    },
    {
      path: '/genesis-auction',
      name: 'genesis-auction',
      component: Auction
    },
    {
      path: '/faq',
      name: 'faq',
      component: FAQ
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
    },
    // {
    //   path: '/params',
    //   name: 'params',
    //   // route level code-splitting
    //   // this generates a separate chunk (about.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () => import(/* webpackChunkName: "about" */ './views/Parameters.vue')
    // }
  ]
});
