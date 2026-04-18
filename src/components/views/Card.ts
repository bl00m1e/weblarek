// src/components/views/Card.ts

import { Component } from '../base/Component';
import { IProduct } from '../../types';
import { categoryMap, categoryNames } from '../../utils/constants';

export class Card extends Component<IProduct> {
    protected titleElement: HTMLElement;
    protected imageElement: HTMLImageElement;
    protected categoryElement: HTMLElement;
    protected priceElement: HTMLElement;

    constructor(container: HTMLElement) {
        super(container);
        this.titleElement = this.container.querySelector('.card__title')!;
        this.imageElement = this.container.querySelector('.card__image')!;
        this.categoryElement = this.container.querySelector('.card__category')!;
        this.priceElement = this.container.querySelector('.card__price')!;
    }

    set id(value: string) {
        this.container.dataset.id = value;
    }

    get id(): string {
        return this.container.dataset.id || '';
    }

    set title(value: string) {
        this.setText(this.titleElement, value);
    }

    set image(value: string) {
        this.setImage(this.imageElement, value, this.title);
    }

    set category(value: string) {
        // Определяем класс категории
        let categoryClass: string;
        
        if (value in categoryMap) {
            categoryClass = categoryMap[value];
        } else {
            categoryClass = value;
        }
        
        let displayText: string;
        if (value in categoryNames) {
            displayText = categoryNames[value];
        } else {
            displayText = value;
        }
        
        this.setText(this.categoryElement, displayText);
        this.categoryElement.className = 'card__category';
        this.categoryElement.classList.add(`card__category_${categoryClass}`);
    }

    set price(value: number | null) {
        this.setText(this.priceElement, value === null ? 'Бесценно' : `${value} синапсов`);
        // УБИРАЕМ блокировку контейнера!
        // Карточка всегда должна быть кликабельной
    }
}