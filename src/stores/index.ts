// 目录下的入口文件
// 单独维护的pinia
// 创建好的pinia仓库统一从这里导出
import { createPinia } from 'pinia'
import persist from 'pinia-plugin-persistedstate'
const pinia = createPinia()
// pinia注册插件 createPinia().use(pinia插件名字)
pinia.use(persist)
export default pinia

// 完整写法
// import { useUserStore } from './user'
// export { useUserStore }
export * from './user'
