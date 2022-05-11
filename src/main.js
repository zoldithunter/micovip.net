import Vue from 'vue'
import App from './App.vue'

import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.use(BootstrapVue)
Vue.use(IconsPlugin)

Vue.config.productionTip = false

Vue.filter('toCurrency', function (value) {
  if (typeof value !== "number") {
    return value;
  }
  const formatter = new Intl.NumberFormat('de-DE', {
    minimumFractionDigits: 0
  });
  return formatter.format(value);
});

new Vue({
  render: h => h(App),
}).$mount('#app')
