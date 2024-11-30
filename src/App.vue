<script setup lang="ts">
import { ref, onMounted } from "vue";
import { invoke } from "@tauri-apps/api/core";
import { Chart } from 'chart.js/auto' // Easy way of importing everything

import { OhlcElement, OhlcController, CandlestickElement, CandlestickController } from 'chartjs-chart-financial' // 直接引入以注册图表插件
import 'chartjs-adapter-date-fns';

Chart.register(OhlcElement, OhlcController, CandlestickElement, CandlestickController)

const greetMsg = ref("");
const name = ref("");
const klineData = ref<any[]>([]);  // 使用 ref 使 klineData 响应式
let chartInstance: Chart | null = null;  // 用于保存图表实例

// 获取 K 线数据并创建图表
const get_kline = async () => {
  const res: string = await invoke("get_kline", { symbol: "BTCUSDT" });
  const parsedData = JSON.parse(res);
  console.log(parsedData);
  // 转换数据格式
  const klineChartData = parsedData.map((kline: any) => ({
    x: kline[0],  // 开盘时间（时间戳）
    o: parseFloat(kline[1]),  // 开盘价
    h: parseFloat(kline[2]),  // 最高价
    l: parseFloat(kline[3]),  // 最低价
    c: parseFloat(kline[4]),  // 收盘价
  }));

  // 更新响应式数据
  klineData.value = klineChartData;
  createChart();
};
const get_orders = async () => {
  const res: string = await invoke("get_orders", { symbol: "BTCUSDT" });
  const parsedData = JSON.parse(res);
  console.log(parsedData);
}
// 创建图表
function createChart() {
  const ctx = (document.getElementById('myChart') as HTMLCanvasElement).getContext('2d');
  if (chartInstance instanceof Chart) {
    chartInstance.destroy();
  }
  console.log(klineData.value)
  if (ctx) {
    chartInstance = new Chart(ctx, {
      type: 'candlestick',  // 使用 candlestick 类型来绘制 K 线图
      data: {
        datasets: [{
          label: 'BTC/USDT',
          data: klineData.value,  // 使用响应式数据
        }],
      },
      // options: {
      //   responsive: true,
      //   scales: {
      //     x: {
      //       type: 'time',
      //       time: {
      //         unit: 'minute',  // 可以根据需要调整
      //       },
      //     },
      //     y: {
      //       beginAtZero: false,
      //     },
      //   },
      // },
    });
  }
}

onMounted(() => {
  get_kline();  // 在组件挂载后获取数据并绘制图表
  get_orders();
});
</script>

<template>
  <div style="height: 100%; width: 100%; background-color: antiquewhite;" data-tauri-drag-region>
    123
  </div>

  <div class="kline" style="height: 20px; width: 20px; background-color: antiquewhite;" @click="get_kline">
    {{ greetMsg }}
  </div>

  <div style="height: 200px; background-color: azure;">
    <canvas id="myChart"></canvas>
  </div>
</template>

<style scoped src="@/assets/styles/index.css"></style>

<style>
/* :root {
  font-family: Inter, Avenir, Helvetica, Arial, sans-serif;
  font-size: 16px;
  line-height: 24px;
  font-weight: 400;

  color: #0f0f0f;
  background-color: #f6f6f6;

  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  -webkit-text-size-adjust: 100%;
}

.container {
  margin: 0;
  padding-top: 10vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
}

.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: 0.75s;
}

.logo.tauri:hover {
  filter: drop-shadow(0 0 2em #24c8db);
}

.row {
  display: flex;
  justify-content: center;
}

a {
  font-weight: 500;
  color: #646cff;
  text-decoration: inherit;
}

a:hover {
  color: #535bf2;
}

h1 {
  text-align: center;
}

input,
button {
  border-radius: 8px;
  border: 1px solid transparent;
  padding: 0.6em 1.2em;
  font-size: 1em;
  font-weight: 500;
  font-family: inherit;
  color: #0f0f0f;
  background-color: #ffffff;
  transition: border-color 0.25s;
  box-shadow: 0 2px 2px rgba(0, 0, 0, 0.2);
}

button {
  cursor: pointer;
}

button:hover {
  border-color: #396cd8;
}

button:active {
  border-color: #396cd8;
  background-color: #e8e8e8;
}

input,
button {
  outline: none;
}

#greet-input {
  margin-right: 5px;
}

@media (prefers-color-scheme: dark) {
  :root {
    color: #f6f6f6;
    background-color: #000000;
  }

  a:hover {
    color: #24c8db;
  }

  input,
  button {
    color: #ffffff;
    background-color: #0f0f0f98;
  }

  button:active {
    background-color: #0f0f0f69;
  }
} */
</style>