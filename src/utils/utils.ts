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

export function debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
): (...args: Parameters<T>) => void {
    let timeout: ReturnType<typeof setTimeout> | null = null;
    
    return (...args: Parameters<T>) => {
        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
}