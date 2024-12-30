import { createApp } from "vue";
import App from "./App.vue";
import router from "./router/index";
import ElementPlus from "element-plus";
import { createPinia } from "pinia";
import "./assets/styles/main.css";
import "element-plus/dist/index.css";
import rippleDirective from "./directives/ripple";
// tslint:disable-next-line: no-unused-expression
import { VuePageStackPlugin } from "vue-page-stack";

const app = createApp(App);
const pinia = createPinia();

app.directive("ripple", rippleDirective);
app.use(router);
app.use(VuePageStackPlugin, { router });
app.use(pinia);
app.use(ElementPlus);
app.mount("#app");
