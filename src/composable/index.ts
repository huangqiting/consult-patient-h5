// 封装逻辑，规范 useXxx，表示使用某功能

import { followOrUnfollow } from '@/services/consult'
import type { FollowType } from '@/types/consult'
import { ref } from 'vue'

// 关注逻辑 type 传什么关注类型掉对应的接口
export const useFollow = (type: FollowType) => {
  // 定义转圈圈
  const loading = ref(false)
  // 类型兼容：类型多的可以兼容类型少的 多的包含少点不会报错
  const follow = async (item: { id: string; likeFlag: 0 | 1 }) => {
    // 开启转圈圈
    loading.value = true
    try {
      // 根据类型和id调用关注接口
      await followOrUnfollow(item.id, type)
      // 是否关注 1是关注 0是未关注 这里的操作相当于取反
      item.likeFlag = item.likeFlag === 1 ? 0 : 1
    } finally {
      // 无论是否关注成功 都把转圈圈关掉
      loading.value = false
    }
  }
  // 把页面需要的方法和属性返回出去
  return { loading, follow }
}
