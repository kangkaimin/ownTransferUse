import Vue from 'vue'
import Router from 'vue-router'
import Ad from '@/components/Ad'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Ad',
      component: Ad
    }
  ]
})
