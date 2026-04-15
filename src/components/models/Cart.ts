import { IProduct } from '../../types/index';

export class Cart {
  private items: IProduct[] = [];

  /**
   * Возвращает массив всех товаров в корзине
   */
  getCartItems(): IProduct[] {
    return this.items;
  }

  /**
   * Добавляет товар в корзину по его ID (если товара ещё нет в корзине)
   */
  addProductToCart(product: IProduct): void {
    if (!this.isProductInCart(product.id)) {
      this.items.push(product);
    }
  }

  /**
   * Удаляет товар из корзины по его ID
   */
  removeProductFromCart(id: string): void {
    this.items = this.items.filter((item) => item.id !== id);
  }

  /**
   * Полностью очищает корзину
   */
  clearCart(): void {
    this.items = [];
  }

  /**
   * Возвращает общую стоимость всех товаров в корзине
   */
  getCartTotalPrice(): number {
    return this.items.reduce((sum, item) => {
      return item.price !== null ? sum + item.price : sum;
    }, 0);
  }

  /**
   * Возвращает количество товаров в корзине
   */
  getCartItemsCount(): number {
    return this.items.length;
  }

  /**
   * Проверяет, есть ли товар в корзине по его ID
   */
  isProductInCart(id: string): boolean {
    return this.items.some((item) => item.id === id);
  }
}