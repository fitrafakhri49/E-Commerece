import { Request, Response } from "express";
import { prisma } from "../../prisma/client";


export async function getItemCarts(req: Request, res: Response) {
  try {
    const user = (req as any).user;

    if (!user?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const cart = await prisma.cart.findUnique({
      where: { userId: user.id },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: true,
              },
            },
          },
        },
      },
    });

    res.json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}

/**
 * ADD ITEM TO CART
 */
export async function addItemToCart(req: Request, res: Response) {
    try {
      const user = (req as any).user;
      const { productId, quantity = 1 } = req.body;
  
      if (!user?.id) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const product = await prisma.product.findUnique({
        where: { id: productId },
      });
      
      if (!product) {
        return res.status(404).json({ message: "Produk tidak ditemukan" });
      }
      
      if (product.stock <= 0) {
        return res.status(400).json({
          message: "Stok produk habis",
        });
      }
      
      if (!productId) {
        return res.status(400).json({ message: "productId wajib" });
      }
  
      let cart = await prisma.cart.findUnique({
        where: { userId: user.id },
      });
  
      if (!cart) {
        cart = await prisma.cart.create({
          data: { userId: user.id },
        });
      }
  
      const existingItem = await prisma.cartItem.findUnique({
        where: {
          cartId_productId: {
            cartId: cart.id,
            productId,
          },
        },
      });
  
      if (existingItem) {
        return res.status(400).json({
          message: "Produk sudah ada di keranjang",
        });
      }
  
      // ✅ PRODUK BARU
      const newItem = await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          quantity,
        },
      });
  
      res.status(201).json(newItem);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  }
  
/**
 * INCREASE / DECREASE ITEM
 */
export async function decreasIncreaseItemToCart(req: Request, res: Response) {
  try {
    const user = (req as any).user;
    const { productId } = req.params;
    const { action } = req.body; // "increase" | "decrease"

    if (!user?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const cart = await prisma.cart.findUnique({
      where: { userId: user.id },
    });

    if (!cart) {
      return res.status(404).json({ message: "Cart tidak ditemukan" });
    }

    const cartItem = await prisma.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId,
        },
      },
    });

    if (!cartItem) {
      return res.status(404).json({ message: "Item tidak ditemukan" });
    }

    if (action === "increase") {
      const updated = await prisma.cartItem.update({
        where: { id: cartItem.id },
        data: { quantity: cartItem.quantity + 1 },
      });

      return res.json(updated);
    }

    if (action === "decrease") {
      if (cartItem.quantity <= 1) {
        await prisma.cartItem.delete({
          where: { id: cartItem.id },
        });

        return res.json({ message: "Item dihapus" });
      }

      const updated = await prisma.cartItem.update({
        where: { id: cartItem.id },
        data: { quantity: cartItem.quantity - 1 },
      });

      return res.json(updated);
    }

    res.status(400).json({ message: "Action tidak valid" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}
