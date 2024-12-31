<template>
    <div class="flex flex-col h-full">
        <!-- Chart container -->
        <div class="chart-reigon w-full" :class="hideFunctionReigon ? 'h-[100%]' : 'h-[90%]'">
            <div id="chart" class="h-full w-full" />
        </div>

        <div class="funtion-reigon flex justify-between p-2 h-[10%]" :class="{ hidden: hideFunctionReigon }">
            <button class="cursor-pointer hover:bg-gray-200" @click="buy">Buy</button>
            <button class="cursor-pointer hover:bg-gray-200" @click="sell">Sell</button>
        </div>
    </div>
</template>
<script setup lang='ts'>
import { onMounted, onUnmounted, ref } from 'vue'
import { WebsocketClient } from 'binance'
import { init, dispose, TooltipShowRule, Chart, Nullable, LineType } from 'klinecharts'
const symbol = 'DOGEUSDT'
import { getKline } from '@/apis/crypto';
let wsClient: WebsocketClient | null = null;
const hideFunctionReigon = ref(true);
// Update visibility based on window height
const updateVisibility = () => {
    hideFunctionReigon.value = window.innerHeight < 400; // Example threshold
};
onMounted(async () => {
    updateVisibility();
    window.addEventListener('resize', updateVisibility);
    const chart: Nullable<Chart> = init('chart', {
        styles: {
            candle: {
                tooltip: {
                    showRule: TooltipShowRule.None
                }
            },
        }
    })
    if (chart == null) return;
    chart.createOverlay({
        name: 'simpleTag',
        paneId: 'candle_pane',
        lock: true,
        styles: {
            line: {
                color: '#FF0000',
                style: LineType.Dashed
            },
            text: {
                backgroundColor: '#FF0000'
            }
        },
        points: [
            { timestamp: 0, value: 0.4352 },
        ]
    });
    chart.createIndicator('MA', false, { id: "candle_pane" });
    chart.setPrecision({
        price: 5,
        volume: 5
    });
    // chart.createOverlay('horizontalRayLine')
    chart.setLoadMoreDataCallback(async ({ type, data, callback }: any) => {
        console.log(type)
        if (type === 'forward') {
            callback(await getKline({
                symbol: symbol,
                interval: "1m",
                endTime: data.timestamp,
                limit: 200,
            }), true);
        } else {
            callback([]);
        }
    });
    wsClient = new WebsocketClient({});
    wsClient.on('message', async (data: any) => {
        switch (data.e) {
            case 'kline': {
                chart.updateData(
                    {
                        close: Number(data.k.c), high: Number(data.k.h), low: Number(data.k.l),
                        open: Number(data.k.o), timestamp: data.k.t, volume: Number(data.k.v)
                    }
                )
            }
        }
    });
    //subscribeContinuousContractKlines(market, 'perpetual', '1m', 'usdm');
    chart.applyNewData(await getKline({
        symbol: symbol,
        interval: "1m",
        limit: 200,
    }), true);
    wsClient.subscribeKlines(symbol, '1m', 'usdm')
    // wsClient.subscribeSpotUserDataStream()

    window.onresize = function () {
        chart.resize();
    }
})
onUnmounted(() => {
    if (wsClient != null) {
        wsClient.closeAll();
    }
    dispose('chart')
})
</script>
<style scoped></style>