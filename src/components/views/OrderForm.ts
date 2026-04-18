// src/components/views/OrderForm.ts - расширенная версия

import { Form } from './Form';
import { TPayment } from '../../types';

export interface IOrderFormState {
    payment?: TPayment;
    address?: string;
    valid?: boolean;
    errors?: string;
}

export class OrderForm extends Form<IOrderFormState> {
    protected cardButton: HTMLButtonElement;
    protected cashButton: HTMLButtonElement;
    protected addressInput: HTMLInputElement;
    protected addressErrorElement: HTMLElement; // Добавляем элемент для ошибки адреса

    constructor(
        container: HTMLElement,
        onSubmit: (data: Partial<IOrderFormState>) => void,
        private onPaymentChange: (method: TPayment) => void
    ) {
        super(container, onSubmit);
        
        this.cardButton = this.container.querySelector('button[name=card]')!;
        this.cashButton = this.container.querySelector('button[name=cash]')!;
        this.addressInput = this.container.querySelector('input[name=address]')!;
        
        // Создаем или находим элемент для ошибки адреса
        this.addressErrorElement = this.container.querySelector('.address-error') || 
            this.createAddressErrorElement();
        
        this.cardButton.addEventListener('click', () => {
            this.onPaymentChange('card');
        });
        
        this.cashButton.addEventListener('click', () => {
            this.onPaymentChange('cash');
        });
    }

    private createAddressErrorElement(): HTMLElement {
        const errorEl = document.createElement('span');
        errorEl.className = 'address-error form__field-error';
        errorEl.style.color = '#F18B7E';
        errorEl.style.fontSize = '0.9rem';
        errorEl.style.marginTop = '0.5rem';
        errorEl.style.display = 'none';
        
        const field = this.addressInput.closest('.order__field');
        if (field) {
            field.appendChild(errorEl);
        }
        
        return errorEl;
    }

    set payment(value: TPayment | null) {
        this.toggleClass(this.cardButton, 'button_alt-active', value === 'card');
        this.toggleClass(this.cashButton, 'button_alt-active', value === 'cash');
    }

    set address(value: string) {
        if (this.addressInput && this.addressInput.value !== value) {
            if (document.activeElement !== this.addressInput) {
                this.addressInput.value = value;
            }
        }
    }

    // Метод для отображения ошибки адреса отдельно
    public setAddressError(error: string | null) {
        if (error) {
            this.setText(this.addressErrorElement, error);
            this.addressErrorElement.style.display = 'block';
            this.addressInput.style.borderColor = '#F18B7E';
        } else {
            this.addressErrorElement.style.display = 'none';
            this.addressInput.style.borderColor = '';
        }
    }

    get address(): string {
        return this.addressInput?.value || '';
    }

    protected onInputChange(_field: keyof IOrderFormState, _value: string) {
        // Обработка в main.ts
    }

    protected getFormData(): Partial<IOrderFormState> {
        return {
            address: this.addressInput?.value || ''
        };
    }
}