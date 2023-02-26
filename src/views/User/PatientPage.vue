<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import type { Patient } from '@/types/user'
import {
  addPatient,
  getPatientList,
  updatePatient,
  delPatient
} from '@/services/user'
import {
  showConfirmDialog,
  showSuccessToast,
  type FieldRule,
  type FormInstance
} from 'vant'
//存放患者信息
const list = ref<Patient[]>([])
// 获取患者信息
const loadList = async () => {
  const { data } = await getPatientList()
  list.value = data
}
onMounted(() => {
  loadList()
})

// 决定按钮显示的内容 性别
const options = [
  { label: '男', value: 1 },
  { label: '女', value: 0 }
]

// 添加患者/编辑患者  弹出层
const show = ref(false)
const showPopup = (item?: Patient) => {
  if (item) {
    const { id, name, idCard, gender, defaultFlag } = item
    patient.value = { id, name, idCard, gender, defaultFlag }
  } else {
    // 初始化患者的信息
    patient.value = { ...initPatient }
  }
  show.value = true
}

// 初始化表单患者的信息
const initPatient: Patient = {
  name: '',
  idCard: '',
  defaultFlag: 0,
  gender: 1
}
// 这里用了扩展运算符 防止对象之间数据污染
// 绑定的添加患者信息表单
const patient = ref<Patient>({ ...initPatient })

// 由于复选框返回的是布尔值 后台要的是1 | 0 这里用计算属性做处理
// 默认就诊人
const defaultFlag = computed({
  get() {
    return patient.value.defaultFlag === 1
  },
  // 拿到 v-model重新设置 patient.value.defaultFlag
  set(val) {
    patient.value.defaultFlag = val ? 1 : 0
  }
})

// 定义姓名校验
const nameRules: FieldRule[] = [
  {
    required: true,
    message: '姓名不能为空！'
  },
  {
    pattern: /^(?:[\u4e00-\u9fa5·]{2,16})$/,
    message: '姓名格式不正确！'
  }
]

// 定义身份证校验 FieldRule 文件校验类型
const idCardRules: FieldRule[] = [
  {
    required: true,
    message: '身份证不能为空！'
  },
  {
    pattern:
      /^\d{6}((((((19|20)\d{2})(0[13-9]|1[012])(0[1-9]|[12]\d|30))|(((19|20)\d{2})(0[13578]|1[02])31)|((19|20)\d{2})02(0[1-9]|1\d|2[0-8])|((((19|20)([13579][26]|[2468][048]|0[48]))|(2000))0229))\d{3})|((((\d{2})(0[13-9]|1[012])(0[1-9]|[12]\d|30))|((\d{2})(0[13578]|1[02])31)|((\d{2})02(0[1-9]|1\d|2[0-8]))|(([13579][26]|[2468][048]|0[048])0229))\d{2}))(\d|X|x)$/,
    message: '身份证格式不正确！'
  }
]

// FormInstance 是组件实例的类型
const form = ref<FormInstance>()
// 提交添加患者信息
const submit = async () => {
  // 对表单进行手动校验
  await form.value?.validate()
  // 身份证倒数第二位，单数是男，双数是女
  const gender = +patient.value.idCard.slice(-2, -1) % 2
  if (gender !== patient.value.gender) {
    await showConfirmDialog({
      title: '温馨提示',
      message: '填写的性别和身份证号中的不一致\n您确认提交吗？'
    })
  }
  // 调接口 添加患者信息/编辑患者信息
  patient.value.id
    ? await updatePatient(patient.value)
    : await addPatient(patient.value)
  // 关弹层
  show.value = false
  // 重新拿患者信息
  loadList()
  // 成功之后的提示
  patient.value.id ? showSuccessToast('编辑成功') : showSuccessToast('添加成功')
}

// 删除患者信息
const remove = async () => {
  if (patient.value.id) {
    await showConfirmDialog({
      title: '温馨提示',
      message: '您确定要删除吗？'
    })
    await delPatient(patient.value.id)
    show.value = false
    loadList()
    showSuccessToast('删除成功')
  }
}
</script>

