// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './vuex/store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios'
//import VueSocketIO from "vue-socket.io"

Vue.use(ElementUI);
axios.defaults.baseURL ='/api'
Vue.prototype.axios = axios            //修改vue原型对象的访问
// Vue.use(
//   new VueSocketIO({
//     debug: false,
//     connection: "http://localhost:8080/api/socket.io" 
//   })
// );

Vue.config.productionTip = false

Vue.filter('shopName',function(value){
  if(value.length>40){
    return value.slice(0,40)+"..."
  }
  return value;
})
Vue.filter('shopPrice', function (value) {
  return new Number(value).toFixed(2)
  
})
Vue.filter('skuName', function (value) {

  return value.replace(/(null)*$/g,"")
  
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
