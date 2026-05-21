import axios from 'axios';

const BASE = (import.meta.env.VITE_CATALOG_URL as string | undefined) ?? 'http://localhost:3001';

export interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
}

export const getProducts = (): Promise<Product[]> =>
  axios.get<Product[]>(`${BASE}/products`).then((r) => r.data);
