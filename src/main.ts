import { createApp } from 'vue'

import App from './App.vue'
import router from './router'
import pinia from './stores'

// vant全局样式引入 放置main样式的上面 把main的优先级提上来
import 'vant/lib/index.css'
import './styles/main.scss'
const app = createApp(App)
// vue注册插件 createApp().use(插件名字)
app.use(pinia)
app.use(router)

app.mount('#app')
