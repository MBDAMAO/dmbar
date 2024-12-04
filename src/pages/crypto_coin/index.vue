<template>
    <div id="chart" style="width:100%; height:100%;" />
</template>
<script setup lang='ts'>
import { onMounted, onUnmounted } from 'vue'
import { USDMClient, WebsocketClient } from 'binance'
import { init, dispose, registerIndicator, TooltipShowRule, Chart, Nullable } from 'klinecharts'
import { assert } from 'console';
let symbol = 'DOGEUSDT'
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
let client: WebsocketClient | null = null;
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
    // chart.createOverlay("segment");
    chart.createIndicator('MA', false, { id: "candle_pane" });
    chart.setPrecision({
        price: 5,
        volume: 5
    });
    client = new WebsocketClient({});
    client.on('message', async (data: any) => {
        chart.updateData(
            {
                close: Number(data.k.c), high: Number(data.k.h), low: Number(data.k.l),
                open: Number(data.k.o), timestamp: data.k.t, volume: Number(data.k.v)
            }
        )
    });
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
            // we dont need backward
            callback([]);
        }
    });
    //subscribeContinuousContractKlines(market, 'perpetual', '1m', 'usdm');
    client.subscribeKlines(symbol, '1m', 'usdm')
    chart.applyNewData(await getKline({
        symbol: symbol,
        interval: "1m",
        limit: 100,
    }), true);

    window.onresize = function () {
        chart.resize();
    }
})
onUnmounted(() => {
    if (client != null) {
        client.closeAll();
    }
    dispose('chart')
})
</script>
<style scoped></style>