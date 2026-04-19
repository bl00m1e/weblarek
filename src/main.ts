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
import { cloneTemplate, ensureElement } from './utils/utils';

// ===== ИНИЦИАЛИЗАЦИЯ =====
const events = new EventEmitter();
const api = new LarekAPI(API_URL);

// Модели данных
const productsModel = new Products(events);
const cartModel = new Cart(events);
const buyerModel = new Buyer(events);

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

// Превью создается однократно
const preview = new CardPreview(
    cloneTemplate(cardPreviewTemplate),
    () => events.emit('card:preview-toggle')
);

// Формы создаются однократно
const orderForm = new OrderForm(
    cloneTemplate(orderTemplate),
    () => events.emit('order:submit'),
    (method: TPayment) => {
        buyerModel.setField('payment', method);
    },
    (value: string) => {
        buyerModel.setField('address', value);
    }
);

const contactsForm = new ContactsForm(
    cloneTemplate(contactsTemplate),
    () => events.emit('contacts:submit'),
    (value: string) => {
        buyerModel.setField('email', value);
    },
    (value: string) => {
        buyerModel.setField('phone', value);
    }
);

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
    preview.updateButtonState(inCart);
    modal.render(preview.render({ ...product, inCart }));
});

// 4. Переключение товара в корзине (из превью)
events.on('card:preview-toggle', () => {
    const product = productsModel.getPreview();
    if (product && product.price !== null) {
        if (cartModel.isInCart(product.id)) {
            cartModel.removeProduct(product.id);
        } else {
            cartModel.addProduct(product);
        }
    }
});

// 5. Изменение корзины
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
    
    // Обновляем состояние кнопки в превью
    const previewProduct = productsModel.getPreview();
    if (previewProduct) {
        const inCart = cartModel.isInCart(previewProduct.id);
        preview.updateButtonState(inCart);
    }
});

// 6. Удаление товара из корзины
events.on('card:remove', ({ id }: { id: string }) => {
    cartModel.removeProduct(id);
});

// 7. Открытие корзины
events.on('basket:open', () => {
    modal.render(basket.render());
});

// 8. Открытие формы заказа
events.on('order:open', () => {
    const buyerData = buyerModel.getData();
    orderForm.render({
        payment: buyerData.payment || undefined,
        address: buyerData.address,
        valid: false,
        errors: ''
    });
    modal.render(orderForm.render());
});

// 9. Изменение данных покупателя
events.on('buyer:changed', (data: IBuyer) => {
    orderForm.payment = data.payment;
});

// 10. Ошибки валидации
events.on('buyer:errors', (errors: Record<string, string>) => {
    
    // Для формы заказа
    const orderErrors = ['payment', 'address']
        .map(field => errors[field])
        .filter(Boolean)
        .join('. ');
    
    orderForm.valid = orderErrors.length === 0;
    orderForm.errors = orderErrors;
    
    // Для формы контактов
    const contactsErrors = ['email', 'phone']
        .map(field => errors[field])
        .filter(Boolean)
        .join('. ');
    
    contactsForm.valid = contactsErrors.length === 0;
    contactsForm.errors = contactsErrors;
});

// 11. Сабмит формы заказа (переход к контактам)
events.on('order:submit', () => {
    const buyerData = buyerModel.getData();
    
    contactsForm.render({
        email: buyerData.email,
        phone: buyerData.phone,
        valid: false,
        errors: ''
    });
    
    modal.render(contactsForm.render());
});

// 12. Сабмит контактов (оформление заказа)
events.on('contacts:submit', () => {
    const buyerData = buyerModel.getData();
    
    const order: IOrderRequest = {
        payment: buyerData.payment!,
        email: buyerData.email,
        phone: buyerData.phone,
        address: buyerData.address,
        total: cartModel.getTotal(),
        items: cartModel.getItems().map(item => item.id)
    };
    
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
            contactsForm.errors = 'Произошла ошибка при оформлении заказа. Попробуйте еще раз.';
        });
});

// 13. Закрытие модального окна
events.on('modal:close', () => {
    modal.close();
});

console.log('✅ Приложение Web-ларёк запущено!');