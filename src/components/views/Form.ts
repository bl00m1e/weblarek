import { Component } from '../base/Component';

export abstract class Form<T> extends Component<T> {
    protected submitButton: HTMLButtonElement;
    protected errorsElement: HTMLElement;

    constructor(container: HTMLElement, protected onSubmit: () => void) {
        super(container);
        this.submitButton = this.container.querySelector('button[type=submit]')!;
        this.errorsElement = this.container.querySelector('.form__errors')!;
        
        this.container.addEventListener('submit', (e) => {
            e.preventDefault();
            this.onSubmit();
        });
    }

    protected abstract getFormData(): Partial<T>;

    set valid(value: boolean) {
        this.setDisabled(this.submitButton, !value);
    }

    set errors(value: string) {
        this.setText(this.errorsElement, value);
    }

    render(data?: Partial<T> & { valid?: boolean; errors?: string }): HTMLElement {
        if (data) {
            const { valid, errors, ...formData } = data;
            super.render(formData as Partial<T>);
            if (valid !== undefined) this.valid = valid;
            if (errors !== undefined) this.errors = errors;
        }
        return this.container;
    }
}