import { Card } from './Card';
import { categoryMap, categoryNames } from '../../utils/constants';

export abstract class CardWithImage extends Card {
    protected imageElement: HTMLImageElement;
    protected categoryElement: HTMLElement;

    constructor(container: HTMLElement) {
        super(container);
        this.imageElement = this.container.querySelector('.card__image')!;
        this.categoryElement = this.container.querySelector('.card__category')!;
    }

    set image(value: string) {
        this.setImage(this.imageElement, value, this.title);
    }

    set category(value: string) {
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
}