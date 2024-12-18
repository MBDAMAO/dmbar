import { createApp } from "vue";
import App from "./App.vue";
import router from "./router/index";
import ElementPlus from "element-plus";
import { createPinia } from 'pinia'
import './assets/styles/main.css';
import "element-plus/dist/index.css";
const app = createApp(App);
const pinia = createPinia()
app.use(router);
app.use(pinia)
app.use(ElementPlus);
app.mount("#app");
