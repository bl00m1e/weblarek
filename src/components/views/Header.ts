import { Component } from '../base/Component';

interface IHeaderData {
    counter: number;
}

export class Header extends Component<IHeaderData> {
    protected basketButton: HTMLElement;
    protected basketCounter: HTMLElement;

    constructor(container: HTMLElement, private onBasketClick: () => void) {
        super(container);
        this.basketButton = this.container.querySelector('.header__basket')!;
        this.basketCounter = this.container.querySelector('.header__basket-counter')!;
        
        this.basketButton.addEventListener('click', () => this.onBasketClick());
    }

    set counter(value: number) {
        this.setText(this.basketCounter, String(value));
    }

    render(data?: IHeaderData): HTMLElement {
        if (data) {
            this.counter = data.counter;
        }
        return this.container;
    }
}