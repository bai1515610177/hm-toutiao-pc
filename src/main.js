import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App.vue'
import router from '@/router'
import axios from '@/api'
import Router from 'vue-router'
import MyBread from '@/components/my-bread'
import plugin from '@/components'
import '@/styles/index.less'
Vue.use(plugin)
const routerPush = Router.prototype.push
Router.prototype.push = function push (location) {
  return routerPush.call(this, location).catch(error => error)
}

Vue.prototype.$http = axios
Vue.use(ElementUI)
Vue.component('my-bread', MyBread)
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
