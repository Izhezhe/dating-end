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
          name: '首页',
          component: () => import('@/views/index'),
          meta: {title: '首页', notCache: true},
        },
        {
          path: '/user',
          name: '用户管理',
          component: () => import('@/views/user'),
          meta: {title: '用户管理', notCache: true},
        },
        {
          path: '/config',
          name: '网站关于',
          component: () => import('@/views/config'),
          meta: {title: '网站关于', notCache: true},
        },
        {
          path: '/reset',
          name: '修改密码',
          component: () => import('@/views/login/reset'),
          meta: '修改密码'
        },
      ]
    },
    {
      path: '/system',
      component: Layout,
      children: [
        {
          path: 'account',
          name: '账号管理',
          component: () => import('@/views/system/account'),
          meta: {title: '账号管理', notCache: true},
        },
        {
          path: 'menu',
          name: '菜单管理',
          component: () => import('@/views/system/menu'),
          meta: {title: '菜单管理', notCache: true},
        },
        {
          path: 'config',
          name: '系统配置',
          component: () => import('@/views/system/config'),
          meta: {title: '系统配置', notCache: true},
        },
      ]
    },
    // 登陆
    {
      path: '/login',
      name: '登陆',
      component: () => import('@/views/login/login'),
      meta: '登陆'
    },
    {
      path: '*',
      redirect: '/404',
      component: () => import('@/views/errorPage/404'),
    }
  ]
})
