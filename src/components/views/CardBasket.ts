// src/components/views/CardBasket.ts
import { Card } from './Card';
import { IProduct } from '../../types';

export class CardBasket extends Card {
    protected indexElement: HTMLElement;
    protected deleteButton: HTMLButtonElement;

    constructor(container: HTMLElement, private onDelete: (id: string) => void) {
        super(container);
        this.indexElement = this.container.querySelector('.basket__item-index')!;
        this.deleteButton = this.container.querySelector('.basket__item-delete')!;
        
        // Предотвращаем всплытие события
        this.deleteButton.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.onDelete(this.id);
        });
        
        // Предотвращаем клик по всей карточке
        this.container.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
        });
    }

    set index(value: number) {
        this.setText(this.indexElement, value);
    }

    render(data: IProduct & { index: number }): HTMLElement {
        this.id = data.id;
        this.index = data.index;
        this.title = data.title;
        this.price = data.price;
        return this.container;
    }
}