export interface Transaction {
  id: string;
  status: "PENDING" | "SUCCESS" | "FAILED" | "EXPIRED";
  grossAmount: number;
  createdAt: string;
  user: {
    id: string;
    email: string;
    name: string | null;
  };
  items: {
    id: string;
    quantity: number;
    price: number;
    product: {
      id: string;
      name: string;
    };
  }[];
}
