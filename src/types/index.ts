export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
    get<T extends object>(uri: string): Promise<T>;
    post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

// === Данные ===

// Товар
export interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}

// Покупатель
export interface IBuyer {
  payment: TPayment;
  email: string;
  phone: string;
  address: string;
}

// Способ оплаты
export type TPayment = 'card' | 'cash';

// === Запросы/ответы API ===

// Объект заказа, отправляемый на сервер
export interface IOrderRequest {
  payment: TPayment;
  email: string;
  phone: string;
  address: string;
  total: number;
  items: string[]; // массив id товаров
}

// Ответ сервера при получении каталога
export interface IProductsResponse {
  total: number;
  items: IProduct[];
}

// Ответ сервера при оформлении заказа
export interface IOrderResponse {
  id: string;
  total: number;
}