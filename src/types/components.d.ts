// 给components下的全局组件设置类型
import CpNavBar from '@/components/CpNavBar.vue'
import CpRadioBtn from '@/components/CpRadioBtn.vue'
import CpIcon from '@/components/CpIcon.vue'
// 对非ts/js文件模块进行类型扩充
// 声明vue类型模块
declare module 'vue' {
  // 给vue 添加全局组件类型 interface 和之前的合并
  interface GlobalComponents {
    // typeof 作用就是得到对应的TS类型
    CpNavBar: typeof CpNavBar
    CpIcon: typeof CpIcon
    CpRadioBtn: typeof CpRadioBtn
  }
}

// typeof
// const obj = {
//   name: 'zs',
//   age: 18
// }

// type obj2 = typeof obj
