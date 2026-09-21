# CampusFlow

Учебный Vite-проект для практической работы №1: инженерный анализ макета, декомпозиция, настройка инструментов качества и семантический HTML-каркас.

## Что реализовано

- каталог мероприятий с поиском, категориями, расширенными фильтрами, избранным и empty-state;
- страница мероприятия с данными, booking-card и доступными вкладками;
- форма регистрации с локальной валидацией, loading и success;
- адаптивное поведение около 1024, 768 и 375 px;
- ESLint, Prettier, Stylelint и production build;
- подробная декомпозиция в [`docs/decomposition.md`](docs/decomposition.md).

## Запуск

Требуется Node.js 20.19+ или 22.12+.

```bash
npm install
npm run dev
```

Vite выведет локальный адрес. Основные маршруты:

- `#/events`
- `#/events/semantic-html`
- `#/register/semantic-html`

## Проверки

```bash
npm run lint          # ESLint + Stylelint
npm run format        # автоматическое форматирование
npm run format:check  # проверка форматирования без изменений
npm run build         # production-сборка
npm run check         # все проверки и сборка
```

## Структура

```text
src/
├── components/  # общие UI-компоненты
├── data/        # учебные данные
├── pages/       # страницы и их интерактивность
├── styles/      # базовые, компонентные и адаптивные стили
└── main.js      # клиентская маршрутизация
```