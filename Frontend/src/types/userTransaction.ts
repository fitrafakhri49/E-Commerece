export interface UserTransaction {
    id: string;
    status: "PENDING" | "SUCCESS" | "FAILED" | "EXPIRED";
    grossAmount: number;
    createdAt: string;
    items: {
      id: string;
      quantity: number;
      price: number;
      product: {
        id: string;
        name: string;
        images: {
          url: string;
        }[];
      };
    }[];
  }
  