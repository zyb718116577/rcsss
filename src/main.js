import Vue from 'vue'
import App from './App'
import {router} from './router'

import iView from 'iview';
import 'iview/dist/styles/iview.css';
Vue.use(iView);

import axios from 'axios';
Vue.prototype.$axios = axios;

import store from './store';

Vue.config.productionTip = false


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
