import Layout from '@/views/layout/layout'

export default new VueRouter({
  mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: [
    {
      path: '/',
      redirect: {
        path: '/index'
      },
      component: Layout,
      children: [
        {
          path: '/index',
          name: 'index',
          component: () => import('@/views/index'),
          meta: {title: '首页', notCache: true},
        },
        {
          path: '/user',
          name: 'user',
          component: () => import('@/views/user'),
          meta: {title: '用户管理', notCache: true},
        },
        // 配置管理
        {
          path: '/config',
          name: 'config',
          component: () => import('@/views/config'),
          meta: {title: '配置管理', notCache: true},
        }
      ]
    },
    {
      path: '/system',
      component: Layout,
      children: [
        {
          path: 'account',
          name: 'account',
          component: () => import('@/views/system/account'),
          meta: {title: '账号管理', notCache: true},
        },
        {
          path: 'menu',
          name: 'menu',
          component: () => import('@/views/system/menu'),
          meta: {title: '菜单管理', notCache: true},
        },
      ]
    },
    // 登陆
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/login/login'),
      meta: '登陆'
    },
    {
      path: '/reset',
      name: 'reset',
      component: () => import('@/views/login/reset'),
      meta: '修改密码'
    },
    {
      path: '*',
      redirect: '/404',
      component: () => import('@/views/errorPage/404'),
    }
  ]
})
