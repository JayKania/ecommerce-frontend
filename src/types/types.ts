export type CartItem = {
  itemId: string;
  quantity: number;
  price: number;
  itemName: string;
};

export type Product = {
  id: string;
  name: string;
  price: number;
};


export type Stats = {
  userId: string,
  totalOrders: number,
  totalItemsPurchased: number,
  totalSpent: number,
  totalDiscount: number,
  discountCodes: string[],
}