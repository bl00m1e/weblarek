import { IBuyer, TPayment, TBuyerErrors } from '../../types';
import { IEvents } from '../base/Events';

export class Buyer {
    private data: IBuyer = {
        payment: null,
        email: '',
        phone: '',
        address: ''
    };
    private errors: TBuyerErrors = {};

    constructor(private events: IEvents) {}

    private emitChanges() {
        this.events.emit('buyer:changed', this.getData());
    }

    setField(field: keyof IBuyer, value: string | TPayment | null): void {
        (this.data[field] as any) = value;
        this.validate();
        this.emitChanges();
        this.events.emit(`buyer:field:${field}`, { [field]: value });
    }

    getData(): IBuyer {
        return { ...this.data };
    }

    validate(): boolean {
        const errors: TBuyerErrors = {};
        
        if (!this.data.payment) errors.payment = 'Не выбран способ оплаты';
        if (!this.data.address.trim()) errors.address = 'Необходимо указать адрес';
        if (!this.data.email.trim()) errors.email = 'Укажите email';
        if (!this.data.phone.trim()) errors.phone = 'Укажите телефон';
        
        this.errors = errors;
        this.events.emit('buyer:errors', this.errors);
        
        return Object.keys(errors).length === 0;
    }

    clear(): void {
        this.data = { payment: null, email: '', phone: '', address: '' };
        this.errors = {};
        this.emitChanges();
        this.events.emit('buyer:errors', this.errors);
    }
}