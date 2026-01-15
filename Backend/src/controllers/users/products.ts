import { Request, Response } from "express";
import { prisma } from "../../prisma/client";

// GET PRODUCTS DENGAN SORTING DAN SEARCH (TERMASUK ARTIST & YEAR)
// GET ALL PRODUCTS
export async function getProducts(req: Request, res: Response) {
  try {
    const { sort, search } = req.query as { sort?: string; search?: string };

    let orderBy: any = { createdAt: "desc" };
    if (sort === "price_asc") orderBy = { price: "asc" };
    else if (sort === "price_desc") orderBy = { price: "desc" };
    else if (sort === "newest") orderBy = { createdAt: "desc" };
    else if (sort === "oldest") orderBy = { createdAt: "asc" };

    const where: any = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { artist: { contains: search, mode: "insensitive" } },
        { releaseYear: { equals: Number(search) || 0 } }, // search by year
      ];
    }

    const products = await prisma.product.findMany({
      where,
      orderBy,
      include: {
        images: { take: 1 },
      },
    });

    const formattedProducts = products.map((product) => ({
      id: product.id,
      name: product.name,
      price: product.price,
      stock: product.stock,
      description: product.description,
      artist: product.artist || null,
      releaseYear: product.releaseYear || null,
      trackList: product.trackList ? JSON.parse(product.trackList) : [],
      image: product.images[0]?.url || null,
    }));

    res.json(formattedProducts);
  } catch (err) {
    console.error("GET PRODUCTS ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
}

// GET PRODUCT BY ID
export async function getProductById(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const product = await prisma.product.findUnique({
      where: { id },
      include: { images: true },
    });

    if (!product) {
      return res.status(404).json({ message: "Product tidak ditemukan" });
    }

    res.json({
      id: product.id,
      name: product.name,
      price: product.price,
      stock: product.stock,
      description: product.description,
      artist: product.artist || null,
      releaseYear: product.releaseYear || null,
      trackList: product.trackList ? JSON.parse(product.trackList) : [],
      images: product.images,
    });
  } catch (err) {
    console.error("GET PRODUCT BY ID ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
}
