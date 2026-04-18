// src/components/views/CardPreview.ts

import { Card } from './Card';
import { IProduct } from '../../types';

export class CardPreview extends Card {
    protected descriptionElement: HTMLElement;
    protected buttonElement: HTMLButtonElement;
    private currentPrice: number | null = null;
    private currentId: string = '';

    constructor(
        container: HTMLElement,
        private onAdd: (id: string) => void,
        private onRemove: (id: string) => void
    ) {
        super(container);
        this.descriptionElement = this.container.querySelector('.card__text')!;
        this.buttonElement = this.container.querySelector('.card__button')!;
        
        this.buttonElement.addEventListener('click', (e) => {
            e.stopPropagation();
            
            if (this.buttonElement.disabled) {
                return;
            }
            
            const isInCart = this.buttonElement.dataset.inCart === 'true';
            
            if (isInCart) {
                this.onRemove(this.currentId);
            } else {
                this.onAdd(this.currentId);
            }
        });
    }

    // ПУБЛИЧНЫЙ МЕТОД для обновления состояния кнопки
    public updateCartState(isInCart: boolean): void {
        if (this.currentPrice !== null) {
            this.buttonElement.dataset.inCart = String(isInCart);
            this.setText(this.buttonElement, isInCart ? 'Удалить из корзины' : 'Купить');
        }
    }

    private updateButtonState(isInCart: boolean, price: number | null): void {
        this.currentPrice = price;
        this.buttonElement.dataset.inCart = String(isInCart);
        
        if (price === null) {
            this.setText(this.buttonElement, 'Недоступно');
            this.setDisabled(this.buttonElement, true);
        } else {
            this.setText(this.buttonElement, isInCart ? 'Удалить из корзины' : 'Купить');
            this.setDisabled(this.buttonElement, false);
        }
    }

    set description(value: string) {
        this.setText(this.descriptionElement, value);
    }

    render(data: IProduct & { inCart: boolean }): HTMLElement {
        this.currentId = data.id;
        this.currentPrice = data.price;
        
        this.id = data.id;
        this.title = data.title;
        this.image = data.image;
        this.category = data.category;
        this.price = data.price;
        this.description = data.description;
        this.updateButtonState(data.inCart, data.price);
        
        return this.container;
    }
}