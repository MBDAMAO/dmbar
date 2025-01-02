import type { App } from "vue";
import { install as elementInstall } from "./element";
import { install as piniaInstall } from "./pinia";
import { install as routerInstall } from "./router";
import { install as vantInstall } from "./vant";
import { install as directiveInstall } from "./directive";
export function registerPlugins(app: App) {
  elementInstall(app);
  piniaInstall(app);
  routerInstall(app);
  vantInstall(app);

  directiveInstall(app);
}
