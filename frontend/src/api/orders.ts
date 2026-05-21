import axios from 'axios';

const BASE = (import.meta.env.VITE_ORDER_URL as string | undefined) ?? 'http://localhost:3002';

export interface Order {
  id: number;
  productId: number;
  quantity: number;
  customerEmail: string;
  status: string;
  createdAt: string;
}

export interface CreateOrderDto {
  productId: number;
  quantity: number;
  customerEmail: string;
}

export const getOrders = (): Promise<Order[]> =>
  axios.get<Order[]>(`${BASE}/orders`).then((r) => r.data);

export const createOrder = (dto: CreateOrderDto): Promise<Order> =>
  axios.post<Order>(`${BASE}/orders`, dto).then((r) => r.data);
