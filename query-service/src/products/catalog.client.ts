import { Injectable } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { firstValueFrom } from "rxjs";
import { Product } from "./product.model";

@Injectable()
export class CatalogClient {
  private readonly baseUrl = process.env.CATALOG_URL ?? "http://localhost:3001";

  constructor(private readonly http: HttpService) {}

  async findAll(): Promise<Product[]> {
    const { data } = await firstValueFrom(
      this.http.get<Product[]>(`${this.baseUrl}/products`),
    );
    return data;
  }

  async findOne(id: number): Promise<Product | null> {
    try {
      const { data } = await firstValueFrom(
        this.http.get<Product>(`${this.baseUrl}/products/${id}`),
      );
      return data;
    } catch (err) {
      if (err.response?.status === 404) return null;
      throw err;
    }
  }
}
