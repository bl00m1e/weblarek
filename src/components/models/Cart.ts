import { IProduct } from '../../types/index';

export class Cart {
  private items: IProduct[] = [];

  getItems(): IProduct[] {
    return this.items;
  }

  add(product: IProduct): void {
    if (!this.has(product.id)) {
      this.items.push(product);
    }
  }

  remove(product: IProduct | string): void {
    const id = typeof product === 'string' ? product : product.id;
    this.items = this.items.filter((item) => item.id !== id);
  }

  clear(): void {
    this.items = [];
  }

  getTotal(): number {
    return this.items.reduce((sum, item) => {
      return item.price !== null ? sum + item.price : sum;
    }, 0);
  }

  getCount(): number {
    return this.items.length;
  }

  has(id: string): boolean {
    return this.items.some((item) => item.id === id);
  }
}