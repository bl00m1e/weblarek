// src/components/views/Form.ts

import { Component } from '../base/Component';

export abstract class Form<T> extends Component<T> {
    protected submitButton: HTMLButtonElement;
    protected errorsElement: HTMLElement;

    constructor(container: HTMLElement, protected onSubmit: (data: Partial<T>) => void) {
        super(container);
        this.submitButton = this.container.querySelector('button[type=submit]')!;
        this.errorsElement = this.container.querySelector('.form__errors')!;
        
        this.container.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = this.getFormData();
            this.onSubmit(formData);
        });
        
        // Убираем автоматическую обработку input, будем делать это в main.ts
    }

    protected abstract onInputChange(field: keyof T, value: string): void;
    protected abstract getFormData(): Partial<T>;

    set valid(value: boolean) {
        this.setDisabled(this.submitButton, !value);
    }

    set errors(value: string) {
        this.setText(this.errorsElement, value);
        if (value) {
            this.errorsElement.style.display = 'block';
        } else {
            this.errorsElement.style.display = 'none';
        }
    }

    // Переопределяем render, чтобы не перезаписывать значения полей
    render(state: Partial<T> & { valid?: boolean; errors?: string }): HTMLElement {
        const { valid, errors, ...data } = state;
        
        // Вызываем родительский render, но он присвоит только те данные, которые есть в data
        // Не перезаписываем значения полей, если они уже есть
        if (Object.keys(data).length > 0) {
            super.render(data as Partial<T>);
        }
        
        if (valid !== undefined) this.valid = valid;
        if (errors !== undefined) this.errors = errors;
        
        return this.container;
    }
}