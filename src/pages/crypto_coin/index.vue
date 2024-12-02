<template>
    <div style="height: 100%; width: 100%;background-color: azure;">
        <canvas id="myChart"></canvas>
    </div>
</template>
<script setup lang='ts'>
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
    const res: string = await invoke("get_kline", { symbol: "DOGEUSDT" });
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
    const res: string = await invoke("get_orders", { symbol: "DOGEUSDT" });
    console.log(res);
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
                    label: 'DOGE/USDT',
                    data: klineData.value,  // 使用响应式数据
                }],
            },
        });
    }
}

onMounted(() => {
    get_kline();  // 在组件挂载后获取数据并绘制图表
    get_orders();
});
</script>
<style scoped></style>