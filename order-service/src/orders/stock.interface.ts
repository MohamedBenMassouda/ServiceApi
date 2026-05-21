import { Observable } from 'rxjs';

// Typed client stub generated against stock.proto. NestJS will populate this
// at runtime via @Client / ClientGrpc.getService('StockService').

export interface StockGrpcClient {
  CheckAndReserve(data: { productId: number; quantity: number }): Observable<{
    available: boolean;
    message: string;
  }>;
}
