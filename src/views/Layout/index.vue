<script setup lang="ts"></script>

<template>
  <div class="layout-page">
    <RouterView></RouterView>
    <van-tabbar route inactive-color="#e2e1e4" active-color="#25d19c">
      <van-tabbar-item to="/home" icon="wap-home">首页</van-tabbar-item>
      <van-tabbar-item to="/article" icon="column">健康百科</van-tabbar-item>
      <van-tabbar-item to="/notify" icon="bell">通知</van-tabbar-item>
      <van-tabbar-item to="/user" icon="manager">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>
<style lang="scss" scoped></style>
