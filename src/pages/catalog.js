import { eventCard } from '../components/event-card.js';
import { filtersPanel } from '../components/filters.js';
import { events } from '../data/events.js';

const categories = ['Все', 'Frontend', 'Backend', 'UX/UI', 'Карьера'];

export function catalogPage() {
  return `
    <main id="main-content" class="page shell catalog-page">
      <header class="page-heading">
        <h1>Учебные мероприятия</h1>
        <p>Найдите лекцию, мастер-класс или встречу по интересам.</p>
      </header>
      <form class="catalog-tools" role="search">
        <label class="search-field">
          <span class="sr-only">Поиск по названию или теме</span>
          <input id="catalog-search" type="search" placeholder="Поиск по названию или теме..." />
        </label>
        <label class="sort-field">
          <span class="sr-only">Сортировка</span>
          <select id="catalog-sort"><option>Сначала новые</option><option>Больше мест</option></select>
        </label>
        <button class="button button--secondary" id="reset-filters" type="button">Сбросить</button>
      </form>
      <div class="category-row">
        <strong>Фильтры</strong>
        <div class="category-list" aria-label="Категории">
          ${categories.map((category, index) => `<button class="chip ${index === 0 ? 'is-active' : ''}" type="button" data-category="${category}" aria-pressed="${index === 0}">${category}</button>`).join('')}
        </div>
        <button class="button button--secondary filters-open" type="button" aria-controls="filters-panel">Доп. фильтры</button>
        <span class="result-count" aria-live="polite">${events.length} событий</span>
      </div>
      <div class="catalog-layout">
        <section aria-labelledby="results-title">
          <h2 class="sr-only" id="results-title">Результаты поиска</h2>
          <div class="event-grid" id="event-grid">
            ${events.map(eventCard).join('')}
          </div>
          <div class="empty-state" id="empty-state" hidden>
            <h2>Ничего не найдено</h2>
            <p>Измените запрос или сбросьте фильтры.</p>
            <button class="button button--primary empty-reset" type="button">Сбросить фильтры</button>
          </div>
          <nav class="pagination" aria-label="Страницы каталога">
            <button type="button" aria-label="Предыдущая страница">‹</button>
            <button class="is-current" type="button" aria-current="page">1</button>
            <button type="button">2</button><button type="button">3</button><span>…</span><button type="button">8</button>
            <button type="button" aria-label="Следующая страница">›</button>
          </nav>
        </section>
        ${filtersPanel()}
      </div>
    </main>`;
}

export function initCatalog() {
  const search = document.querySelector('#catalog-search');
  const grid = document.querySelector('#event-grid');
  const empty = document.querySelector('#empty-state');
  const resultCount = document.querySelector('.result-count');
  let activeCategory = 'Все';

  const renderResults = () => {
    const query = search.value.trim().toLowerCase();
    const selectedFormats = [...document.querySelectorAll('[name="format"]:checked')].map(
      (item) => item.value,
    );
    const selectedLevel = document.querySelector('[name="level"]:checked')?.value ?? 'Все';
    const filtered = events.filter((event) => {
      const matchesQuery = `${event.title} ${event.category}`.toLowerCase().includes(query);
      const matchesCategory = activeCategory === 'Все' || event.category === activeCategory;
      const matchesFormat =
        selectedFormats.length === 0 || selectedFormats.includes(event.format);
      const matchesLevel = selectedLevel === 'Все' || event.level === selectedLevel;
      return matchesQuery && matchesCategory && matchesFormat && matchesLevel;
    });
    grid.innerHTML = filtered.map(eventCard).join('');
    grid.hidden = filtered.length === 0;
    empty.hidden = filtered.length !== 0;
    resultCount.textContent = `${filtered.length} событий`;
    initFavoriteButtons();
  };

  const reset = () => {
    search.value = '';
    activeCategory = 'Все';
    document.querySelectorAll('.chip').forEach((chip) => {
      const active = chip.dataset.category === 'Все';
      chip.classList.toggle('is-active', active);
      chip.setAttribute('aria-pressed', String(active));
    });
    document.querySelectorAll('[name="format"]').forEach((item) => {
      item.checked = true;
    });
    document.querySelector('[name="level"][value="Все"]').checked = true;
    renderResults();
  };

  search.addEventListener('input', renderResults);
  document.querySelectorAll('.chip').forEach((chip) => {
    chip.addEventListener('click', () => {
      activeCategory = chip.dataset.category;
      document.querySelectorAll('.chip').forEach((item) => {
        const active = item === chip;
        item.classList.toggle('is-active', active);
        item.setAttribute('aria-pressed', String(active));
      });
      renderResults();
    });
  });
  document.querySelector('.filters-apply').addEventListener('click', () => {
    renderResults();
    document.querySelector('.filters-panel').classList.remove('is-open');
  });
  document.querySelector('.filters-open').addEventListener('click', () => {
    document.querySelector('.filters-panel').classList.add('is-open');
  });
  document.querySelector('.filters-close').addEventListener('click', () => {
    document.querySelector('.filters-panel').classList.remove('is-open');
  });
  document.querySelector('#reset-filters').addEventListener('click', reset);
  document.querySelector('.empty-reset').addEventListener('click', reset);
  initFavoriteButtons();
}

function initFavoriteButtons() {
  document.querySelectorAll('.favorite-button').forEach((button) => {
    button.addEventListener('click', () => {
      const active = button.getAttribute('aria-pressed') !== 'true';
      button.setAttribute('aria-pressed', String(active));
      button.classList.toggle('is-active', active);
      button.textContent = active ? '♥' : '♡';
      button.setAttribute(
        'aria-label',
        active ? 'Удалить из избранного' : 'Добавить в избранное',
      );
    });
  });
}
