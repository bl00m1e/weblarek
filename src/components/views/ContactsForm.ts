// src/components/views/ContactsForm.ts

import { Form } from './Form';

export interface IContactsFormState {
    email?: string;
    phone?: string;
    valid?: boolean;
    errors?: string;
}

export class ContactsForm extends Form<IContactsFormState> {
    protected emailInput: HTMLInputElement;
    protected phoneInput: HTMLInputElement;

    constructor(container: HTMLElement, onSubmit: (data: Partial<IContactsFormState>) => void) {
        super(container, onSubmit);
        
        this.emailInput = this.container.querySelector('input[name=email]')!;
        this.phoneInput = this.container.querySelector('input[name=phone]')!;
    }

    set email(value: string) {
        // Обновляем значение только если оно отличается и поле не в фокусе
        if (this.emailInput && this.emailInput.value !== value) {
            if (document.activeElement !== this.emailInput) {
                this.emailInput.value = value;
            }
        }
    }

    set phone(value: string) {
        // Обновляем значение только если оно отличается и поле не в фокусе
        if (this.phoneInput && this.phoneInput.value !== value) {
            if (document.activeElement !== this.phoneInput) {
                this.phoneInput.value = value;
            }
        }
    }

    // Геттеры для получения текущих значений
    get email(): string {
        return this.emailInput?.value || '';
    }

    get phone(): string {
        return this.phoneInput?.value || '';
    }

    protected onInputChange(_field: keyof IContactsFormState, _value: string) {
        // Обработка в main.ts
    }

    protected getFormData(): Partial<IContactsFormState> {
        return {
            email: this.emailInput?.value || '',
            phone: this.phoneInput?.value || ''
        };
    }
}