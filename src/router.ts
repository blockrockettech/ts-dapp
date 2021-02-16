import Vue from 'vue'
import Router from 'vue-router'
import Auction from './views/Auction.vue'
import Countdown from './views/Countdown.vue'
import FAQ from './views/FAQ.vue'
import Disclaimer from './views/Disclaimer.vue'
import Marketplace from './views/Marketplace.vue'
import Download from './views/Download.vue'

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
      path: '/documentation',
      name: 'documentation',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/Documentation.vue')
    },
    {
      path: '/genesis-auction',
      name: 'genesis-auction',
      component: Countdown
    },
    {
      path: '/faq',
      name: 'faq',
      component: FAQ
    },
    {
      path: '/disclaimer',
      name: 'disclaimer',
      component: Disclaimer
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
    },
    {
      path: '/marketplace',
      name: 'marketplace',
      component: Marketplace
    },
    {
      path: '/download',
      name: 'download',
      component: Download
    },
    {
      path: '/twisted-admin',
      name: 'twisted-admin',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/Admin.vue')
    }
  ]
});
