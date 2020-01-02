import Layout from '@/views/layout/layout'

export default new VueRouter({
  mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: [
    {
      path: '/',
      redirect: {
        path: '/user'
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
          path: '/docu',
          name: '文档管理',
          component: () => import('@/views/docu'),
          meta: {title: '文档管理', notCache: true},
        },
        {
          path: '/income',
          name: '收入管理',
          component: () => import('@/views/income'),
          meta: {title: '收入管理', notCache: true},
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
      path: '/audit',
      component: Layout,
      children: [
        {
          path: 'service',
          name: '客服审核',
          component: () => import('@/views/audit/service'),
          meta: {title: '客服审核', notCache: true},
        },
        {
          path: 'receive',
          name: '收货审核',
          component: () => import('@/views/audit/receive'),
          meta: {title: '收货审核', notCache: true},
        },
      ]
    },
    {
      path: '/gift',
      component: Layout,
      children: [
        {
          path: 'chat',
          name: '聊天礼物',
          component: () => import('@/views/gift/chat'),
          meta: {title: '聊天礼物', notCache: true},
        },
        {
          path: 'mall',
          name: '商城礼物',
          component: () => import('@/views/gift/mall'),
          meta: {title: '商城礼物', notCache: true},
        },
      ]
    },
    {
      path: '/config',
      component: Layout,
      children: [
        {
          path: 'value',
          name: '默认值配置',
          component: () => import('@/views/config/value'),
          meta: {title: '默认值配置', notCache: true},
        },
        {
          path: 'img',
          name: '默认图片配置',
          component: () => import('@/views/config/img'),
          meta: {title: '默认图片配置', notCache: true},
        },
        {
          path: 'banner',
          name: '多背景图片配置',
          component: () => import('@/views/config/banner'),
          meta: {title: '多背景图片配置', notCache: true},
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
      ]
    },
    // 登陆
    {
      path: '/login',
      name: '登陆',
      component: () => import('@/views/login/login'),
      meta: '登陆'
    },
    { path: '/404', component: () => import('@/views/errorPage/404') },
    { path: '*', redirect: '/404'},
  ]
})
