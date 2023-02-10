<script setup lang="ts">
import { mobileRules, passwordRules, codeRules } from '@/utils/rules'
import { showSuccessToast, showToast, type FormInstance } from 'vant'
import { onUnmounted, ref } from 'vue'
import { loginByPassword, sendMobileCode, loginByCode } from '@/services/user'
import { useUserStore } from '@/stores'
import { useRoute, useRouter } from 'vue-router'
const show = ref(false) // 控制密码 明文和密文
const mobile = ref('') // 手机号
const password = ref('') // 密码
const agree = ref(false)
const store = useUserStore()
const router = useRouter()
const route = useRoute()
// 账号登录操作 表单校验成功会执行
const login = async () => {
  if (!agree.value) return showToast('请勾选我已同意')
  // if (isPass.value) {
  //   const { data } = await loginByPassword(mobile.value, password.value)
  // } else {
  //   const { data } = await loginByCode(mobile.value, code.value)
  // }
  const { data } = isPass.value
    ? await loginByPassword(mobile.value, password.value)
    : await loginByCode(mobile.value, code.value)
  // 存储用户信息
  store.setUser(data)
  showSuccessToast('登录成功')
  // replace跳转不会产生历史记录
  router.replace((route.query.returnUrl as string) || '/user')
}

// 验证码登录操作
const isPass = ref(true) // 控制手机号登录的切换
const code = ref('') // 短信验证码
const time = ref(0) // 倒计时 时间
const form = ref<FormInstance>() // 表单实例
let timeId: number
// 发送验证码
const send = async () => {
  // 如果发生验证码在倒计时 就直接退出
  if (time.value > 0) return
  // 获取表单实例 验证手机号再发生验证码请求
  await form.value?.validate('mobile')
  await sendMobileCode(mobile.value, 'login')

  // 点击发送验证码后的倒计时
  time.value = 60
  clearInterval(timeId)
  timeId = setInterval(() => {
    time.value--
    if (time.value <= 0) {
      clearInterval(timeId)
    }
  }, 1000)

  // 切换页面时 组件销毁 应该清除定时器
  onUnmounted(() => {
    clearInterval(timeId)
  })
}
</script>

<template>
  <div class="login-page">
    <cp-nav-bar
      title="登录"
      rightText="注册"
      @click-right="$router.push('/register')"
    ></cp-nav-bar>
    <!-- 头部 -->
    <div class="login-head">
      <h3>{{ isPass ? '账号登录' : '手机号登录' }}</h3>
      <a href="javascript:;">
        <span @click="isPass = !isPass">{{
          isPass ? '手机号登录' : '账号登录'
        }}</span>
        <van-icon name="arrow"></van-icon>
      </a>
    </div>
    <!-- 表单 -->
    <van-form ref="form" @submit="login">
      <van-field
        type="text"
        name="mobile"
        v-model="mobile"
        placeholder="请输入手机号"
        :rules="mobileRules"
      ></van-field>
      <van-field
        v-if="isPass"
        v-model="password"
        :type="show ? 'text' : 'password'"
        name="密码"
        :rules="passwordRules"
        placeholder="请输入密码"
      >
        <template #button>
          <van-icon
            @click="show = !show"
            :name="show ? 'eye-o' : 'closed-eye'"
          />
        </template>
      </van-field>
      <van-field
        v-else
        v-model="code"
        :type="show ? 'text' : 'password'"
        name="验证码"
        :rules="codeRules"
        placeholder="请输入验证码"
      >
        <template #button>
          <span :class="{ active: time > 0 }" @click="send" class="btn-send">{{
            time > 0 ? `${time}后重新发送` : '发送验证码'
          }}</span>
        </template>
      </van-field>
      <div class="cp-cell">
        <van-checkbox v-model="agree">
          <span>我已同意 </span>
          <a href="javascript:;">用户协议</a>
          <span> 及 </span>
          <a href="javascript:;">隐私条款</a>
        </van-checkbox>
      </div>
      <div class="cp-cell">
        <van-button native-type="submit" block round type="primary"
          >登 录</van-button
        >
      </div>

      <div class="cp-cell">
        <a href="javascript:;">忘记密码？</a>
      </div>
    </van-form>
    <!-- 底部 -->
    <div class="login-other">
      <van-divider>第三方登录</van-divider>
      <div class="icon">
        <van-icon name="qq" size="25px" color="#009df7" />
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.login {
  &-page {
    padding-top: 46px;
  }
  &-head {
    display: flex;
    padding: 30px 30px 50px;
    justify-content: space-between;
    align-items: flex-end;
    line-height: 1;
    h3 {
      font-weight: normal;
      font-size: 24px;
    }
    a {
      font-size: 15px;
    }
  }
  &-other {
    margin-top: 60px;
    padding: 0 30px;
    .icon {
      display: flex;
      justify-content: center;
      img {
        width: 36px;
        height: 36px;
        padding: 4px;
      }
    }
  }
}
.van-form {
  padding: 0 14px;
  .cp-cell {
    font-size: 13.9px;
    height: 52px;
    line-height: 24px;
    padding: 14px 16px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    .van-checkbox {
      a {
        color: var(--cp-primary);
        padding: 0 5px;
      }
    }
  }
  .btn-send {
    color: var(--cp-primary);
    &.active {
      color: rgba(22, 194, 163, 0.5);
    }
  }
}
</style>
