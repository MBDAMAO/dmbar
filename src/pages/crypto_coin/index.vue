<template>
    <div style="display: flex; flex-direction: column; height: 100%;">
        <!-- Chart container -->
        <div id="chart" style="flex: 1; width: 100%; height: 80%;" />

        <!-- Buttons container -->
        <div style="display: flex; justify-content: space-between; padding: 10px; height: 20%;">
            <button @click="buy">Buy</button>
            <button @click="sell">Sell</button>
        </div>
    </div>
</template>
<script setup lang='ts'>
import { onMounted, onUnmounted } from 'vue'
import { USDMClient, WebsocketClient } from 'binance'
import { init, dispose, TooltipShowRule, Chart, Nullable, LineType } from 'klinecharts'
const symbol = 'DOGEUSDT'
const mapCandles = (candles: any[]) => {
    return candles.map((candle) => ({
        open: Number(candle[1]),
        high: Number(candle[2]),
        low: Number(candle[3]),
        close: Number(candle[4]),
        volume: Number(candle[5]),
        openTime: candle[0],
        openDt: new Date(candle[0]),
        closeTime: candle[6],
        closeDt: new Date(candle[6]),
        timestamp: candle[0],
    }));
};
let wsClient: WebsocketClient | null = null;
const getKline = async (params: any) => {
    const restClient = new USDMClient();
    const initialCandleResult = await restClient.getKlines(params);
    const mappedEngineCandles: any = mapCandles(initialCandleResult)
    return mappedEngineCandles;
}
onMounted(async () => {
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
                limit: 100,
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
        limit: 100,
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
<style scoped>
button {
    cursor: pointer;
}

button:hover {
    background-color: #f0f0f0;
}
</style>