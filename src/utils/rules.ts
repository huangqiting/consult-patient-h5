import type { FieldRule } from 'vant'

// 表单校验
const mobileRules: FieldRule[] = [
  { required: true, message: '手机号不能为空' },
  { pattern: /^1[3-9]\d{9}$/, message: '手机号格式错误' }
]
const passwordRules: FieldRule[] = [
  { required: true, message: '密码不能为空' },
  { pattern: /^\w{8,16}$/, message: '密码长度为8-16位 且为英文 数字 _' }
]
const codeRules: FieldRule[] = [
  { required: true, message: '验证码不能为空' },
  { pattern: /^\d{6}$/, message: '验证码只能为6位数字' }
]
export { mobileRules, passwordRules, codeRules }
