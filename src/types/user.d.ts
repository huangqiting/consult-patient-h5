// 用户信息
export type User = {
  id: string
  token: string
  avatar: string
  mobile: string
  account: string
}
// 验证码信息类型
export type CodeType =
  | 'login'
  | 'register'
  | 'changeMobile'
  | 'forgetPassword'
  | 'bindMobile'

// Pick 与 Omit TS内置类型
// Pick 是从一个对象类型 取出某些属性
// Omit 是从一个对象类型 排除某些属性
// 个人信息
type OmitUser = Omit<User, 'token'>
export type UserInfo = OmitUser & {
  /** 关注 */
  likeNumber: number
  /** 收藏 */
  collectionNumber: number
  /** 积分 */
  score: number
  /** 优惠券 */
  couponNumber: number
  orderInfo: {
    /** 待付款 */
    paidNumber: number
    /** 待发货 */
    receivedNumber: number
    /** 待收货 */
    shippedNumber: number
    /** 已完成 */
    finishedNumber: number
  }
}
