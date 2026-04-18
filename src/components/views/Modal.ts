import { Component } from '../base/Component';

export class Modal extends Component<object> {
    protected closeButton: HTMLButtonElement;
    protected contentElement: HTMLElement;
    protected containerElement: HTMLElement;
    protected onClose: () => void;

    constructor(container: HTMLElement, onClose: () => void) {
        super(container);
        this.onClose = onClose;
        
        this.closeButton = this.container.querySelector('.modal__close')!;
        this.contentElement = this.container.querySelector('.modal__content')!;
        this.containerElement = this.container.querySelector('.modal__container')!;
        
        this.closeButton.addEventListener('click', () => this.onClose());
        
        this.container.addEventListener('click', (e: MouseEvent) => {
            if (e.target === this.container) this.onClose();
        });
        
        this.containerElement.addEventListener('click', (e: MouseEvent) => {
            e.stopPropagation();
        });
        
        // Обработчик ESC
        document.addEventListener('keydown', (e: KeyboardEvent) => {
            if (e.key === 'Escape' && this.container.classList.contains('modal_active')) {
                this.onClose();
            }
        });
    }

    open(content: HTMLElement) {
        this.contentElement.replaceChildren(content);
        this.toggleClass(this.container, 'modal_active', true);
        document.body.style.overflow = 'hidden';
    }

    close() {
        this.toggleClass(this.container, 'modal_active', false);
        this.contentElement.replaceChildren();
        document.body.style.overflow = '';
    }

    render(content?: HTMLElement): HTMLElement {
        if (content) {
            this.open(content);
        }
        return this.container;
    }
}