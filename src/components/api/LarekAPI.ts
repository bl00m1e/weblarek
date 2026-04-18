// src/components/api/LarekAPI.ts
import { Api } from '../base/Api';
import { IProduct, IOrderRequest, IOrderResponse } from '../../types';

export interface IApi {
    get<T>(uri: string): Promise<T>;
    post<T>(uri: string, data: object, method?: string): Promise<T>;
}

export class LarekAPI {
    private api: Api;

    constructor(baseUrl: string, options?: RequestInit) {
        this.api = new Api(baseUrl, options);
    }

    getProducts(): Promise<{ items: IProduct[] }> {
        return this.api.get<{ items: IProduct[] }>('/product');
    }

    createOrder(order: IOrderRequest): Promise<IOrderResponse> {
        return this.api.post<IOrderResponse>('/order', order);
    }
}