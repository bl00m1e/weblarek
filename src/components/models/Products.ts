// src/components/models/Products.ts

import { IProduct } from '../../types';
import { IEvents } from '../base/Events';

export class Products {
    private items: IProduct[] = [];
    private preview: IProduct | null = null;

    constructor(private events: IEvents) {}

    setItems(items: IProduct[]): void {
        this.items = items.map(item => ({ ...item })); // ИСПРАВЛЕНИЕ: копируем объекты
        this.events.emit('products:changed', this.getItems());
    }

    getItems(): IProduct[] {
        return [...this.items]; // ИСПРАВЛЕНИЕ: возвращаем копию
    }

    getProductById(id: string): IProduct | undefined {
        const product = this.items.find(item => item.id === id);
        return product ? { ...product } : undefined; // ИСПРАВЛЕНИЕ: возвращаем копию
    }

    setPreview(product: IProduct): void {
        this.preview = { ...product }; // ИСПРАВЛЕНИЕ: копируем объект
        this.events.emit('preview:changed', this.preview);
    }

    getPreview(): IProduct | null {
        return this.preview ? { ...this.preview } : null; // ИСПРАВЛЕНИЕ: возвращаем копию
    }
}