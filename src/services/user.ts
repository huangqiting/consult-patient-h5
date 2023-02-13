// 用户相关的api
import type { CodeType, Patient, User, UserInfo } from '@/types/user'
import { request } from '@/utils/request'
// 密码登录
export const loginByPassword = (mobile: string, password: string) => {
  return request<User>('login/password', 'POST', { mobile, password })
}
// 获取验证码
export const sendMobileCode = (mobile: string, type: CodeType) => {
  return request('code', 'GET', { mobile, type })
}
// 验证码登录
export const loginByCode = (mobile: string, code: string) => {
  return request<User>('login', 'POST', { mobile, code })
}
// 获取个人用户信息
export const getUserInfo = () => {
  return request<UserInfo>('patient/myUser')
}
// 获取家庭档案-患者信息
export const getPatientList = () => {
  return request<Patient[]>('patient/mylist')
}
