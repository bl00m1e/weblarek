import { Form } from './Form';
import { debounce } from '../../utils/utils';

export interface IContactsFormState {
    email?: string;
    phone?: string;
    valid?: boolean;
    errors?: string;
}

export class ContactsForm extends Form<IContactsFormState> {
    protected emailInput: HTMLInputElement;
    protected phoneInput: HTMLInputElement;

    constructor(
        container: HTMLElement,
        onSubmit: () => void,
        onEmailChange: (value: string) => void,
        onPhoneChange: (value: string) => void
    ) {
        super(container, onSubmit);
        
        this.emailInput = this.container.querySelector('input[name=email]')!;
        this.phoneInput = this.container.querySelector('input[name=phone]')!;
        
        // Обработчики ввода внутри представления
        const debouncedEmailChange = debounce((value: string) => {
            onEmailChange(value);
        }, 400);
        
        const debouncedPhoneChange = debounce((value: string) => {
            onPhoneChange(value);
        }, 400);
        
        this.emailInput.addEventListener('input', (e) => {
            const target = e.target as HTMLInputElement;
            debouncedEmailChange(target.value);
        });
        
        this.phoneInput.addEventListener('input', (e) => {
            const target = e.target as HTMLInputElement;
            debouncedPhoneChange(target.value);
        });
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