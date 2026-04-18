import './scss/styles.scss';
import { API_URL, CDN_URL } from './utils/constants';
import { EventEmitter } from './components/base/Events';
import { LarekAPI } from './components/api/LarekAPI';
import { Products } from './components/models/Products';
import { Cart } from './components/models/Cart';
import { Buyer } from './components/models/Buyer';
import { Modal } from './components/views/Modal';
import { Header } from './components/views/Header';
import { Gallery } from './components/views/Gallery';
import { CardCatalog } from './components/views/CardCatalog';
import { CardPreview } from './components/views/CardPreview';
import { CardBasket } from './components/views/CardBasket';
import { Basket } from './components/views/Basket';
import { OrderForm } from './components/views/OrderForm';
import { ContactsForm } from './components/views/ContactsForm';
import { Success } from './components/views/Success';
import { IProduct, IOrderRequest, TPayment, IBuyer } from './types';
import { cloneTemplate, ensureElement, debounce } from './utils/utils';

// ===== ИНИЦИАЛИЗАЦИЯ =====
const events = new EventEmitter();
const api = new LarekAPI(API_URL);

// Модели данных
const productsModel = new Products(events);
const cartModel = new Cart(events);
const buyerModel = new Buyer(events);

// Отложенная валидация
const debouncedValidate = debounce(() => {
    buyerModel.validate();
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
const galleryElement = ensureElement<HTMLElement>('.gallery');
const headerElement = ensureElement<HTMLElement>('.header');

// Глобальные компоненты (создаются однократно)
const modal = new Modal(modalContainer, () => events.emit('modal:close'));
const basket = new Basket(cloneTemplate(basketTemplate), () => events.emit('order:open'));
const header = new Header(headerElement, () => events.emit('basket:open'));
const galleryView = new Gallery(galleryElement);

// Формы создаются однократно
const orderForm = new OrderForm(
    cloneTemplate(orderTemplate),
    () => events.emit('order:submit'),
    (method: TPayment) => {
        buyerModel.setField('payment', method);
        debouncedValidate();
    }
);

const contactsForm = new ContactsForm(
    cloneTemplate(contactsTemplate),
    () => events.emit('contacts:submit')
);

// Настройка обработчиков для форм
const addressInput = orderForm.element.querySelector('input[name="address"]') as HTMLInputElement;
addressInput?.addEventListener('input', (e) => {
    const target = e.target as HTMLInputElement;
    buyerModel.setField('address', target.value);
    debouncedValidate();
});

const emailInput = contactsForm.element.querySelector('input[name="email"]') as HTMLInputElement;
emailInput?.addEventListener('input', (e) => {
    const target = e.target as HTMLInputElement;
    buyerModel.setField('email', target.value);
    debouncedValidate();
});

const phoneInput = contactsForm.element.querySelector('input[name="phone"]') as HTMLInputElement;
phoneInput?.addEventListener('input', (e) => {
    const target = e.target as HTMLInputElement;
    buyerModel.setField('phone', target.value);
    debouncedValidate();
});

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
        galleryView.showError('Ошибка загрузки товаров');
    });

// ===== ОБРАБОТЧИКИ СОБЫТИЙ =====

// 1. Изменение каталога товаров
events.on('products:changed', (items: IProduct[]) => {
    const cards = items.map(product => {
        const card = new CardCatalog(
            cloneTemplate(cardCatalogTemplate),
            () => events.emit('card:select', { id: product.id })
        );
        return card.render(product);
    });
    galleryView.render({ items: cards });
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
    
    if (currentPreview) {
        currentPreview.updateButtonState(inCart);
    } else {
        currentPreview = new CardPreview(
            cloneTemplate(cardPreviewTemplate),
            () => {
                const previewProduct = productsModel.getPreview();
                if (previewProduct && previewProduct.price !== null) {
                    if (cartModel.isInCart(previewProduct.id)) {
                        events.emit('card:remove', { id: previewProduct.id });
                    } else {
                        events.emit('card:add', { id: previewProduct.id });
                    }
                }
            }
        );
        
        modal.render(currentPreview.render({ ...product, inCart }));
    }
});

// 4. Добавление товара в корзину
events.on('card:add', ({ id }: { id: string }) => {
    const product = productsModel.getProductById(id);
    if (product && product.price !== null) {
        cartModel.addProduct(product);
    }
});

