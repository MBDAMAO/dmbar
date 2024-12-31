import { PullRefresh } from "vant";
// 适配桌面端，把mouse转为touch事件
import "@vant/touch-emulator";
import "vant/lib/index.css";

export function setUpVant(app: any) {
  app.use(PullRefresh);
}
