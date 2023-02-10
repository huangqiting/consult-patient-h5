<script setup lang="ts">
import { getUserInfo } from '@/services/user'
import { useUserStore } from '@/stores'
import type { UserInfo } from '@/types/user'
import { showConfirmDialog } from 'vant'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const store = useUserStore()
const router = useRouter()
const userInfo = ref<UserInfo>() // 存放用户信息
// 获取用户信息
onMounted(async () => {
  const { data } = await getUserInfo()
  console.log(data)

  userInfo.value = data
})

// tools 工具栏的数据
const tools = [
  { label: '我的问诊', path: '/user/consult' },
  { label: '我的处方', path: '/' },
  { label: '家庭档案', path: '/user/patient' },
  { label: '地址管理', path: '/user/address' },
  { label: '我的评价', path: '/' },
  { label: '官方客服', path: '/' },
  { label: '设置', path: '/' }
]

// 退出登录
const logout = async () => {
  // 组件弹出框
  await showConfirmDialog({
    title: '温馨提示',
    message: '您确定退出登录吗',
    confirmButtonText: '是',
    cancelButtonText: '否'
  })
  store.delUser() //删除用户信息
  router.push('/login') // 跳转登录页
}
</script>

<template>
  <div class="user-page" v-if="userInfo">
    <div class="user-page-head">
      <div class="top">
        <van-image round fit="cover" :src="userInfo.avatar" />
        <div class="name">
          <p>{{ userInfo.account }}</p>
          <p><van-icon name="edit" /></p>
        </div>
      </div>
      <van-row>
        <van-col span="6">
          <p>{{ userInfo.collectionNumber }}</p>
          <p>收藏</p>
        </van-col>
        <van-col span="6">
          <p>{{ userInfo.likeNumber }}</p>
          <p>关注</p>
        </van-col>
        <van-col span="6">
          <p>{{ userInfo.score }}</p>
          <p>积分</p>
        </van-col>
        <van-col span="6">
          <p>{{ userInfo.couponNumber }}</p>
          <p>优惠券</p>
        </van-col>
      </van-row>
    </div>
    <div class="user-page-order">
      <div class="head">
        <h3>药品订单</h3>
        <router-link to="/order"
          >全部订单 <van-icon name="arrow"
        /></router-link>
      </div>
      <van-row>
        <van-col span="6">
          <van-icon
            name="credit-pay"
            size="25"
            :badge="userInfo.orderInfo.paidNumber || ''"
            color="#f4a231"
          />
          <p>待付款</p>
        </van-col>
        <van-col span="6">
          <van-icon
            name="send-gift-o"
            size="25"
            :badge="userInfo.orderInfo.receivedNumber || ''"
            color="#6f80f0"
          />
          <p>待发货</p>
        </van-col>
        <van-col span="6">
          <van-icon
            name="logistics"
            size="25"
            :badge="userInfo.orderInfo.shippedNumber || ''"
            color="#ec3d53"
          />
          <p>待收货</p>
        </van-col>
        <van-col span="6">
          <van-icon
            name="goods-collect-o"
            size="25"
            :badge="userInfo.orderInfo.finishedNumber || ''"
            color="#f4a231"
          />
          <p>已完成</p>
        </van-col>
      </van-row>
    </div>
    <!-- 工具栏 -->
    <div class="user-page-group">
      <h3>快捷工具</h3>
      <van-cell
        v-for="(item, index) of tools"
        :key="index"
        :title="item.label"
        :to="item.path"
        is-link
        :border="false"
      >
      </van-cell>
    </div>
    <!-- 退出登录 -->
    <a class="logout" @click="logout" href="javascript:;">退出登录</a>
  </div>
</template>

<style lang="scss" scoped>
.user-page {
  background-color: var(--cp-bg);
  min-height: calc(100vh - 50px);
  padding: 0 15px 65px;
  // 头部
  &-head {
    height: 200px;
    background: linear-gradient(
      180deg,
      rgba(44, 181, 165, 0.46),
      rgba(44, 181, 165, 0)
    );
    margin: 0 -15px;
    padding: 0 15px;
    .top {
      display: flex;
      padding-top: 50px;
      align-items: center;
      .van-image {
        width: 70px;
        height: 70px;
      }
      .name {
        padding-left: 10px;
        p {
          &:first-child {
            font-size: 18px;
            font-weight: 500;
          }
          &:last-child {
            margin-top: 10px;
            color: var(--cp-primary);
            font-size: 16px;
          }
        }
      }
    }
    .van-row {
      margin: 0 -15px;
      padding-top: 15px;
      p {
        text-align: center;
        &:first-child {
          font-size: 18px;
          font-weight: 500;
        }
        &:last-child {
          color: var(--cp-dark);
          font-size: 12px;
          padding-top: 4px;
        }
      }
    }
  }
  // 订单
  &-order {
    background-color: #fff;
    border-radius: 8px;
    margin-bottom: 15px;
    padding-bottom: 15px;
    .head {
      display: flex;
      justify-content: space-between;
      line-height: 50px;
      padding: 0 15px;
      a {
        color: var(--cp-tip);
      }
    }
    .van-col {
      text-align: center;
      .cp-icon {
        font-size: 28px;
      }
      p {
        font-size: 12px;
        padding-top: 4px;
      }
    }
  }
  // 分组
  &-group {
    background-color: #fff;
    border-radius: 8px;
    overflow: hidden;
    h3 {
      padding-left: 16px;
      line-height: 44px;
    }
    .van-cell {
      align-items: center;
    }
    .cp-icon {
      font-size: 17px;
      margin-right: 10px;
    }
  }
  .logout {
    display: block;
    margin: 20px auto;
    width: 100px;
    text-align: center;
    color: var(--cp-price);
  }
}
</style>
