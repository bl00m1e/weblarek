// src/components/views/Success.ts
import { Component } from '../base/Component';

interface ISuccessData {
    total: number;
}

export class Success extends Component<ISuccessData> {
    protected closeButton: HTMLButtonElement;
    protected descriptionElement: HTMLElement;

    constructor(container: HTMLElement, private onClose: () => void) {
        super(container);
        this.closeButton = this.container.querySelector('.order-success__close')!;
        this.descriptionElement = this.container.querySelector('.order-success__description')!;

        this.closeButton.addEventListener('click', () => this.onClose());
    }

    set total(value: number) {
        this.setText(this.descriptionElement, `Списано ${value} синапсов`);
    }

    render(data: ISuccessData): HTMLElement {
        this.total = data.total;
        return this.container;
    }
}