// 5. Удаление товара из корзины
events.on('card:remove', ({ id }: { id: string }) => {
    cartModel.removeProduct(id);
});

// 6. Изменение корзины
events.on('cart:changed', ({ items, total }: { items: IProduct[], total: number }) => {
    header.render({ counter: items.length });
    
    const cardElements = items.map((item, index) => {
        const card = new CardBasket(
            cloneTemplate(cardBasketTemplate),
            () => events.emit('card:remove', { id: item.id })
        );
        return card.render({ ...item, index: index + 1 });
    });
    
    basket.render({ items: cardElements, total });
    
    if (currentPreview) {
        const previewProduct = productsModel.getPreview();
        if (previewProduct) {
            const inCart = cartModel.isInCart(previewProduct.id);
            currentPreview.updateButtonState(inCart);
        }
    }
});

// 7. Открытие корзины
events.on('basket:open', () => {
    modal.render(basket.render());
});

// 8. Открытие формы заказа
events.on('order:open', () => {
    if (cartModel.getCount() === 0) return;
    
    currentOrderForm = orderForm;
    
    const buyerData = buyerModel.getData();
    currentOrderForm.render({
        payment: buyerData.payment || undefined,
        address: buyerData.address,
        valid: false,
        errors: ''
    });
    
    modal.render(currentOrderForm.render());
});

// 9. Изменение данных покупателя
events.on('buyer:changed', (data: IBuyer) => {
    if (currentOrderForm) {
        currentOrderForm.payment = data.payment;
    }
});

// 10. Ошибки валидации
events.on('buyer:errors', (errors: Record<string, string>) => {
    
    if (currentOrderForm) {
        const orderErrors: string[] = [];
        if (errors.payment) orderErrors.push(errors.payment);
        if (errors.address) orderErrors.push(errors.address);
        
        const errorText = orderErrors.join('. ');
        const isValid = orderErrors.length === 0;
        
        currentOrderForm.valid = isValid;
        currentOrderForm.errors = errorText;
    }
    
    if (currentContactsForm) {
        const contactsErrors: string[] = [];
        if (errors.email) contactsErrors.push(errors.email);
        if (errors.phone) contactsErrors.push(errors.phone);
        
        const errorText = contactsErrors.join('. ');
        const isValid = contactsErrors.length === 0;
        
        currentContactsForm.valid = isValid;
        currentContactsForm.errors = errorText;
    }
});

// 11. Сабмит формы заказа (переход к контактам)
events.on('order:submit', () => {
    const buyerData = buyerModel.getData();
    
    if (!buyerData.payment || !buyerData.address.trim()) {
        buyerModel.validate();
        return;
    }
    
    currentContactsForm = contactsForm;
    
    const data = buyerModel.getData();
    currentContactsForm.render({
        email: data.email,
        phone: data.phone,
        valid: false,
        errors: ''
    });
    
    modal.render(currentContactsForm.render());
});

// 12. Сабмит контактов (оформление заказа)
events.on('contacts:submit', () => {
    const buyerData = buyerModel.getData();
    
    if (!buyerData.email.trim() || !buyerData.phone.trim()) {
        buyerModel.validate();
        return;
    }
    
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
    
    const submitButton = contactsForm.element.querySelector('button[type=submit]') as HTMLButtonElement;
    if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = 'Отправка...';
    }
    
    api.createOrder(order)
        .then(response => {
            cartModel.clear();
            buyerModel.clear();
            
            const success = new Success(cloneTemplate(successTemplate), () => {
                modal.close();
            });
            
            modal.render(success.render({ total: response.total }));
        })
        .catch(err => {
            console.error('Ошибка оформления заказа:', err);
            
            if (currentContactsForm) {
                currentContactsForm.errors = 'Произошла ошибка при оформлении заказа. Попробуйте еще раз.';
                
                if (submitButton) {
                    submitButton.disabled = false;
                    submitButton.textContent = 'Оплатить';
                }
            }
        });
});

// 13. Закрытие модального окна
events.on('modal:close', () => {
    modal.close();
    currentOrderForm = null;
    currentContactsForm = null;
    currentPreview = null;
});

console.log('✅ Приложение Web-ларёк запущено!');