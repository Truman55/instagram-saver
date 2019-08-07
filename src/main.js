import Vue from 'vue'
import App from './App.vue'
import Icon from '@/components/Icon.vue'

Vue.config.productionTip = false

Vue.component('Icon', Icon)

new Vue({
  render: h => h(App),
}).$mount('#app')
