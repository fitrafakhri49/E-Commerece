// src/config/midtrans.ts
import midtransClient from "midtrans-client";

export const snap = new midtransClient.Snap({
  isProduction: false, //true kalau production
  serverKey: process.env.MIDTRANS_SERVER_KEY as string,
  clientKey: process.env.MIDTRANS_CLIENT_KEY as string,
});
