import { Observable } from "rxjs";

export interface StockGrpcClient {
  CheckAndReserve(data: { productId: number; quantity: number }): Observable<{
    available: boolean;
    message: string;
  }>;
}
