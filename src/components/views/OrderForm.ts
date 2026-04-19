import { Form } from './Form';
import { TPayment } from '../../types';
import { debounce } from '../../utils/utils';

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

    constructor(
        container: HTMLElement,
        onSubmit: () => void,
        onPaymentChange: (method: TPayment) => void,
        onAddressChange: (value: string) => void
    ) {
        super(container, onSubmit);
        
        this.cardButton = this.container.querySelector('button[name=card]')!;
        this.cashButton = this.container.querySelector('button[name=cash]')!;
        this.addressInput = this.container.querySelector('input[name=address]')!;
        
        this.cardButton.addEventListener('click', () => onPaymentChange('card'));
        this.cashButton.addEventListener('click', () => onPaymentChange('cash'));
        
        const debouncedAddressChange = debounce((value: string) => {
            onAddressChange(value);
        }, 400);
        
        this.addressInput.addEventListener('input', (e) => {
            const target = e.target as HTMLInputElement;
            debouncedAddressChange(target.value);
        });
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

    protected getFormData(): Partial<IOrderFormState> {
        return {
            address: this.addressInput?.value || ''
        };
    }
}