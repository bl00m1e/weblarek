// src/components/views/CardCatalog.ts

import { Card } from './Card';
import { IProduct } from '../../types';

export class CardCatalog extends Card {
    constructor(container: HTMLElement, private onClick: (id: string) => void) {
        super(container);
        // ВСЕ карточки должны быть кликабельными, независимо от цены
        this.container.addEventListener('click', () => this.onClick(this.id));
    }

    render(data: IProduct): HTMLElement {
        this.id = data.id;
        this.title = data.title;
        this.image = data.image;
        this.category = data.category;
        this.price = data.price;
        // НЕ блокируем контейнер здесь! Цена null не должна влиять на кликабельность карточки
        return this.container;
    }
}