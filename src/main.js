import { createApp } from 'vue'
import App from './App.vue' // ViteでJSに変換されたものをimport
import draggable from 'vuedraggable'
import './assets/style.css'

const app = createApp(App)  // 引数に指定されたApp.vueを元にUIを構築
app.mount('#app')           // index.htmlの指定要素にマウント