import { CardWithImage } from './CardWithImages';
import { IProduct } from '../../types';

export class CardPreview extends CardWithImage {
    protected descriptionElement: HTMLElement;
    protected buttonElement: HTMLButtonElement;
    private currentPrice: number | null = null;

    constructor(
        container: HTMLElement,
        private onButtonClick: () => void
    ) {
        super(container);
        this.descriptionElement = this.container.querySelector('.card__text')!;
        this.buttonElement = this.container.querySelector('.card__button')!;
        
        this.buttonElement.addEventListener('click', (e) => {
            e.stopPropagation();
            this.onButtonClick();
        });
    }

    public updateButtonState(isInCart: boolean): void {
        if (this.currentPrice !== null) {
            this.buttonElement.dataset.inCart = String(isInCart);
            this.setText(this.buttonElement, isInCart ? 'Удалить из корзины' : 'Купить');
        }
    }

    private updateButtonText(isInCart: boolean, price: number | null): void {
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
        this.title = data.title;
        this.image = data.image;
        this.category = data.category;
        this.price = data.price;
        this.description = data.description;
        this.updateButtonText(data.inCart, data.price);
        return this.container;
    }
}