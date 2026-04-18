// src/utils/constants.ts

/* Константа для получения полного пути для сервера. Для выполнения запроса
необходимо к API_URL добавить только ендпоинт. */
export const API_URL = `${import.meta.env.VITE_API_ORIGIN}/api/weblarek`;

/* Константа для формирования полного пути к изображениям карточек.
Для получения полной ссылки на картинку необходимо к CDN_URL добавить только название файла изображения,
которое хранится в объекте товара. */
export const CDN_URL = `${import.meta.env.VITE_API_ORIGIN}/content/weblarek`;

/* Константа соответствий категорий товара модификаторам, используемым для отображения фона категории. */
export const categoryMap: Record<string, string> = {
    'софт-скил': 'soft',
    'хард-скил': 'hard',
    'другое': 'other',
    'дополнительное': 'additional',
    'кнопка': 'button'
};

// Обратный маппинг для отображения русских названий
export const categoryNames: Record<string, string> = {
    'soft': 'софт-скил',
    'hard': 'хард-скил',
    'other': 'другое',
    'additional': 'дополнительное',
    'button': 'кнопка'
};

export const settings = {};