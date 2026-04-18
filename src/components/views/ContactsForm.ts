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
        if (this.emailInput && this.emailInput.value !== value) {
            if (document.activeElement !== this.emailInput) {
                this.emailInput.value = value;
            }
        }
    }

    set phone(value: string) {
        if (this.phoneInput && this.phoneInput.value !== value) {
            if (document.activeElement !== this.phoneInput) {
                this.phoneInput.value = value;
            }
        }
    }

    protected getFormData(): Partial<IContactsFormState> {
        return {
            email: this.emailInput?.value || '',
            phone: this.phoneInput?.value || ''
        };
    }
}