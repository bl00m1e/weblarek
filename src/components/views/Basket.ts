// src/components/views/Basket.ts

import { Component } from '../base/Component';

interface IBasketData {
    items: HTMLElement[];
    total: number;
}

export class Basket extends Component<IBasketData> {
    protected listElement: HTMLElement;
    protected totalElement: HTMLElement;
    protected buttonElement: HTMLButtonElement;

    constructor(container: HTMLElement, private onOrder: () => void) {
        super(container);
        this.listElement = this.container.querySelector('.basket__list')!;
        this.totalElement = this.container.querySelector('.basket__price')!;
        this.buttonElement = this.container.querySelector('.basket__button')!;
        
        this.buttonElement.addEventListener('click', () => this.onOrder());
    }

    set items(items: HTMLElement[]) {
        if (items.length > 0) {
            this.listElement.replaceChildren(...items);
            this.setDisabled(this.buttonElement, false);
        } else {
            // ИСПРАВЛЕНИЕ: правильное отображение пустой корзины
            const emptyMessage = document.createElement('li');
            emptyMessage.className = 'basket__empty';
            emptyMessage.textContent = 'Корзина пуста';
            emptyMessage.style.textAlign = 'center';
            emptyMessage.style.padding = '2rem';
            emptyMessage.style.opacity = '0.5';
            this.listElement.replaceChildren(emptyMessage);
            this.setDisabled(this.buttonElement, true);
        }
    }

    set total(total: number) {
        this.setText(this.totalElement, `${total} синапсов`);
    }

    render(data: IBasketData): HTMLElement {
        this.items = data.items;
        this.total = data.total;
        return this.container;
    }
}