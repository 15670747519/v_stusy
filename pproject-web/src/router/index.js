import Vue from 'vue'
import Router from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welecom from '../components/Welecom.vue'
import User from '../components/user/User.vue'
import Rights from '../components/rights/Rights'
import Role from '../components/rights/Role'
import Cate from '../components/goods/Cate'

Vue.use(Router)



const router =  new Router({
  routes: [
    {
      path: '/',
      redirect: '/login',
      component: Login
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/home',
      name: 'Home',
      component: Home,
      redirect:'/welecom',
      children: [{
        path: '/welecom',
        name: 'Welecom',
        component: Welecom
      },{
        path: '/users',
        name: 'User',
        component: User
        },
        {
          path: '/rights',
          component: Rights
        },
        {
          path: '/roles',
          component: Role
        },
        {
          path: '/goods',
          component: Cate
        }
      ]
    },
    

  ]
})

router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next();
  const token = window.sessionStorage.getItem('session_token');
  if (!token) return next({ name: 'Login' });
  next();

})

export default router;