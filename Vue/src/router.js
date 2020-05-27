import Vue from 'vue'
import Router from 'vue-router'
import main from '@/components/main'
import login from '@/components/login'
import shopDetail from '@/components/shopDetail'
import userDetail from './components/userDetail.vue'
import comment from './components/comment.vue'
import buy from './components/buy.vue'
import shopList from './components/shopList.vue'
import socket from './components/socket.vue'
import cheshi from './components/cheshi.vue'
Vue.use(Router)

var router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'main',
      component: main
    },
    {
      path: '/login',
      name: 'login',
      component: login
    },
    {
      path: '/shopDetail/:id',
      name: 'shopDetail',
      component: shopDetail
    },
    {
      path: '/userDetail',
      name: 'userDetail',
      component: userDetail,
      // meta: {
      //   login: true
      // }
    },
    {
      path: '/comment/:id',
      name: 'comment',
      component: comment,
      props: true
    },
    {
      path: '/buy/:shop',
      name: 'buy',
      component: buy,
      props: true,
      meta: {
        login: true
      }
    },
    {
      path: '/shopList',
      name: 'shopList',
      component: shopList,
      meta: {
        login: true
      }
    },
    {
      path: '/socket',
      name: 'socket',
      component: socket
    }, 
    {
      path: '/ceshi',
      component: cheshi
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})

router.beforeEach((to, from, next)=>{
  console.log('进入beforeEach')
  if (to.matched.some((ele) => ele.meta.login)){
    if (sessionStorage.getItem('userName')){
      return next()
    }
    next({ name: 'login' })
  }else{
    next()
  }
})

export default router;
