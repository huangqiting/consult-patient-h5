import { useUserStore } from '@/stores'
import { createRouter, createWebHistory, useRoute } from 'vue-router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
// 插件配置 修改进度条颜色
NProgress.configure({
  showSpinner: false
})
// createRouter创建路由模式
const router = createRouter({
  // 选择路由模式 历史模式
  history: createWebHistory(import.meta.env.BASE_URL),
  // 路由规则
  routes: [
    {
      path: '/login',
      component: () => import('@/views/Login/index.vue') // 路由懒加载
    },
    {
      path: '/',
      component: () => import('@/views/Layout/index.vue'),
      redirect: '/home',
      children: [
        {
          path: '/home',
          component: () => import('@/views/Home/index.vue'),
          meta: {
            title: '首页'
          }
        },
        {
          path: '/article',
          component: () => import('@/views/Article/index.vue'),
          meta: {
            title: '健康百科'
          }
        },
        {
          path: '/notify',
          component: () => import('@/views/Notify/index.vue'),
          meta: {
            title: '通知'
          }
        },
        {
          path: '/user',
          component: () => import('@/views/User/index.vue'),
          meta: {
            title: '我的'
          }
        }
      ]
    },
    {
      path: '/user/patient',
      component: () => import('@/views/User/PatientPage.vue'),
      meta: {
        title: '家庭档案'
      }
    }
  ]
})

// 访问权限拦截
// to 目标的路由信息
// return '路由地址' 就是拦截到某个页面
// 不return 则代表放行
router.beforeEach((to) => {
  // 开启进度条
  NProgress.start()
  const store = useUserStore()
  const whiteList = ['/login'] // 路径白名单
  // 如果没有token 且不在白名单内 则跳转登录页 其他情况放行
  if (!store.user?.token && !whiteList.includes(to.path)) return '/login'
})
router.afterEach((to) => {
  // 动态切换路由标题 建议在后置守卫修改 切换路由之后
  document.title = `优医问诊-${to.meta.title}`
  // 关闭进条
  NProgress.done()
})
export default router
