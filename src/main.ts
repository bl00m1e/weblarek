// src/main.ts

import './scss/styles.scss';
import { API_URL, CDN_URL } from './utils/constants';
import { EventEmitter } from './components/base/Events';
import { LarekAPI } from './components/api/LarekAPI';
import { Products } from './components/models/Products';
import { Cart } from './components/models/Cart';
import { Buyer } from './components/models/Buyer';
import { Modal } from './components/views/Modal';
import { CardCatalog } from './components/views/CardCatalog';
import { CardPreview } from './components/views/CardPreview';
import { CardBasket } from './components/views/CardBasket';
import { Basket } from './components/views/Basket';
import { OrderForm } from './components/views/OrderForm';
import { ContactsForm } from './components/views/ContactsForm';
import { Success } from './components/views/Success';
import { IProduct, IOrderRequest, TPayment, IBuyer } from './types';
import { cloneTemplate, ensureElement } from './utils/utils';

// ===== УТИЛИТЫ =====
function debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
): (...args: Parameters<T>) => void {
    let timeout: ReturnType<typeof setTimeout> | null = null;
    
    return (...args: Parameters<T>) => {
        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
}

// ===== ИНИЦИАЛИЗАЦИЯ =====
const events = new EventEmitter();
const api = new LarekAPI(API_URL);

// Модели данных
const productsModel = new Products(events);
const cartModel = new Cart(events);
const buyerModel = new Buyer(events);

// Создаем отложенную валидацию для разных шагов
const debouncedValidateOrder = debounce(() => {
    buyerModel.validateOrderStep();
}, 400);

const debouncedValidateContacts = debounce(() => {
    buyerModel.validateContactsStep();
}, 400);

// Шаблоны
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

// Контейнеры
const modalContainer = ensureElement<HTMLElement>('#modal-container');
const gallery = ensureElement<HTMLElement>('.gallery');
const basketButton = ensureElement<HTMLElement>('.header__basket');
const basketCounter = ensureElement<HTMLElement>('.header__basket-counter');

// Глобальные компоненты
const modal = new Modal(modalContainer, () => events.emit('modal:close'));
const basket = new Basket(cloneTemplate(basketTemplate), () => events.emit('order:open'));

// Переменные для хранения текущих компонентов
let currentOrderForm: OrderForm | null = null;
let currentContactsForm: ContactsForm | null = null;
let currentPreview: CardPreview | null = null;

// ===== ЗАГРУЗКА ДАННЫХ =====
api.getProducts()
    .then(data => {
        const products = data.items.map(item => ({
            ...item,
            image: CDN_URL + item.image
        }));
        productsModel.setItems(products);
    })
    .catch(err => {
        console.error('Ошибка загрузки товаров:', err);
        gallery.innerHTML = '<p style="color: white; text-align: center; width: 100%;">Ошибка загрузки товаров</p>';
    });

// ===== ОБРАБОТЧИКИ СОБЫТИЙ =====

// 1. Изменение каталога товаров
events.on('products:changed', (items: IProduct[]) => {
    const cards = items.map(product => {
        const card = new CardCatalog(
            cloneTemplate(cardCatalogTemplate),
            (id) => events.emit('card:select', { id })
        );
        return card.render(product);
    });
    gallery.replaceChildren(...cards);
});

// 2. Выбор карточки для просмотра
events.on('card:select', ({ id }: { id: string }) => {
    const product = productsModel.getProductById(id);
    if (product) {
        productsModel.setPreview(product);
    }
});

// 3. Изменение превью товара
events.on('preview:changed', (product: IProduct) => {
    const inCart = cartModel.isInCart(product.id);
    
    if (currentPreview && currentPreview.id === product.id) {
        // Если это тот же товар, просто обновляем состояние кнопки
        currentPreview.updateCartState(inCart);
    } else {
        // Создаем новое превью
        currentPreview = new CardPreview(
            cloneTemplate(cardPreviewTemplate),
            (id) => events.emit('card:add', { id }),
            (id) => events.emit('card:remove', { id })
        );
        
        modal.render(currentPreview.render({ ...product, inCart }));
    }
});

// 4. Добавление товара в корзину
events.on('card:add', ({ id }: { id: string }) => {
    const product = productsModel.getProductById(id);
    if (product && product.price !== null) {
        cartModel.addProduct(product);
        
        // Обновляем состояние кнопки в текущем превью
        if (currentPreview && currentPreview.id === id) {
            currentPreview.updateCartState(true);
        }
    }
});

// 5. Удаление товара из корзины
events.on('card:remove', ({ id }: { id: string }) => {
    cartModel.removeProduct(id);
    
    // Обновляем состояние кнопки в текущем превью
    if (currentPreview && currentPreview.id === id) {
        currentPreview.updateCartState(false);
    }
});

// 6. Изменение корзины
events.on('cart:changed', ({ items, total }: { items: IProduct[], total: number }) => {
    basketCounter.textContent = String(items.length);
    
    const cardElements = items.map((item, index) => {
        const card = new CardBasket(
            cloneTemplate(cardBasketTemplate),
            (itemId) => events.emit('card:remove', { id: itemId })
        );
        return card.render({ ...item, index: index + 1 });
    });
    
    basket.render({ items: cardElements, total });
    
    // Если модальное окно открыто с корзиной - обновляем его
    const modalContent = modalContainer.querySelector('.modal__content');
    if (modalContent?.querySelector('.basket')) {
        modalContent.replaceChildren(basket.element);
    }
});

// 7. Открытие корзины
events.on('basket:open', () => {
    const items = cartModel.getItems();
    const total = cartModel.getTotal();
    
    const cardElements = items.map((item, index) => {
        const card = new CardBasket(
            cloneTemplate(cardBasketTemplate),
            (id) => events.emit('card:remove', { id })
        );
        return card.render({ ...item, index: index + 1 });
    });
    
    basket.render({ items: cardElements, total });
    modal.render(basket.element);
});

// 8. Открытие формы заказа (первый шаг)
events.on('order:open', () => {
    if (cartModel.getCount() === 0) return;
    
    const formElement = cloneTemplate(orderTemplate);
    currentOrderForm = new OrderForm(
        formElement,
        () => events.emit('order:submit'),
        (method: TPayment) => {
            buyerModel.setField('payment', method);
            debouncedValidateOrder();
        }
    );
    
    const addressInput = formElement.querySelector('input[name="address"]') as HTMLInputElement;
    if (addressInput) {
        addressInput.addEventListener('input', (e) => {
            const target = e.target as HTMLInputElement;
            buyerModel.setField('address', target.value);
            debouncedValidateOrder();
        });
    }
    
    const buyerData = buyerModel.getData();
    currentOrderForm.render({
        payment: buyerData.payment || undefined,
        address: buyerData.address,
        valid: false,
        errors: ''
    });
    
    modal.render(currentOrderForm.element);
});

// 9. Изменение данных покупателя
events.on('buyer:changed', (data: IBuyer) => {
    if (currentOrderForm) {
        currentOrderForm.payment = data.payment;
    }
});

// 10. Ошибки валидации для первого шага (оплата и адрес)
events.on('buyer:errors:order', (errors: Record<string, string>) => {
    if (currentOrderForm) {
        const data = buyerModel.getData();
        const isValid = !!data.payment && data.address.trim().length > 0;
        
        const errorMessages = Object.values(errors);
        const errorText = errorMessages.join('. ');
        
        currentOrderForm.valid = isValid;
        currentOrderForm.errors = errorText;
    }
});

// 11. Ошибки валидации для второго шага (email и телефон)
events.on('buyer:errors:contacts', (errors: Record<string, string>) => {
    if (currentContactsForm) {
        const data = buyerModel.getData();
        const isValid = data.email.trim().length > 0 && data.phone.trim().length > 0;
        
        const errorMessages = Object.values(errors);
        const errorText = errorMessages.join('. ');
        
        currentContactsForm.valid = isValid;
        currentContactsForm.errors = errorText;
    }
});

// 12. Общие ошибки валидации (для отладки)
events.on('buyer:errors', (errors: Record<string, string>) => {
    console.log('All validation errors:', errors);
});

// 13. Сабмит формы заказа (переход к контактам)
events.on('order:submit', () => {
    if (!buyerModel.validateOrderStep()) {
        return;
    }
    
    const formElement = cloneTemplate(contactsTemplate);
    currentContactsForm = new ContactsForm(
        formElement,
        () => events.emit('contacts:submit')
    );
    
    const emailInput = formElement.querySelector('input[name="email"]') as HTMLInputElement;
    const phoneInput = formElement.querySelector('input[name="phone"]') as HTMLInputElement;
    
    if (emailInput) {
        emailInput.addEventListener('input', (e) => {
            const target = e.target as HTMLInputElement;
            buyerModel.setField('email', target.value);
            debouncedValidateContacts();
        });
    }
    
    if (phoneInput) {
        phoneInput.addEventListener('input', (e) => {
            const target = e.target as HTMLInputElement;
            buyerModel.setField('phone', target.value);
            debouncedValidateContacts();
        });
    }
    
    const data = buyerModel.getData();
    currentContactsForm.render({
        email: data.email,
        phone: data.phone,
        valid: false,
        errors: ''
    });
    
    modal.render(currentContactsForm.element);
});

// 14. Сабмит контактов (оформление заказа)
events.on('contacts:submit', () => {
    if (!buyerModel.validateContactsStep()) {
        return;
    }
    
    const buyerData = buyerModel.getData();
    
    if (!buyerData.payment) {
        console.error('Payment method is required');
        return;
    }
    
    const order: IOrderRequest = {
        payment: buyerData.payment,
        email: buyerData.email,
        phone: buyerData.phone,
        address: buyerData.address,
        total: cartModel.getTotal(),
        items: cartModel.getItems().map(item => item.id)
    };
    
    if (currentContactsForm) {
        const submitButton = currentContactsForm.element.querySelector('button[type=submit]') as HTMLButtonElement;
        if (submitButton) {
            submitButton.disabled = true;
            submitButton.textContent = 'Отправка...';
        }
    }
    
    api.createOrder(order)
        .then(response => {
            const successElement = cloneTemplate(successTemplate);
            const success = new Success(successElement, () => {
                modal.close();
                cartModel.clear();
                buyerModel.clear();
                currentOrderForm = null;
                currentContactsForm = null;
                currentPreview = null;
            });
            
            const successRendered = success.render({ total: response.total });
            modal.render(successRendered);
        })
        .catch(err => {
            console.error('Ошибка оформления заказа:', err);
            
            if (currentContactsForm) {
                currentContactsForm.errors = 'Произошла ошибка при оформлении заказа. Попробуйте еще раз.';
                
                const submitButton = currentContactsForm.element.querySelector('button[type=submit]') as HTMLButtonElement;
                if (submitButton) {
                    submitButton.disabled = false;
                    submitButton.textContent = 'Оплатить';
                }
            }
        });
});

// 15. Закрытие модального окна
events.on('modal:close', () => {
    modal.close();
    currentOrderForm = null;
    currentContactsForm = null;
    currentPreview = null;
});

// 16. Обработчик клика по кнопке корзины в хедере
basketButton.addEventListener('click', () => {
    events.emit('basket:open');
});

// 17. Обработка закрытия по ESC
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalContainer.classList.contains('modal_active')) {
        events.emit('modal:close');
    }
});

console.log('✅ Приложение Web-ларёк запущено!');