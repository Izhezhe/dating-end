import Layout from '@/views/layout/layout'

// const frameIn = [
//   {
//     path: '/',
//     redirect: {
//       name: 'login'
//     },
//     meta: {
//       title: '登录'
//     },
//     component: Layout,
//     children: [
//       {
//         path: '/index',
//         name: 'index',
//         component: () => import('@/views/index'),
//         meta: {title: '首页', notCache: true},
//       },
//       // {
//       //   path: 'index2',
//       //   name: 'index2',
//       //   component: () => import('@/views/index'),
//       //   meta: {meta, title: '首页', notCache: true},
//       // },
//       // {
//       //   path: 'index3',
//       //   name: 'index3',
//       //   component: () => import('@/views/index'),
//       //   meta: {meta, title: '首页', notCache: true},
//       // },
//     ]
//   },
//   // 登陆
// 	{
// 		path: '/login',
// 		name: 'login',
// 		component: () => import('@/views/account/login'),
// 		meta: '登陆'
// 	},
// 	{
// 		path: '/reset',
// 		name: 'reset',
// 		component: () => import('@/views/account/reset'),
// 		meta: '修改密码'
//   },
//   {
//     path: '*',
//     redirect: '/404',
//     component: () => import('@/views/errorPage/404'),
//   }
// ]

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
          path: '/account',
          name: 'account',
          component: () => import('@/views/account'),
          meta: {title: '账号管理', notCache: true},
        },
        {
          path: '/user',
          name: 'user',
          component: () => import('@/views/user'),
          meta: {title: '账号管理', notCache: true},
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
