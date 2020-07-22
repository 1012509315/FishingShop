// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import './plugins/axios'
import App from './App'
import router from './router'
import store from './vuex/store'

import 'element-ui/lib/theme-chalk/index.css'

import './plugins/element.js'
//import VueSocketIO from "vue-socket.io"



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
// compiler
//vue有两种形式的代码 compiler（模板）模式和runtime模式（运行时），
//vue模块的package.json的main字段默认为runtime模式， 
//指向了"dist/vue.runtime.common.js"位置。这是vue升级到2.0之后就有的特点。
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})

//runtime

// new Vue({
//   router,
//   store,
//   render: h => h(App)
// }).$mount("#app")