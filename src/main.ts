import { createApp } from "vue";
import App from "./App.vue";
import router from "./router/index";
import ElementPlus from "element-plus";
import { createPinia } from "pinia";
import "./assets/styles/main.css";
import "element-plus/dist/index.css";
import rippleDirective from "./directives/ripple";
// tslint:disable-next-line: no-unused-expression
// import { VuePageStackPlugin } from "vue-page-stack";
import { setUpVant } from "./plugins/vant";

const app = createApp(App);
const pinia = createPinia();

app.directive("ripple", rippleDirective);
app.use(router);
setUpVant(app);
// app.use(VuePageStackPlugin, { router });
app.use(pinia);
app.use(ElementPlus);
app.mount("#app");
