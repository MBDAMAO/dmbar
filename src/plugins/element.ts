import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import type { App } from 'vue'

export function install(app: App) {
  app.use(ElementPlus)
}
