import './scss/styles.scss';

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
console.log('✅ Пустая корзина:', cartModel.getItems());
console.log('📊 Количество товаров:', cartModel.getCount());
console.log('💰 Общая стоимость:', cartModel.getTotal());

// Тестируем add
if (firstProduct) {
  cartModel.add(firstProduct);
  console.log('\n✅ После добавления товара:');
  console.log('Товары в корзине:', cartModel.getItems());
  console.log('Количество товаров:', cartModel.getCount());
  console.log('Общая стоимость:', cartModel.getTotal());
  
  // Тестируем has
  console.log('✅ Товар есть в корзине:', cartModel.has(firstProduct.id));
  
  // Тестируем remove
  cartModel.remove(firstProduct);
  console.log('\n✅ После удаления товара:');
  console.log('Товары в корзине:', cartModel.getItems());
  console.log('Количество товаров:', cartModel.getCount());
  
  // Добавляем несколько товаров для проверки getTotal
  const product1 = apiProducts.items[0];
  const product2 = apiProducts.items[1];
  if (product1 && product2) {
    cartModel.add(product1);
    cartModel.add(product2);
    console.log('\n✅ После добавления двух товаров:');
    console.log('Количество товаров:', cartModel.getCount());
    console.log('Общая стоимость:', cartModel.getTotal());
    
    // Тестируем clear
    cartModel.clear();
    console.log('\n✅ После очистки корзины:', cartModel.getItems());
  }
}
console.log('');

// === 3. Тестирование модели Buyer ===
console.log('👤 ДАННЫЕ ПОКУПАТЕЛЯ:');
const buyerModel = new Buyer();

// Проверяем пустые данные
console.log('✅ Пустые данные:', buyerModel.get());

// Тестируем set
buyerModel.set('payment', 'card');
buyerModel.set('email', 'test@example.com');
buyerModel.set('phone', '+79991234567');
buyerModel.set('address', 'г. Москва, ул. Примерная, д. 1');

console.log('\n✅ После заполнения данных:');
console.log(buyerModel.get());

// Тестируем validate (должен вернуть пустой объект)
console.log('\n✅ Валидация заполненных данных:', buyerModel.validate());

// Тестируем clear
buyerModel.clear();
console.log('\n✅ После очистки:', buyerModel.get());

// Тестируем validate с пустыми данными (должны быть ошибки)
console.log('\n✅ Валидация пустых данных:', buyerModel.validate());

// Частичное заполнение для проверки отдельных полей
buyerModel.set('email', 'test@example.com');
buyerModel.set('address', 'г. Москва');
console.log('\n✅ Частичное заполнение:', buyerModel.get());
console.log('✅ Валидация частичных данных:', buyerModel.validate());
console.log('');

// === 4. Подключение к серверу ===
console.log('=== ЗАПРОС К СЕРВЕРУ ===\n');

const apiOrigin = import.meta.env.VITE_API_ORIGIN;
console.log('🌐 VITE_API_ORIGIN:', apiOrigin);

// Проверка: если переменная не загрузилась
if (!apiOrigin || apiOrigin === 'undefined') {
  console.error('❌ ОШИБКА: VITE_API_ORIGIN не задана!');
  console.log('💡 Создайте файл .env в корне проекта (рядом с package.json):');
  console.log('   VITE_API_ORIGIN=https://larek-api.nomoreparties.co');
  console.log('💡 Затем перезапустите сервер: npm run dev');
  
  // Для тестов используем хардкод (удалите после настройки .env)
  console.log('⚠️ Используем хардкод URL для тестов...');
}

// Создаем экземпляр API с проверкой
const baseUrl = apiOrigin && apiOrigin !== 'undefined' 
  ? apiOrigin 
  : 'https://larek-api.nomoreparties.co';
  
console.log('🔗 Базовый URL:', baseUrl);

const api = new Api(baseUrl, {
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
