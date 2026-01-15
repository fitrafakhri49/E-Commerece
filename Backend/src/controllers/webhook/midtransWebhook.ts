import { Request, Response } from "express";
import crypto from "crypto";
import { prisma } from "../../prisma/client";

export const midtransWebhook = async (req: Request, res: Response) => {
  try {
    const notification = req.body;

    const {
      order_id,
      status_code,
      gross_amount,
      signature_key,
      transaction_status,
      fraud_status,
    } = notification;

    // ===============================
    // VALIDASI SIGNATURE
    // ===============================
    const serverKey = process.env.MIDTRANS_SERVER_KEY!;
    const payload = order_id + status_code + gross_amount + serverKey;

    const expectedSignature = crypto
      .createHash("sha512")
      .update(payload)
      .digest("hex");

    if (signature_key !== expectedSignature) {
      return res.status(403).json({ message: "Invalid signature" });
    }

    const transaction = await prisma.transaction.findUnique({
      where: { orderId: order_id },
      include: { items: true },
    });

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    // ❗ Jika sudah SUCCESS / FAILED / EXPIRED, hentikan
    if (transaction.status !== "PENDING") {
      return res.status(200).json({ message: "Already processed" });
    }

    // ===============================
    // TRANSAKSI BERHASIL
    // ===============================
    if (
      transaction_status === "settlement" ||
      (transaction_status === "capture" && fraud_status === "accept")
    ) {
      await prisma.$transaction(async (tx) => {
        // 1️⃣ UPDATE STATUS
        await tx.transaction.update({
          where: { id: transaction.id },
          data: { status: "SUCCESS" },
        });

        // 2️⃣ KURANGI STOK
        for (const item of transaction.items) {
          await tx.product.update({
            where: { id: item.productId },
            data: {
              stock: {
                decrement: item.quantity,
              },
            },
          });
        }
      });
    }

    // ===============================
    // TRANSAKSI EXPIRED
    // ===============================
    if (transaction_status === "expire") {
      await prisma.transaction.update({
        where: { id: transaction.id },
        data: { status: "EXPIRED" },
      });
    }

    // ===============================
    // TRANSAKSI GAGAL
    // ===============================
    if (
      transaction_status === "cancel" ||
      transaction_status === "deny"
    ) {
      await prisma.transaction.update({
        where: { id: transaction.id },
        data: { status: "FAILED" },
      });
    }

    return res.status(200).json({ message: "Webhook processed" });
  } catch (error) {
    console.error("Midtrans webhook error:", error);
    return res.status(500).json({ message: "Webhook error" });
  }
};
