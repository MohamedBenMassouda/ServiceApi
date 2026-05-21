import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { Order } from './order.model';

@Injectable()
export class OrderClient {
  private readonly baseUrl = process.env.ORDER_URL ?? 'http://localhost:3002';

  constructor(private readonly http: HttpService) {}

  async findAll(): Promise<Order[]> {
    const { data } = await firstValueFrom(
      this.http.get<Order[]>(`${this.baseUrl}/orders`),
    );
    return data;
  }

  async findOne(id: number): Promise<Order | null> {
    try {
      const { data } = await firstValueFrom(
        this.http.get<Order>(`${this.baseUrl}/orders/${id}`),
      );
      return data;
    } catch (err) {
      if (err.response?.status === 404) return null;
      throw err;
    }
  }
}
