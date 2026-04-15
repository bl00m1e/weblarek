import './scss/styles.scss';

// Импортируем константы
import { API_URL } from './utils/constants';

// Импортируем модели данных
import { Products } from './components/models/Products';
import { Cart } from './components/models/Cart';
import { Buyer } from './components/models/Buyer';

// Импортируем API
import { Api } from './components/base/Api';
import { LarekAPI } from './components/api/LarekAPI';

// Импортируем тестовые данные
import { apiProducts } from './utils/data';

console.log('=== Тестирование моделей данных ===\n');

// === 1. Тестирование модели Products ===
console.log('📦 КАТАЛОГ ТОВАРОВ:');
const productsModel = new Products();

// Тестируем setItems и getItems
productsModel.setItems(apiProducts.items);
console.log('✅ Массив товаров из каталога:', productsModel.getItems());
console.log('📊 Всего товаров:', productsModel.getItems().length);

// Тестируем getProductById
const firstProduct = apiProducts.items[0];
if (firstProduct) {
  console.log('✅ Товар по ID:', productsModel.getProductById(firstProduct.id));
}

// Тестируем setPreview и getPreview
if (firstProduct) {
  productsModel.setPreview(firstProduct);
  console.log('✅ Товар для превью:', productsModel.getPreview());
}
console.log('');

// === 2. Тестирование модели Cart ===
console.log('🛒 КОРЗИНА:');
const cartModel = new Cart();

// Проверяем пустую корзину
console.log('✅ Пустая корзина:', cartModel.getCartItems());
console.log('📊 Количество товаров:', cartModel.getCartItemsCount());
console.log('💰 Общая стоимость:', cartModel.getCartTotalPrice());

// Тестируем addProductToCart
if (firstProduct) {
  cartModel.addProductToCart(firstProduct);
  console.log('\n✅ После добавления товара:');
  console.log('Товары в корзине:', cartModel.getCartItems());
  console.log('Количество товаров:', cartModel.getCartItemsCount());
  console.log('Общая стоимость:', cartModel.getCartTotalPrice());
  
  // Тестируем isProductInCart
  console.log('✅ Товар есть в корзине:', cartModel.isProductInCart(firstProduct.id));
  
  // Тестируем removeProductFromCart
  cartModel.removeProductFromCart(firstProduct.id);
  console.log('\n✅ После удаления товара:');
  console.log('Товары в корзине:', cartModel.getCartItems());
  console.log('Количество товаров:', cartModel.getCartItemsCount());
  
  // Добавляем несколько товаров для проверки getCartTotalPrice
  const product1 = apiProducts.items[0];
  const product2 = apiProducts.items[1];
  if (product1 && product2) {
    cartModel.addProductToCart(product1);
    cartModel.addProductToCart(product2);
    console.log('\n✅ После добавления двух товаров:');
    console.log('Количество товаров:', cartModel.getCartItemsCount());
    console.log('Общая стоимость:', cartModel.getCartTotalPrice());
    
    // Тестируем clearCart
    cartModel.clearCart();
    console.log('\n✅ После очистки корзины:', cartModel.getCartItems());
  }
}
console.log('');

// === 3. Тестирование модели Buyer ===
console.log('👤 ДАННЫЕ ПОКУПАТЕЛЯ:');
const buyerModel = new Buyer();

// Проверяем пустые данные
console.log('✅ Пустые данные:', buyerModel.getData());

// Тестируем setField
buyerModel.setField('payment', 'card');
buyerModel.setField('email', 'test@example.com');
buyerModel.setField('phone', '+79991234567');
buyerModel.setField('address', 'г. Москва, ул. Примерная, д. 1');

console.log('\n✅ После заполнения данных:');
console.log(buyerModel.getData());

// Тестируем validate (должен вернуть пустой объект)
console.log('\n✅ Валидация заполненных данных:', buyerModel.validate());

// Тестируем clear
buyerModel.clear();
console.log('\n✅ После очистки:', buyerModel.getData());

// Тестируем validate с пустыми данными (должны быть ошибки)
console.log('\n✅ Валидация пустых данных:', buyerModel.validate());

// Частичное заполнение для проверки отдельных полей
buyerModel.setField('email', 'test@example.com');
buyerModel.setField('address', 'г. Москва');
console.log('\n✅ Частичное заполнение:', buyerModel.getData());
console.log('✅ Валидация частичных данных:', buyerModel.validate());
console.log('');

// === 4. Подключение к серверу ===
console.log('=== ЗАПРОС К СЕРВЕРУ ===\n');

// Создаем экземпляр API с использованием константы из utils/constants.ts
const api = new Api(API_URL, {
  headers: { 'Content-Type': 'application/json' },
});

const larekAPI = new LarekAPI(api);

// Делаем запрос на получение товаров
larekAPI
  .getProducts()
  .then((response) => {
    console.log('✅ УСПЕШНЫЙ ОТВЕТ ОТ СЕРВЕРА:');
    console.log('📊 Всего товаров на сервере:', response.total);
    console.log('📦 Первые 3 товара:', response.items.slice(0, 3));
    
    // Сохраняем полученные товары в модель
    productsModel.setItems(response.items);
    console.log('\n✅ Каталог обновлён в модели:');
    console.log('Количество товаров:', productsModel.getItems().length);
    console.log('Первый товар:', productsModel.getItems()[0]);
  })
  .catch((error) => {
    console.error('❌ ОШИБКА ПРИ ПОЛУЧЕНИИ ТОВАРОВ:', error);
  });

// === 5. Простой рендер для проверки работы приложения ===
const gallery = document.querySelector('.gallery');
if (gallery) {
  gallery.innerHTML = '<p style="padding:20px;text-align:center;color:#666">✅ Приложение работает! Откройте консоль (F12) для просмотра результатов тестирования</p>';
}

// Обновляем счётчик корзины
const basketCounter = document.querySelector('.header__basket-counter');
if (basketCounter) {
  basketCounter.textContent = '0';
}

console.log('\n=== ВСЕ ТЕСТЫ ЗАПУЩЕНЫ ===');
console.log('💡 Проверьте консоль выше для результатов тестирования моделей');
console.log('💡 Проверьте ответ от сервера в асинхронном запросе');