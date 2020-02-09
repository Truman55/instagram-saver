// Webpack CSS import
import 'onsenui/css/onsenui.css';
import 'onsenui/css/onsen-css-components.css';

import Vue from 'vue';
import VueOnsen from 'vue-onsenui';
import App from './App.vue';
import Icon from '@/components/Icon.vue';
import store from './store'

Vue.config.productionTip = false;

Vue.use(VueOnsen);
Vue.component('Icon', Icon);

new Vue({
  store,
  render: h => h(App)
}).$mount('#app')
