import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import cesium from './plugins/cesium'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify,
  cesium,
  render: h => h(App)
}).$mount('#app')
