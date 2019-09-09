import Layout from '@/views/layout/layout'
import parentView from '@/components/parent-view'

export const constantRouterMap = [
  {
    path: '/login',
    name: '登录',
    component: () => import('@/views/account/login'),
    hidden: true
  },
  // {
  //   path: '/',
  //   component: Layout,
  //   hidden: true,
  //   children: [
  //     {
  //       path: '/reset',
  //       name: '修改密码',
  //       component: () => import('@/views/account/reset'),
  //       meta: { title: '修改密码'}
  //     }
  //   ]
  // },
  {
    path: '/',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'index',
        component: () => import('@/views/index'),
        meta: { title: '首页', icon: 'home' }
      },
      {
        path: 'index2',
        name: 'index2',
        component: () => import('@/views/index'),
        meta: { title: '首页', icon: 'home' }
      },
      {
        path: 'index3',
        name: 'index3',
        component: () => import('@/views/index'),
        meta: { title: '首页', icon: 'home' }
      },
    ]
  },
  // { path: '/401', component: () => import('@/views/errorPage/401'), hidden: true },
  // { path: '/404', component: () => import('@/views/errorPage/404'), hidden: true },
  // { path: '*', redirect: '/' },
]

export default new VueRouter({
  mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

export const asyncRouterMap = [
  {
    path: '*',
    redirect: '/404',
    hidden: true
  }
]

