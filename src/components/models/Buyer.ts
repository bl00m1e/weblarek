import { IBuyer, TPayment } from '../../types/index';

export class Buyer {
  private payment: TPayment | null = null;
  private email: string = '';
  private phone: string = '';
  private address: string = '';

  set(field: keyof IBuyer, value: string | TPayment | null): void {
    if (field in this) {
      (this as Record<string, unknown>)[field] = value;
    }
  }

  get(): IBuyer {
    return {
      payment: this.payment as TPayment,
      email: this.email,
      phone: this.phone,
      address: this.address,
    };
  }

  clear(): void {
    this.payment = null;
    this.email = '';
    this.phone = '';
    this.address = '';
  }

  validate(): Record<string, string> {
    const errors: Record<string, string> = {};

    if (!this.payment) {
      errors.payment = 'Не выбран вид оплаты';
    }
    if (!this.address.trim()) {
      errors.address = 'Укажите адрес доставки';
    }
    if (!this.email.trim()) {
      errors.email = 'Укажите email';
    }
    if (!this.phone.trim()) {
      errors.phone = 'Укажите телефон';
    }

    return errors;
  }

  // Валидация отдельного поля
  isValid(field: keyof IBuyer): boolean {
    const value = this[field];
    if (field === 'payment') {
      return value !== null;
    }
    return typeof value === 'string' && value.trim() !== '';
  }
}