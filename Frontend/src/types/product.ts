// src/types/product.ts
export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  description?: string | null;
  artist?: string | null;
  releaseYear?: number | null;
  trackList?: string[]; // tracklist disimpan sebagai array string
  images: ProductImage[];
  image: string | null; // URL gambar utama
}

export interface ProductImage {
  id: string;
  url: string;
}
