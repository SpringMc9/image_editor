import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
// element-plus插件
import ElementPlus from "element-plus";
import V3ColorPicker from "v3-color-picker";
import "element-plus/dist/index.css";

// 全局icon
import * as ElementPlusIconsVue from "@element-plus/icons-vue";

const app = createApp(App);

// 全局icon
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}

app.use(V3ColorPicker);
app.use(ElementPlus);
app.use(store);
app.use(router);
app.mount("#app");
