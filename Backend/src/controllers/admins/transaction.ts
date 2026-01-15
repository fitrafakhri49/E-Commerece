// src/controllers/admin/transactionController.ts
import { Request, Response } from "express";
import { prisma } from "../../prisma/client";

export const approveTransaction = async (req: Request, res: Response) => {
  try {
    const { transactionId } = req.params;

    const transaction = await prisma.transaction.findUnique({
      where: { id: transactionId },
      include: {
        items: { include: { product: true } }, // ambil items dari transaksi
      },
    });

    if (!transaction) {
      return res.status(404).json({ message: "Transaksi tidak ditemukan" });
    }

    if (transaction.status !== "PENDING") {
      return res.status(400).json({ message: "Transaksi sudah diproses" });
    }

    // Update status transaksi menjadi SUCCESS
    await prisma.transaction.update({
      where: { id: transactionId },
      data: { status: "SUCCESS" },
    });

    // Kurangi stock berdasarkan item transaksi
    for (const item of transaction.items) {
      await prisma.product.update({
        where: { id: item.productId },
        data: {
          stock: {
            decrement: item.quantity,
          },
        },
      });
    }

    return res.json({
      message: "Transaksi berhasil di-ACC dan stok produk berkurang",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal ACC transaksi" });
  }
};

export const rejectTransaction = async (req: Request, res: Response) => {
    try {
      const { transactionId } = req.params;
  
      const transaction = await prisma.transaction.findUnique({
        where: { id: transactionId },
      });
  
      if (!transaction) {
        return res.status(404).json({ message: "Transaksi tidak ditemukan" });
      }
  
      if (transaction.status !== "PENDING") {
        return res.status(400).json({
          message: "Transaksi tidak bisa digagalkan",
        });
      }
  
      await prisma.transaction.update({
        where: { id: transactionId },
        data: { status: "FAILED" },
      });
  
      return res.json({
        message: "Transaksi berhasil digagalkan",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Gagal menggagalkan transaksi" });
    }
  };

  export const getAllTransactions = async (req: Request, res: Response) => {
    try {
      const transactions = await prisma.transaction.findMany({
        include: {
          user: {
            select: {
              id: true,
              email: true,
              name: true,
              full_name: true,
            },
          },
          items:{
            include:{
              product:true
            }
          }
        },
        orderBy: {
          createdAt: "desc",
        },
      });
  
      return res.json(transactions);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Gagal mengambil data transaksi" });
    }
  };