// src/components/base/Component.ts
export abstract class Component<T> {
    protected constructor(protected readonly container: HTMLElement) {}

    // Публичный геттер для доступа к корневому элементу
    public get element(): HTMLElement {
        return this.container;
    }

    // Переключение класса
    protected toggleClass(element: HTMLElement, className: string, force?: boolean) {
        element.classList.toggle(className, force);
    }

    // Установка текстового содержимого
    protected setText(element: HTMLElement, value: unknown) {
        if (element) {
            element.textContent = String(value);
        }
    }

    // Установка изображения с альтернативным текстом
    protected setImage(element: HTMLImageElement, src: string, alt?: string) {
        if (element) {
            element.src = src;
            if (alt) {
                element.alt = alt;
            }
        }
    }

    // Сменить статус блокировки
    protected setDisabled(element: HTMLElement, state: boolean) {
        if (element) {
            if (state) element.setAttribute('disabled', 'disabled');
            else element.removeAttribute('disabled');
        }
    }

    // Скрыть элемент
    protected setHidden(element: HTMLElement) {
        element.style.display = 'none';
    }

    // Показать элемент
    protected setVisible(element: HTMLElement) {
        element.style.removeProperty('display');
    }

    // Вернуть корневой DOM-элемент
    render(data?: Partial<T>): HTMLElement {
        Object.assign(this as object, data ?? {});
        return this.container;
    }
}