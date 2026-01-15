import { Request, Response } from "express";
import { prisma } from "../../prisma/client";
import { v2 as cloudinary } from "cloudinary";


// CREATE PRODUCT
export async function createProduct(req: Request, res: Response) {
  try {
    const { name, price, stock, description, artist, releaseYear, trackList } = req.body;
    const files = req.files as Express.Multer.File[] | undefined;

    if (!name || !price) {
      return res.status(400).json({ message: "Name dan price wajib diisi" });
    }

    // Buat product tanpa image dulu
    const product = await prisma.product.create({
      data: {
        name,
        price: Number(price),
        stock: Number(stock),
        description,
        artist,
        releaseYear: releaseYear ? Number(releaseYear) : undefined,
        trackList: trackList ? JSON.stringify(trackList) : undefined, // simpan trackList sebagai JSON string
      },
    });

    // Upload images ke Cloudinary jika ada
    if (files && files.length > 0) {
      const imagesData = [];
      for (const file of files) {
        const uploaded = await cloudinary.uploader.upload(file.path, {
          folder: `E-Commerce_Products/${product.name}`,
        });
        imagesData.push({ url: uploaded.secure_url });
      }

      await prisma.product.update({
        where: { id: product.id },
        data: { images: { create: imagesData } },
      });
    }

    const productWithImages = await prisma.product.findUnique({
      where: { id: product.id },
      include: { images: true },
    });

    res.json({ message: "Product berhasil dibuat", product: productWithImages });
  } catch (err) {
    console.error("CREATE PRODUCT ERROR:", err);
    res.status(500).json({ message: "Gagal membuat product" });
  }
}


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
  
  export async function updateProduct(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name, price, stock, description, artist, releaseYear, trackList } = req.body;
      const files = req.files as Express.Multer.File[] | undefined;
      // 🔴 CEK PRODUCT EXIST
      const existingProduct = await prisma.product.findUnique({
        where: { id },
      });
  
      if (!existingProduct) {
        return res.status(404).json({
          message: "Product dengan ID tersebut tidak ditemukan",
        });
      }
      const data: any = {};
      if (name !== undefined) data.name = name;
      if (price !== undefined) data.price = Number(price);
      if (stock !== undefined) data.stock = Number(stock);
      if (description !== undefined) data.description = description;
      if (artist !== undefined) data.artist = artist;
      if (releaseYear !== undefined) data.releaseYear = Number(releaseYear);
      if (trackList !== undefined) data.trackList = JSON.stringify(trackList);
  
      if (files && files.length > 0) {
        const imagesData = [];
        for (const file of files) {
          const uploaded = await cloudinary.uploader.upload(file.path, {
            folder: `E-Commerce_Products/${name || "product"}`,
          });
          imagesData.push({ url: uploaded.secure_url });
        }
        data.images = { create: imagesData };
      }
  
      const product = await prisma.product.update({
        where: { id },
        data,
        include: { images: true },
      });
  
      res.json({ message: "Product berhasil diupdate", product });
    } catch (error) {
      console.error("UPDATE PRODUCT ERROR:", error);
      res.status(500).json({ message: "Gagal update product" });
    }
  }
  export const deleteProduct = async (req:Request, res:Response) => {
    const { id } = req.params;
  
    try {
         // 🔴 CEK PRODUCT EXIST
    const existingProduct = await prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      return res.status(404).json({
        message: "Product dengan ID tersebut tidak ditemukan",
      });
    }
      await prisma.$transaction(async (tx) => {
        // 1. hapus item transaksi dulu
        await tx.transactionItem.deleteMany({
          where: { productId: id },
        });
  
        // 2. hapus gambar product jika ada
        await tx.productImage.deleteMany({
          where: { productId: id },
        });
  
        // 3. baru hapus product
        await tx.product.delete({
          where: { id },
        });
      });
  
      res.json({ message: "Product berhasil dihapus" });
    } catch (error:any) {
      console.error("DELETE PRODUCT ERROR:", error);
      res.status(500).json({
        message: "Gagal menghapus product",
        detail: error.message,
      });
    }
  };
  
  
  export async function addProductImages(req: Request, res: Response) {
    try {
      const { id } = req.params; // product id
      const files = req.files as Express.Multer.File[] | undefined;
  
      if (!files || files.length === 0) {
        return res.status(400).json({ message: "Tidak ada file yang diupload" });
      }
  
      // Cari product untuk folder Cloudinary
      const product = await prisma.product.findUnique({ where: { id } });
      if (!product) return res.status(404).json({ message: "Product tidak ditemukan" });
  
      // Upload semua file sekaligus
      const uploadPromises = files.map(file =>
        cloudinary.uploader.upload(file.path, {
          folder: `E-Commerce_Products/${product.name}`,
        })
      );
  
      const uploadedResults = await Promise.all(uploadPromises);
  
      // Simpan URL ke Prisma
      const imagesData = uploadedResults.map(result => ({ url: result.secure_url }));
  
      const updatedProduct = await prisma.product.update({
        where: { id },
        data: { images: { create: imagesData } },
        include: { images: true },
      });
  
      res.json({
        message: "Gambar berhasil ditambahkan",
        product: updatedProduct,
      });
    } catch (error) {
      console.error("ADD PRODUCT IMAGES ERROR:", error);
      res.status(500).json({ message: "Gagal menambahkan gambar" });
    }
  }