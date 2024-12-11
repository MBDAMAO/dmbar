// crypto.ts
import { USDMClient } from "binance";

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

export const getKline = async (params: any) => {
  const restClient = new USDMClient();
  const initialCandleResult = await restClient.getKlines(params);
  return mapCandles(initialCandleResult);
};

export const getUserPositions = async (params: any) => {};
