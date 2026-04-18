import { Component } from '../base/Component';

interface IGalleryData {
    items: HTMLElement[];
}

export class Gallery extends Component<IGalleryData> {
    constructor(container: HTMLElement) {
        super(container);
    }

    set items(items: HTMLElement[]) {
        this.container.replaceChildren(...items);
    }

    showError(message: string): void {
        this.container.innerHTML = `<p style="color: white; text-align: center; width: 100%;">${message}</p>`;
    }

    render(data?: IGalleryData): HTMLElement {
        if (data) {
            this.items = data.items;
        }
        return this.container;
    }
}