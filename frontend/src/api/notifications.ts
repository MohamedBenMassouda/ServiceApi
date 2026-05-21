import axios from 'axios';

const BASE =
  (import.meta.env.VITE_NOTIFICATION_URL as string | undefined) ?? 'http://localhost:3004';

export interface Notification {
  id: number;
  orderId: number;
  productId: number;
  quantity: number;
  customerEmail: string;
  sentAt: string;
}

export const getNotifications = (): Promise<Notification[]> =>
  axios.get<Notification[]>(`${BASE}/notifications`).then((r) => r.data);
