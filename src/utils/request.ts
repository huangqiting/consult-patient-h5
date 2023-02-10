// 二次封装axios
import router from '@/router'
import { useUserStore } from '@/stores'
import axios, { type Method } from 'axios'
import { showToast } from 'vant'
// 1.创建一个新的axios实例，配置基准地址，配置响应超时时间
// 2.添加请求拦截器，在请求头携带token
// 3.添加响应拦截器，401错误拦截去登录页面，判断业务是否成功，剥离无效数据
const baseURL = 'https://consult-api.itheima.net/'
const instance = axios.create({
  baseURL,
  timeout: 5000
})

instance.interceptors.request.use(
  (config) => {
    // 获取user仓库
    const store = useUserStore()
    // 如果有token 且有config.headers 则为所有请求添加请求头
    if (store.user?.token && config.headers) {
      config.headers.Authorization = `Bearer ${store.user.token}`
    }
    // 记得一定要返回出去
    return config
  },
  // 返回一个错误的promise出去
  (err) => Promise.reject(err)
)
instance.interceptors.response.use(
  (res) => {
    // 正常返回10000，其他表示错误
    // 错误提示用户 返回错误的promise'
    if (res.data.code !== 10000) {
      showToast(res.data.message || '网络错误')
      return Promise.reject(res.data)
    }
    // 剥离无效数据
    return res.data
  },
  (err) => {
    // 请求报错，响应出错
    // 遇到401跳转登录
    // 1.现在在 /user/patient 页面下，发起一个获取用户信息的请求，但是此时token失效
    // 2.跳转登录页面，登录成功之后，需要跳转回 /user/patient 页面 （默认跳转 /user 首页）
    // router 路由实例，提供路由相关函数操作 route 路由相关信息
    if (err.response.status === 401) {
      // 删除用户信息
      const store = useUserStore()
      store.delUser()
      // path 不带查询参数
      // fullPath 完整路径
      router.push(`/login?returnUrl=${router.currentRoute.value.fullPath}`)
    }
    return Promise.reject(err)
  }
)

// 请求工具函数
// 1.参数：url method submitData
// 2.返回：instance调用接口的promise对象
// const request = (url: string, method: string, submitData: object) => {
//   return instance.request({
//     url,
//     method,
//     // 区分get和其他请求post
//     // toLowerCase()把传过来的请求转成小写
//     [method.toLowerCase() === 'get' ? 'params' : 'data']: submitData
//   })
// }
type Data<T> = {
  code: string
  message: string
  data: T
}
const request = <T>(
  url: string,
  method: Method = 'get',
  submitData?: object
) => {
  return instance.request<T, Data<T>>({
    url,
    method,
    // 区分get和其他请求post
    // toLowerCase()把传过来的请求转成小写
    [method.toLowerCase() === 'get' ? 'params' : 'data']: submitData
  })
}

export { baseURL, instance, request }
