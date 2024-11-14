import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import 'element-plus/dist/index.css'
import router from './router/index'
import './assets/css/index.scss';
import './assets/css/main.scss';
import './style.css'

import App from './App.vue'

const app = createApp(App)
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);
app.use(pinia)
app.use(router)
app.use(ElementPlus)
app.mount('#app')
