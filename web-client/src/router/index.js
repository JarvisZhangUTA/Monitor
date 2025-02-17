import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if false, the item will hidden in breadcrumb(default is true)
  }
**/
export const constantRouterMap = [
  {
    path: '/signin',
    name: 'Signin',
    component: () => import('@/views/auth/signin'),
    hidden: true
  },
  {
    path: '/signup',
    name: 'Signup',
    component: () => import('@/views/auth/signup'),
    hidden: true
  },

  {
    path: '/404',
    name: '404',
    component: () => import('@/views/error/404'),
    hidden: true
  },
  {
    path: '/401',
    name: '401',
    component: () => import('@/views/error/401'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    name: 'Dashboard',
    hidden: true,
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index')
    }]
  },

  {
    path: '/monitor',
    component: Layout,
    redirect: '/monitor/list',
    name: 'Monitors',
    meta: { title: 'Monitor', icon: 'cpu' },
    children: [
      {
        path: 'list',
        name: 'MonitorList',
        component: () => import('@/views/monitor/list'),
        meta: { title: 'Monitor List', icon: 'nested' }
      },
      {
        path: 'history',
        name: 'MonitorHistory',
        hidden: true,
        component: () => import('@/views/monitor/history'),
        meta: { title: 'History', icon: 'table' }
      },
      {
        path: 'statistics',
        name: 'MonitorStatistics',
        hidden: true,
        component: () => import('@/views/monitor/statistics'),
        meta: { title: 'Statistics', icon: 'pie-chart' }
      },
      {
        path: 'manage',
        name: 'MonitorManage',
        hidden: true,
        component: () => import('@/views/monitor/manage'),
        meta: { title: 'Manage', icon: 'connector' }
      }
    ]
  },
  {
    path: '/command',
    component: Layout,
    redirect: '/command/list',
    name: 'Commands',
    meta: { title: 'Commands', icon: 'binary' },
    children: [
      {
        path: 'list',
        name: 'CommandList',
        component: () => import('@/views/command/list'),
        meta: { title: 'Commands', icon: 'binary' }
      }
    ]
  },

  {
    path: '/example',
    component: Layout,
    redirect: '/example/table',
    name: 'Example',
    meta: { title: 'Example', icon: 'example' },
    children: [
      {
        path: 'table',
        name: 'Table',
        component: () => import('@/views/table/index'),
        meta: { title: 'Table', icon: 'table' }
      },
      {
        path: 'tree',
        name: 'Tree',
        component: () => import('@/views/tree/index'),
        meta: { title: 'Tree', icon: 'tree' }
      }
    ]
  },

  {
    path: '/form',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Form',
        component: () => import('@/views/form/index'),
        meta: { title: 'Form', icon: 'form' }
      }
    ]
  },
  {
    path: '/nested',
    component: Layout,
    redirect: '/nested/menu1',
    name: 'Nested',
    meta: {
      title: 'Nested',
      icon: 'nested'
    },
    children: [
      {
        path: 'menu1',
        component: () => import('@/views/nested/menu1/index'), // Parent router-view
        name: 'Menu1',
        meta: { title: 'Menu1' },
        children: [
          {
            path: 'menu1-1',
            component: () => import('@/views/nested/menu1/menu1-1'),
            name: 'Menu1-1',
            meta: { title: 'Menu1-1' }
          },
          {
            path: 'menu1-2',
            component: () => import('@/views/nested/menu1/menu1-2'),
            name: 'Menu1-2',
            meta: { title: 'Menu1-2' },
            children: [
              {
                path: 'menu1-2-1',
                component: () => import('@/views/nested/menu1/menu1-2/menu1-2-1'),
                name: 'Menu1-2-1',
                meta: { title: 'Menu1-2-1' }
              },
              {
                path: 'menu1-2-2',
                component: () => import('@/views/nested/menu1/menu1-2/menu1-2-2'),
                name: 'Menu1-2-2',
                meta: { title: 'Menu1-2-2' }
              }
            ]
          },
          {
            path: 'menu1-3',
            component: () => import('@/views/nested/menu1/menu1-3'),
            name: 'Menu1-3',
            meta: { title: 'Menu1-3' }
          }
        ]
      },
      {
        path: 'menu2',
        component: () => import('@/views/nested/menu2/index'),
        meta: { title: 'menu2' }
      }
    ]
  },
  {
    path: 'external-link',
    name: 'External',
    component: Layout,
    children: [
      {
        path: 'https://panjiachen.github.io/vue-element-admin-site/#/',
        meta: { title: 'External Link', icon: 'link' }
      }
    ]
  },

  {
    path: '*',
    redirect: '/'
  }
]

export const asyncRouterMap = [
  {
    path: '/admin',
    component: Layout,
    redirect: '/admin/users',
    name: 'Admin',
    meta: { title: 'Admin', icon: 'database', roles: 'admin' },
    children: [
      {
        path: 'users',
        name: 'Users',
        component: () => import('@/views/admin/users'),
        meta: { title: 'Users', icon: 'user' }
      },
      {
        path: 'monitors',
        name: 'Monitors',
        component: () => import('@/views/admin/monitors'),
        meta: { title: 'Monitors', icon: 'cpu' }
      },
      {
        path: 'commands',
        name: 'Commands',
        component: () => import('@/views/admin/commands'),
        meta: { title: 'Commands', icon: 'binary' }
      }
    ]
  }
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})
