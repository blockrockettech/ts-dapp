import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

Vue.config.productionTip = false;

// @ts-ignore
import drizzleVuePlugin from '@drizzle/vue-plugin';
import drizzleOptions from './drizzle-options';

Vue.use(drizzleVuePlugin, { store, drizzleOptions });

import PortalVue from 'portal-vue';

Vue.use(PortalVue);

import BootstrapVue from 'bootstrap-vue';
import { ToastPlugin } from 'bootstrap-vue';

Vue.use(BootstrapVue);
Vue.use(ToastPlugin);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
