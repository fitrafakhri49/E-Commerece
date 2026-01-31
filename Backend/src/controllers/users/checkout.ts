import { Request, Response } from "express";
import { prisma } from "../../prisma/client";
import { snap } from "../../midtrans/client";

export const checkout = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const userId = user.id;

    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: { product: true },
        },
        user: true,
      },
    });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart kosong" });
    }

    //Validasi Stock
    for (const item of cart.items) {
      if (item.quantity > item.product.stock) {
        return res.status(400).json({
          message: `Stok produk "${item.product.name}" tidak mencukupi`,
        });
      }
    }

    const grossAmount = cart.items.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );

    const orderId = `ORDER-${Date.now()}`;

    const itemDetails = cart.items.map((item) => ({
      id: item.product.id,
      name: item.product.name,
      price: item.product.price,
      quantity: item.quantity,
    }));

    const parameter = {
      transaction_details: {
        order_id: orderId,
        gross_amount: grossAmount,
      },
      item_details: itemDetails,
      customer_details: {
        email: cart.user.email,
        first_name: cart.user.name || cart.user.full_name || "Customer",
      },
    };

    const transaction = await snap.createTransaction(parameter);

    await prisma.transaction.create({
      data: {
        orderId,
        userId,
        grossAmount,
        snapToken: transaction.token,
        redirectUrl: transaction.redirect_url,
        status: "PENDING",
        items: {
          create: cart.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.price,
          })),
        },
      },
    });

    await prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    });

    return res.json({
      token: transaction.token,
      redirect_url: transaction.redirect_url,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Checkout gagal" });
  }
};
