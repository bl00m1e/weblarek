import { Component } from '../base/Component';
import { IProduct } from '../../types';

export abstract class Card extends Component<IProduct> {
    protected titleElement: HTMLElement;
    protected priceElement: HTMLElement;

    constructor(container: HTMLElement) {
        super(container);
        this.titleElement = this.container.querySelector('.card__title')!;
        this.priceElement = this.container.querySelector('.card__price')!;
    }

    set title(value: string) {
        this.setText(this.titleElement, value);
    }

    set price(value: number | null) {
        this.setText(this.priceElement, value === null ? 'Бесценно' : `${value} синапсов`);
    }
}