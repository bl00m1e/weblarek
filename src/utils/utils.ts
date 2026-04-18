// src/utils/utils.ts
export function cloneTemplate<T extends HTMLElement>(template: HTMLTemplateElement): T {
    if (!template.content.firstElementChild) {
        throw new Error('Template has no content');
    }
    return template.content.firstElementChild.cloneNode(true) as T;
}

export function ensureElement<T extends HTMLElement>(selector: string): T {
    const element = document.querySelector<T>(selector);
    if (!element) throw new Error(`Element ${selector} not found`);
    return element;
}