import { Api } from '../base/Api';
import type { IProductsResponse, IOrderRequest, IOrderResponse } from '../../types/index';

export class LarekAPI {
  constructor(protected api: Api) {}

  getProducts(): Promise<IProductsResponse> {
    return this.api.get<IProductsResponse>('/product');
  }

  createOrder(order: IOrderRequest): Promise<IOrderResponse> {
    return this.api.post<IOrderResponse>('/order', order);
  }
}