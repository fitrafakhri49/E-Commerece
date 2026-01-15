import { Request, Response } from "express";
import { prisma } from "../../prisma/client";

export async function getUserTransactions(req: Request, res: Response) {
    try {
      const user = (req as any).user;
  
      const transactions = await prisma.transaction.findMany({
        where: { userId: user.id },
        include: {
          items: {
            include: {
              product: {
                include: { images: true },
              },
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });
  
      return res.json(transactions);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Gagal mengambil history transaksi" });
    }
  }
  