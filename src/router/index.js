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
  //   path: '/register',
  //   name: '注册',
  //   component: () => import('@/views/account/register'),
  //   hidden: true
  // },
  {
    path: '/reset',
    component: Layout,
    redirect: '/reset',
    hidden: true,
    children: [
      {
        path: '/reset',
        name: '修改密码',
        component: () => import('@/views/account/reset'),
        meta: { title: '修改密码'}
      }
    ]
  },
  {
    path: '/',
    component: Layout,
    redirect: '/index'
  },
  // pages
  {
    path: '/index',
    component: Layout,
    redirect: '/index/index',
    children: [
      {
        path: 'index',
        name: '首页',
        component: () => import('@/views/index/index'),
        meta: { title: '首页', icon: 'home' }
      },
    ]
  },
  {
    path: '/agent',
    component: Layout,
    redirect: '/agent/list',
    meta: { title: '代理人', icon: 'agent' },
    select: true,
    children: [
      {
        path: 'list',
        name: '代理人',
        component: () => import('@/views/agent/list'),
        meta: { title: '代理人' }
      },
      {
        path: 'detail',
        name: '代理人详情',
        component: () => import('@/views/agent/detail'),
        meta: { title: '代理人详情' }
      }
    ]
  },
  {
    path: '/product',
    component: Layout,
    redirect: '/product/list',
    meta: { title: '产品管理', icon: 'product' },
    select: true,
    children: [
      {
        path: 'list',
        name: '产品管理',
        component: () => import('@/views/product/list'),
        meta: { title: '产品管理' }
      },
      {
        path: 'liston',
        name: '产品同步',
        component: () => import('@/views/product/liston'),
        meta: { title: '产品同步' }
      },
      {
        path: 'detail',
        name: '产品详情',
        component: () => import('@/views/product/detail'),
        meta: { title: '产品详情' }
      }
    ]
  },
  {
    path: '/customer',
    component: Layout,
    redirect: '/customer/list',
    meta: { title: '客户管理', icon: 'customer' },
    select: true,
    children: [
      {
        path: 'list',
        name: '客户管理',
        component: () => import('@/views/customer/list'),
        meta: { title: '客户管理' }
      },
      {
        path: 'detail',
        name: '客户详情',
        component: () => import('@/views/customer/detail'),
        meta: { title: '客户详情' }
      }
    ]
  },
  {
    path: '/warranty',
    component: Layout,
    redirect: '/warranty/list',
    meta: { title: '线上保单', icon: 'warranty' },
    select: true,
    children: [
      {
        path: 'list',
        name: '线上保单',
        component: () => import('@/views/warranty/list'),
        meta: { title: '线上保单' }
      },
      {
        path: 'detail',
        name: '线上保单详情',
        component: () => import('@/views/warranty/detail'),
        meta: { title: '线上保单详情' }
      }
    ]
  },
  {
    path: '/offline',
    component: Layout,
    redirect: '/offline/list',
    meta: { title: '线下保单', icon: 'under' },
    select: true,
    children: [
      {
        path: 'list',
        name: '线下保单',
        component: () => import('@/views/offline/list'),
        meta: { title: '线下保单' }
      },
      {
        path: 'detail',
        name: '线下保单详情',
        component: () => import('@/views/offline/detail'),
        meta: { title: '线下保单详情' }
      }
    ]
  },
  {
    path: '/finance',
    component: Layout,
    redirect: '/finance/list',
    meta: { title: '财务中心', icon: 'finance' },
    select: true,
    children: [
      {
        path: 'list',
        name: '财务中心',
        component: () => import('@/views/finance/list'),
        meta: { title: '财务中心' }
      }
    ]
  },
  {
    path: '/statistics',
    component: Layout,
    redirect: '/statistics/list',
    meta: { title: '统计导出', icon: 'statistics' },
    select: true,
    children: [
      {
        path: 'list',
        name: '统计导出',
        component: () => import('@/views/statistics/list'),
        meta: { title: '统计导出' }
      }
    ]
  },
  { path: '/401', component: () => import('@/views/errorPage/401'), hidden: true },
  { path: '/404', component: () => import('@/views/errorPage/404'), hidden: true },
  { path: '*', redirect: '/' },
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

