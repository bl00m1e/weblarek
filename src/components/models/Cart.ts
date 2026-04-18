import { IProduct } from '../../types';
import { IEvents } from '../base/Events';

export class Cart {
    private items: IProduct[] = [];

    constructor(private events: IEvents) {}

    private emitChanges() {
        this.events.emit('cart:changed', {
            items: [...this.items], 
            total: this.getTotal()
        });
    }

    addProduct(product: IProduct): void {
        if (!this.isInCart(product.id) && product.price !== null) {
            this.items.push({ ...product }); 
            this.emitChanges();
        }
    }

    removeProduct(id: string): void {
        const initialLength = this.items.length;
        this.items = this.items.filter(item => item.id !== id);
        if (this.items.length !== initialLength) {
            this.emitChanges();
        }
    }

    clear(): void {
        if (this.items.length > 0) {
            this.items = [];
            this.emitChanges();
        }
    }

    getTotal(): number {
        return this.items.reduce((sum, item) => sum + (item.price || 0), 0);
    }

    getItems(): IProduct[] {
        return [...this.items]; 
    }

    getCount(): number {
        return this.items.length;
    }

    isInCart(id: string): boolean {
        return this.items.some(item => item.id === id);
    }
}