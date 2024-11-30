export interface Category {
  id: string;
  name: string;
  description: string;
  slug: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  categoryId: string;
  slug: string;
}

export interface CartItem {
  productId: string;
  quantity: number;
}

export interface StoreSettings {
  storeName: string;
}