<script setup lang="ts">
// 需求：
// 1.实现点击返回按钮，放回上一个页面（历史记录）
// 2.暴露一个props属性，title设置标题，rightText设置标题

import { useRouter } from 'vue-router'

// 3.点击右侧文字按钮，通过事件来通知父组件
const router = useRouter()
const onClickLeft = () => {
  // 实现返回
  // Vue Router 将信息保存在 history.state上
  // history.state 来标记第一层路由的时候需要对 vue-router 的这一数据进行特殊的处理。
  if (history.state?.back) {
    router.back()
  } else {
    router.push('/home')
  }
}
const onClickRight = () => {
  // 点击右侧文字按钮，执行逻辑
  emit('click-right')
}
// 标题名和右边按键名
defineProps<{
  title?: string
  rightText?: string
}>()
// 直接让父组件做出对应的逻辑
const emit = defineEmits<{
  (e: 'click-right'): void
}>()
</script>

<template>
  <VanNavBar
    :title="title"
    :right-text="rightText"
    left-arrow
    fixed
    @click-left="onClickLeft"
    @click-right="onClickRight"
  ></VanNavBar>
</template>
<style lang="scss" scoped>
:deep() {
  // .van-nav-bar__arrow
  // .van-nav-bar__text
  // &链接符 连接上一级选择器 和下一级选择器 合并一个选择器
  .van-nav-bar {
    &__arrow {
      font-size: 18px;
      color: var(--cp-text1) !important;
    }
    &__text {
      font-size: 15px;
    }
  }
}
</style>
