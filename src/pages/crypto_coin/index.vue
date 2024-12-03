<template>
    <div id="chart" style="width:100%; height:100%; background-color: black;" />
</template>
<script setup lang='ts'>
import { onMounted, onUnmounted } from 'vue'
import { USDMClient, WebsocketClient } from 'binance'
import { init, dispose } from 'klinecharts'
import { timeStamp } from 'console';

const loadData = async (chart: any) => {
    const restClient = new USDMClient();
    const initialCandleResult = await restClient.getKlines({
        symbol: "BTCUSDT",
        interval: "1m",
        limit: 100,
    });
    console.log(initialCandleResult);
    const mappedEngineCandles: any = initialCandleResult.map(
        (candle) => {
            return {
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
            };
        },
    );
    chart.loadMore((timestamp: any) => {
        setTimeout(() => {
            const firstData = chart.getDataList()[0];
            chart.applyMoreData(
                mappedEngineCandles,
                true
            );
        }, 2000);
    });
    // chart.applyMoreData(mappedEngineCandles, true)
}
let client: WebsocketClient | null = null;
onMounted(async () => {
    const chart: any = init('chart')
    const restClient = new USDMClient();
    client = new WebsocketClient({
        beautify: true,
    });
    const market = 'BTCUSDT';
    client.on('message', async (data: any) => {
        chart.updateData(
            { close: data.k.c, high: data.k.h, low: data.k.l, open: data.k.o, timestamp: data.k.t, volume: data.k.v }
        )
    });
    chart.setLoadMoreDataCallback(async ({ type, data, callback }: any) => {
        console.log(type)
        if (type === 'forward') {
            const initialCandleResult = await restClient.getKlines({
                symbol: "BTCUSDT",
                interval: "1m",
                endTime: data.timestamp,
                limit: 100,
            });
            const mappedEngineCandles: any = initialCandleResult.map(
                (candle) => {
                    return {
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
                    };
                },
            );
            fetch('https://klinecharts.com/datas/kline.json')
                .then(res => res.json())
                .then(dataList => {
                    callback(mappedEngineCandles, true);
                });
        } else {
            const initialCandleResult = await restClient.getKlines({
                symbol: "BTCUSDT",
                interval: "1m",
                startTime: data.timestamp,
                limit: 100,
            });
            const mappedEngineCandles: any = initialCandleResult.map(
                (candle) => {
                    return {
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
                    };
                },
            );
            callback(mappedEngineCandles);
        }
    });
    //subscribeContinuousContractKlines(market, 'perpetual', '1m', 'usdm');
    client.subscribeKlines(market, '1m', 'usdm')
    const initialCandleResult = await restClient.getKlines({
        symbol: "BTCUSDT",
        interval: "1m",
        limit: 100,
    });
    const mappedEngineCandles: any = initialCandleResult.map(
        (candle) => {
            return {
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
            };
        },
    );
    // const closedCandles = mappedEngineCandles.filter(
    //     (c: any) => c.closeTime <= Date.now(),
    // );
    chart.applyNewData(mappedEngineCandles, true);

    window.onresize = function () {
        chart.resize();
    }
})
onUnmounted(() => {
    if (client != null) {
        client.close;
    }
    dispose('chart')
})
</script>
<style scoped></style>