import type { App } from "vue";
import rippleDirective from "@/directives/ripple";

export function install(app: App) {
  app.directive("ripple", rippleDirective);
}
