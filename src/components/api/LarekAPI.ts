import type { IProductsResponse, IOrderRequest, IOrderResponse, IApi } from '../../types/index';

export class LarekAPI {
  constructor(protected api: IApi) {}

  getProducts(): Promise<IProductsResponse> {
    return this.api.get<IProductsResponse>('/product');
  }

  createOrder(order: IOrderRequest): Promise<IOrderResponse> {
    return this.api.post<IOrderResponse>('/order', order);
  }
}