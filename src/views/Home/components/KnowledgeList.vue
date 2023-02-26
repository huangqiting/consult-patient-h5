<script setup lang="ts">
import { getKnowledgePage } from '@/services/consult'
import type { Knowledge, KnowledgeParams, KnowledgeType } from '@/types/consult'
import { ref } from 'vue'
import KnowledgeCard from './KnowledgeCard.vue'

// 父组件传过来的请求什么类型的文章
const props = defineProps<{
  type: KnowledgeType
}>()
// 模拟加载更多
const loading = ref(false) // 是否处于加载状态，加载过程中不触发 load 事件
const finished = ref(false) // 是否已加载完成，加载完成后不再触发 load 事件
const list = ref<Knowledge[]>([])
const params = ref<KnowledgeParams>({
  type: props.type,
  current: 1,
  pageSize: 5
})
//onLoad 滚动条与底部距离小于 offset 时触发
const onLoad = async () => {
  const { data } = await getKnowledgePage(params.value)
  list.value.push(...data.rows)
  if (params.value.current >= data.pageTotal) {
    finished.value = false
  } else {
    params.value.current++
  }
  loading.value = false
}
</script>

<template>
  <div class="knowledge-list">
    <van-list
      v-model:loading="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <knowledge-card
        v-for="item of list"
        :key="item.id"
        :item="item"
      ></knowledge-card>
    </van-list>
  </div>
</template>

<style lang="scss" scoped>
.knowledge-list {
  padding: 0 15px;
}
</style>
