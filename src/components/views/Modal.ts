// src/components/views/Modal.ts

import { Component } from '../base/Component';

export class Modal extends Component<object> {
    protected closeButton: HTMLButtonElement;
    protected contentElement: HTMLElement;
    protected containerElement: HTMLElement;
    protected onClose: () => void; // ИСПРАВЛЕНИЕ: добавил поле

    constructor(container: HTMLElement, onClose: () => void) {
        super(container);
        this.onClose = onClose; // ИСПРАВЛЕНИЕ: сохраняем колбэк
        
        this.closeButton = this.container.querySelector('.modal__close')!;
        this.contentElement = this.container.querySelector('.modal__content')!;
        this.containerElement = this.container.querySelector('.modal__container')!;
        
        this.closeButton.addEventListener('click', () => this.onClose());
        
        // ИСПРАВЛЕНИЕ: закрытие по клику на оверлей
        this.container.addEventListener('click', (e: MouseEvent) => {
            if (e.target === this.container) this.onClose();
        });
        
        // ИСПРАВЛЕНИЕ: предотвращение закрытия при клике на контент
        this.containerElement.addEventListener('click', (e: MouseEvent) => {
            e.stopPropagation();
        });
    }

    open(content: HTMLElement) {
        this.contentElement.replaceChildren(content);
        this.toggleClass(this.container, 'modal_active', true);
        
        // ИСПРАВЛЕНИЕ: блокируем скролл body
        document.body.style.overflow = 'hidden';
    }

    close() {
        this.toggleClass(this.container, 'modal_active', false);
        this.contentElement.replaceChildren();
        
        // ИСПРАВЛЕНИЕ: восстанавливаем скролл body
        document.body.style.overflow = '';
    }

    render(content: HTMLElement): HTMLElement {
        this.open(content);
        return this.container;
    }
}