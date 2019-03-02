import router from './router'
import store from './store'
import NProgress from 'nprogress' // Progress 进度条
import 'nprogress/nprogress.css'// Progress 进度条样式
import { Message } from 'element-ui'
import { getToken } from '@/utils/auth' // 验权

// 不重定向白名单
const whiteList = [
  '/signin',
  '/signup'
]

const hasPermission = (roles) => {
  const userRole = store.state.role

  if (userRole === 'admin') {
    return true
  }

  if (Array.isArray(roles) && roles.indexOf(userRole) > -1) {
    return true
  }

  if (roles === userRole) {
    return true
  }

  return false
}

router.beforeEach((to, from, next) => {
  NProgress.start()

  if (getToken()) {
    // whitelist
    if (whiteList.indexOf(to.path) > -1) {
      NProgress.done()
      return next({ path: '/' })
    }

    // not signed
    if (!store.getters.role) {
      return store.dispatch('GetInfo').then(res => { // 拉取用户信息
        next()
      }).catch((err) => {
        store.dispatch('SignOut').then(() => {
          Message.error(err || 'Verification failed, please signin again')
          next({ path: '/' })
        })
      })
    }

    // permission check
    if (to.meta.roles && !hasPermission(to.meta.roles)) {
      return next({ path: '/401', replace: true, query: { noGoBack: true }})
    }

    return next()
  } else {
    if (whiteList.indexOf(to.path) > -1) {
      return next()
    }

    next(`/signin?redirect=${to.path}`) // 否则全部重定向到登录页
    NProgress.done()
  }
})

router.afterEach(() => {
  NProgress.done() // 结束Progress
})
