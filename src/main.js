import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import "amfe-flexible/index.js"
import Vant from 'vant'
import 'vant/lib/index.css'

Vue.use(Vant)
Vue.config.productionTip = false
axios.defaults.withCredentials = true//运行http请求携带cooke
axios.defaults.crossDomain = true;
//允许跨域访问cookie
axios.defaults.baseURL = 'http://192.168.14.33:3000'
Vue.prototype.$http = axios
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI)
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
