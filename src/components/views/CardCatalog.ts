import { CardWithImage } from './CardWithImages';
import { IProduct } from '../../types';

export class CardCatalog extends CardWithImage {
    constructor(container: HTMLElement, private onClick: () => void) {
        super(container);
        this.container.addEventListener('click', () => this.onClick());
    }

    render(data: IProduct): HTMLElement {
        this.title = data.title;
        this.image = data.image;
        this.category = data.category;
        this.price = data.price;
        return this.container;
    }
}