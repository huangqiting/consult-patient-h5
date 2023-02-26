<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { useWindowSize } from '@vueuse/core'
import DoctorCard from './DoctorCard.vue'
import { getDoctorPage } from '@/services/consult'
import type { DoctorList } from '@/types/consult'

// // 手写自适应宽度 推荐关注医生
// const width = ref(0)
// // window.innerWidth 当前可视文档的宽度
// const setWidth = () => (width.value = window.innerWidth)
// onMounted(() => {
//   setWidth()
//   // resize 改变窗口大小的事件
//   window.addEventListener('resize', setWidth)
// })
// onUnmounted(() => {
//   window.removeEventListener('resize', setWidth)
// })

// 当前可视文档的宽度
const { width } = useWindowSize()

// 获取首页关注医生列表
const list = ref<DoctorList>([]) // 存储关注医生列表
const loadData = async () => {
  const { data } = await getDoctorPage({ current: 1, pageSize: 5 })
  list.value = data.rows
  console.log(data)
}
onMounted(() => loadData())
</script>

<template>
  <div class="follow-doctor">
    <div className="head">
      <p>推荐关注</p>
      <a href="javascript:;"> 查看更多<i class="van-icon van-icon-arrow" /></a>
    </div>
    <div class="body">
      <!-- swipe 组件 -->
      <VanSwipe
        :loop="false"
        :show-indicators="false"
        :width="(150 / 375) * width"
      >
        <VanSwipeItem v-for="i in 6" :key="i"
          ><DoctorCard></DoctorCard
        ></VanSwipeItem>
      </VanSwipe>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.follow-doctor {
  background-color: var(--cp-bg);
  height: 250px;
  .head {
    display: flex;
    justify-content: space-between;
    height: 45px;
    align-items: center;
    padding: 0 15px;
    font-size: 13px;
    > a {
      color: var(--cp-tip);
    }
  }
  .body {
    width: 100%;
    overflow: hidden;
  }
}
</style>
