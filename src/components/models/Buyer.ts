// src/components/models/Buyer.ts

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

    setField(field: keyof IBuyer, value: string | TPayment | null): void {
        const oldValue = this.data[field];
        (this.data[field] as any) = value;
        
        this.validateField(field);
        
        if (oldValue !== value) {
            this.events.emit('buyer:changed', this.getData());
        }
        
        if (field === 'payment') {
            this.events.emit(`buyer:field:${field}`, { [field]: value });
        }
    }

    private validateField(field: keyof IBuyer): void {
        const value = this.data[field];
        
        switch (field) {
            case 'payment':
                if (!value) this.errors.payment = 'Не выбран способ оплаты';
                else delete this.errors.payment;
                break;
            case 'address':
                if (typeof value === 'string' && !value.trim()) 
                    this.errors.address = 'Необходимо указать адрес';
                else delete this.errors.address;
                break;
            case 'email':
                if (typeof value === 'string' && !value.trim()) 
                    this.errors.email = 'Укажите email';
                else delete this.errors.email;
                break;
            case 'phone':
                if (typeof value === 'string' && !value.trim()) 
                    this.errors.phone = 'Укажите телефон';
                else delete this.errors.phone;
                break;
        }
    }

    getData(): IBuyer {
        return { ...this.data };
    }

    // Полная валидация
    validate(): boolean {
        this.errors = {};
        
        if (!this.data.payment) this.errors.payment = 'Не выбран способ оплаты';
        if (!this.data.address.trim()) this.errors.address = 'Необходимо указать адрес';
        if (!this.data.email.trim()) this.errors.email = 'Укажите email';
        if (!this.data.phone.trim()) this.errors.phone = 'Укажите телефон';
        
        this.events.emit('buyer:errors', this.errors);
        
        return Object.keys(this.errors).length === 0;
    }

    // Валидация только для первого шага (оплата и адрес)
    validateOrderStep(): boolean {
        const orderErrors: TBuyerErrors = {};
        
        if (!this.data.payment) orderErrors.payment = 'Не выбран способ оплаты';
        if (!this.data.address.trim()) orderErrors.address = 'Необходимо указать адрес';
        
        // Обновляем только ошибки первого шага
        this.errors = { ...this.errors, ...orderErrors };
        
        // Эмитим только ошибки первого шага
        this.events.emit('buyer:errors:order', orderErrors);
        
        return Object.keys(orderErrors).length === 0;
    }

    // Валидация только для второго шага (email и телефон)
    validateContactsStep(): boolean {
        const contactsErrors: TBuyerErrors = {};
        
        if (!this.data.email.trim()) contactsErrors.email = 'Укажите email';
        if (!this.data.phone.trim()) contactsErrors.phone = 'Укажите телефон';
        
        // Обновляем только ошибки второго шага
        this.errors = { ...this.errors, ...contactsErrors };
        
        // Эмитим только ошибки второго шага
        this.events.emit('buyer:errors:contacts', contactsErrors);
        
        return Object.keys(contactsErrors).length === 0;
    }

    clear(): void {
        this.data = { payment: null, email: '', phone: '', address: '' };
        this.errors = {};
        this.events.emit('buyer:changed', this.getData());
        this.events.emit('buyer:errors', this.errors);
    }
}