import { Card } from './Card';
import { IProduct } from '../../types';

export class CardBasket extends Card {
    protected indexElement: HTMLElement;
    protected deleteButton: HTMLButtonElement;

    constructor(
        container: HTMLElement,
        private onDelete: () => void
    ) {
        super(container);
        this.indexElement = this.container.querySelector('.basket__item-index')!;
        this.deleteButton = this.container.querySelector('.basket__item-delete')!;
        
        this.deleteButton.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.onDelete();
        });
        
        this.container.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
        });
    }

    set index(value: number) {
        this.setText(this.indexElement, value);
    }

    render(data: IProduct & { index: number }): HTMLElement {
        this.title = data.title;
        this.price = data.price;
        this.index = data.index;
        return this.container;
    }
}