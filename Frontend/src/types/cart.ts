import { Product } from "./product";

export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
}

export interface CartItem {
  id: string;
  productId: string; // ⬅️ TAMBAHKAN
  quantity: number;
  product: Product;
}