<template>
  <div class="patient-page">
    <cp-nav-bar title="家庭档案"></cp-nav-bar>
    <div class="patient-list">
      <div class="patient-item" v-for="(item, index) of list" :key="index">
        <div class="info">
          <span class="name">{{ item.name }}</span>
          <span class="id">{{
            item.idCard.replace(/^(.{3})(?:\d+)(.{4})$/, '$1***********$2')
          }}</span>
          <span>{{ item.genderValue }}</span>
          <span>{{ item.age }}</span>
        </div>
        <div class="icon">
          <van-icon @click="showPopup(item)" name="edit" />
        </div>
        <div class="tag" v-if="item.defaultFlag === 1">默认</div>
      </div>
      <div class="patient-add" v-if="list.length < 6" @click="showPopup()">
        <van-icon name="plus" size="20" />
        <p>添加患者</p>
      </div>
      <div class="patient-tip">最多可添加 6 人</div>
    </div>

    <!-- 添加患者弹出层 -->
    <VanPopup v-model:show="show" position="right">
      <!-- 传函数到CpNavBar 就直接执行函数 不跳转路由 -->
      <CpNavBar
        :title="patient.id ? '编辑患者' : '添加患者'"
        :back="() => (show = false)"
        right-text="保存"
        @click-right="submit"
      ></CpNavBar>
      <van-form autocomplete="off" ref="form">
        <van-field
          v-model="patient.name"
          label="真实姓名"
          placeholder="请输入真实姓名"
          :rules="nameRules"
        />
        <van-field
          v-model="patient.idCard"
          label="身份证号"
          placeholder="请输入身份证号"
          :rules="idCardRules"
        />
        <van-field label="性别" class="pb4">
          <!-- 单选按钮组件 -->
          <template #input>
            <cp-radio-btn
              v-model="patient.gender"
              :options="options"
            ></cp-radio-btn>
          </template>
        </van-field>
        <van-field label="默认就诊人">
          <template #input>
            <van-checkbox v-model="defaultFlag" :icon-size="18" round />
          </template>
        </van-field>
      </van-form>
      <van-action-bar v-if="patient.id">
        <van-action-bar-button @click="remove">删除</van-action-bar-button>
      </van-action-bar>
    </VanPopup>
  </div>
</template>

<style lang="scss" scoped>
.patient-page {
  padding: 46px 0 80px;
  :deep() {
    .van-popup {
      width: 100%;
      height: 100%;
      padding-top: 46px;
      box-sizing: border-box;
    }
  }
}
// 底部删除
.van-action-bar {
  padding: 0 10px;
  margin-bottom: 10px;
  .van-button {
    color: var(--cp-price);
    background-color: var(--cp-bg);
  }
}
.patient-list {
  padding: 15px;
}
.patient-item {
  display: flex;
  align-items: center;
  padding: 15px;
  background-color: var(--cp-bg);
  border-radius: 8px;
  margin-bottom: 15px;
  position: relative;
  border: 1px solid var(--cp-bg);
  transition: all 0.3s;
  overflow: hidden;
  .info {
    display: flex;
    flex-wrap: wrap;
    flex: 1;
    span {
      color: var(--cp-tip);
      margin-right: 20px;
      line-height: 30px;
      &.name {
        font-size: 16px;
        color: var(--cp-text1);
        width: 80px;
        margin-right: 0;
      }
      &.id {
        color: var(--cp-text2);
        width: 180px;
      }
    }
  }
  .icon {
    color: var(--cp-tag);
    width: 20px;
    text-align: center;
  }
  .tag {
    position: absolute;
    right: 60px;
    top: 21px;
    width: 30px;
    height: 16px;
    font-size: 10px;
    color: #fff;
    background-color: var(--cp-primary);
    border-radius: 2px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  &.selected {
    border-color: var(--cp-primary);
    background-color: var(--cp-plain);
    .icon {
      color: var(--cp-primary);
    }
  }
}
.patient-add {
  background-color: var(--cp-bg);
  color: var(--cp-primary);
  text-align: center;
  padding: 15px 0;
  border-radius: 8px;
  .cp-icon {
    font-size: 24px;
  }
}
.patient-tip {
  color: var(--cp-tag);
  padding: 12px 0;
}
.pb4 {
  padding-bottom: 4px;
}
</style>
