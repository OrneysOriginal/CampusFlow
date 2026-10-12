const events = [
  {
    id: 'semantic-html',
    category: 'Frontend',
    title: 'Семантический HTML без лишних div',
    shortTitle: 'Семантический HTML',
    date: '18 сентября',
    time: '16:00',
    place: 'Аудитория 304',
    duration: '90 минут',
    seats: 18,
    capacity: 40,
    level: 'Для всех',
    format: 'Очно',
    favorite: false,
  },
  {
    id: 'git-basics',
    category: 'Инструменты',
    title: 'Git без страха',
    shortTitle: 'Git без страха',
    date: '19 сентября',
    time: '14:30',
    place: 'online',
    duration: '60 минут',
    seats: 8,
    capacity: 30,
    level: 'Начальный',
    format: 'Онлайн',
    favorite: true,
  },
  {
    id: 'ux-review',
    category: 'UX/UI',
    title: 'UX-разбор интерфейсов',
    shortTitle: 'UX-разбор интерфейсов',
    date: '21 сентября',
    time: '17:00',
    place: 'коворкинг',
    duration: '90 минут',
    seats: 5,
    capacity: 20,
    level: 'Для всех',
    format: 'Очно',
    favorite: false,
  },
  {
    id: 'rest-api',
    category: 'Backend',
    title: 'REST API на практике',
    shortTitle: 'REST API на практике',
    date: '23 сентября',
    time: '15:00',
    place: 'Аудитория 211',
    duration: '120 минут',
    seats: 14,
    capacity: 24,
    level: 'Продвинутый',
    format: 'Очно',
    favorite: false,
  },
  {
    id: 'portfolio',
    category: 'Карьера',
    title: 'Портфолио разработчика',
    shortTitle: 'Портфолио разработчика',
    date: '25 сентября',
    time: '18:00',
    place: 'online',
    duration: '75 минут',
    seats: 32,
    capacity: 50,
    level: 'Для всех',
    format: 'Онлайн',
    favorite: false,
  },
  {
    id: 'accessibility',
    category: 'Frontend',
    title: 'Доступность в вебе',
    shortTitle: 'Доступность в вебе',
    date: '27 сентября',
    time: '13:00',
    place: 'Аудитория 118',
    duration: '90 минут',
    seats: 10,
    capacity: 25,
    level: 'Начальный',
    format: 'Очно',
    favorite: true,
  },
];

const eventDetails = {
  description:
    'На занятии участники научатся выбирать семантические элементы страницы, определять границы компонентов и проверять структуру документа до стилизации.',
  program: [
    'Landmark-элементы: header, nav, main, aside, footer',
    'Article и section: когда использовать',
    'Формы, label и состояния ошибок',
    'Разбор реального макета',
  ],
  speakers: [
    'Анна Воронова — frontend-разработчик',
    'Михаил Ким — специалист по доступности',
  ],
  organizer: 'Кафедра веб-технологий',
};

function eventCard(event) {
  return `
    <article class="event-card" data-event-id="${event.id}">
      <div class="event-card__visual" aria-hidden="true"><span>▭</span></div>
      <button
        class="favorite-button ${event.favorite ? 'is-active' : ''}"
        type="button"
        aria-pressed="${event.favorite}"
        aria-label="${event.favorite ? 'Удалить из избранного' : 'Добавить в избранное'}"
      >${event.favorite ? '♥' : '♡'}</button>
      <span class="tag">${event.category}</span>
      <h2><a href="#/events/${event.id}">${event.shortTitle}</a></h2>
      <p>${event.date} · ${event.time} · ${event.place}</p>
      <strong>${event.seats} ${seatWord(event.seats)}</strong>
    </article>`;
}

function seatWord(value) {
  if (value % 10 === 1 && value % 100 !== 11) return 'место';
  if ([2, 3, 4].includes(value % 10) && ![12, 13, 14].includes(value % 100)) return 'места';
  return 'мест';
}

function filtersPanel() {
  return `
    <aside class="filters-panel" id="filters-panel" aria-labelledby="filters-title">
      <div class="filters-panel__header">
        <h2 id="filters-title">Мои фильтры</h2>
        <button class="filters-close" type="button" aria-label="Закрыть фильтры">×</button>
      </div>
      <label>Дата
        <select name="date">
          <option value="week">На этой неделе</option>
          <option value="all">Любая дата</option>
        </select>
      </label>
      <fieldset>
        <legend>Формат</legend>
        <label><input type="checkbox" name="format" value="Очно" checked /> Очно</label>
        <label><input type="checkbox" name="format" value="Онлайн" checked /> Онлайн</label>
      </fieldset>
      <fieldset>
        <legend>Уровень</legend>
        <label><input type="radio" name="level" value="Все" checked /> Для всех</label>
        <label><input type="radio" name="level" value="Начальный" /> Начальный</label>
        <label><input type="radio" name="level" value="Продвинутый" /> Продвинутый</label>
      </fieldset>
      <button class="button button--primary filters-apply" type="button">Применить</button>
    </aside>`;
}

function renderHeader(active = '') {
  return `
    <header class="site-header">
      <div class="shell header-inner">
        <a class="brand" href="#/events" aria-label="CampusFlow — на главную">
          <span class="brand-mark" aria-hidden="true">CF</span>
          <span>CampusFlow</span>
        </a>
        <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="main-nav">
          Меню
        </button>
        <nav id="main-nav" class="main-nav" aria-label="Основная навигация">
          <a ${active === 'catalog' ? 'aria-current="page"' : ''} href="#/events">Каталог</a>
          <a href="#/my-events">Мои события</a>
          <a ${active === 'profile' ? 'aria-current="page"' : ''} href="#/register/semantic-html">Профиль</a>
        </nav>
        <label class="header-search">
          <span class="sr-only">Поиск по сайту</span>
          <input type="search" placeholder="Поиск" />
        </label>
        <button class="avatar" type="button" aria-label="Открыть профиль пользователя">AV</button>
      </div>
    </header>`;
}

function initHeader() {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.main-nav');
  toggle?.addEventListener('click', () => {
    const isOpen = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!isOpen));
    nav?.classList.toggle('is-open', !isOpen);
  });
}

const categories = ['Все', 'Frontend', 'Backend', 'UX/UI', 'Карьера'];

function catalogPage() {
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
        <span class="result-count" aria-live="polite">24 события</span>
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

function initCatalog() {
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
    applyStressCase();
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
  applyStressCase();
}

function applyStressCase() {
  const caseName = new URLSearchParams(window.location.search).get('stress');
  if (!caseName) return;

  const firstCard = document.querySelector('.event-card');
  if (!firstCard) return;

  const cases = {
    title: () => {
      firstCard.querySelector('h2 a').textContent =
        'Практическое занятие по адаптивной геометрии интерфейсов и устойчивой точной верстке сложных карточек с различным наполнением, заголовок для проверки';
    },
    organization: () => {
      firstCard.querySelector('p').textContent =
        'Международный исследовательский образовательный центр цифровых коммуникаций и проектирования интерактивных систем имени Александра Константиновича Петрова-Сидорова';
    },
    url: () => {
      firstCard.querySelector('p').textContent =
        'https://campus.example.com/events/' + 'very-long-unbroken-event-slug-'.repeat(12);
    },
    empty: () => {
      firstCard.querySelector('p').textContent = '';
    },
  };
  cases[caseName]?.();
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

function eventPage(id) {
  const event = events.find((item) => item.id === id) ?? events[0];
  const percent = Math.round((event.seats / event.capacity) * 100);
  return `
    <main id="main-content" class="page shell event-page">
      <a class="back-link" href="#/events">← Назад к каталогу</a>
      <div class="event-layout">
        <div>
          <article class="event-hero">
            <div class="event-icon" aria-hidden="true">&lt;/&gt;</div>
            <div>
              <span class="tag">${event.category}</span>
              <h1>${event.title}</h1>
              <p>${eventDetails.description}</p>
              <dl class="event-meta">
                <div><dt class="sr-only">Дата и время</dt><dd>${event.date} · ${event.time}</dd></div>
                <div><dt class="sr-only">Место и продолжительность</dt><dd>${event.place} · ${event.duration}</dd></div>
              </dl>
            </div>
          </article>
          <section class="event-content" aria-labelledby="content-title">
            <div class="tabs" role="tablist" aria-label="Информация о мероприятии">
              <button id="tab-description" role="tab" aria-selected="true" aria-controls="panel-description">Описание</button>
              <button id="tab-program" role="tab" aria-selected="false" aria-controls="panel-program" tabindex="-1">Программа</button>
              <button id="tab-speakers" role="tab" aria-selected="false" aria-controls="panel-speakers" tabindex="-1">Спикеры</button>
            </div>
            <div id="panel-description" role="tabpanel" aria-labelledby="tab-description">
              <h2 id="content-title">О мероприятии</h2>
              <p>${eventDetails.description}</p>
              <h3>Что будет на встрече</h3>
              <div class="event-detail-columns"><ul>${eventDetails.program.map((item) => `<li>${item}</li>`).join('')}</ul><aside class="interaction-summary"><h3>Интерактивные состояния</h3><p>Вкладки — active / hover</p><p>Запись — default / loading</p><p>Избранное — off / on</p><p>Места — available / full</p></aside></div>
            </div>
            <div id="panel-program" role="tabpanel" aria-labelledby="tab-program" hidden>
              <h2>Программа</h2>
              <ol>${eventDetails.program.map((item) => `<li>${item}</li>`).join('')}</ol>
            </div>
            <div id="panel-speakers" role="tabpanel" aria-labelledby="tab-speakers" hidden>
              <h2>Спикеры</h2>
              <ul>${eventDetails.speakers.map((item) => `<li>${item}</li>`).join('')}</ul>
            </div>
          </section>
        </div>
        <aside class="booking-card" aria-labelledby="booking-title">
          <h2 id="booking-title">Запись на мероприятие</h2>
          <strong>Осталось ${event.seats} из ${event.capacity} мест</strong>
          <div class="progress" role="progressbar" aria-label="Свободные места" aria-valuenow="${event.seats}" aria-valuemin="0" aria-valuemax="${event.capacity}">
            <span style="width: ${percent}%"></span>
          </div>
          <a class="button button--primary button--block" href="#/register/${event.id}">Записаться</a>
          <button class="button button--secondary button--block event-favorite" type="button" aria-pressed="false">♡ В избранное</button>
          <hr />
          <p><small>Организатор</small><br /><b>${eventDetails.organizer}</b></p>
        </aside>
      </div>
    </main>`;
}

function initEvent() {
  const tabs = [...document.querySelectorAll('[role="tab"]')];
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => selectTab(tab, tabs));
    tab.addEventListener('keydown', (event) => {
      if (!['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
      const direction = event.key === 'ArrowRight' ? 1 : -1;
      const next = tabs[(index + direction + tabs.length) % tabs.length];
      selectTab(next, tabs);
      next.focus();
    });
  });
  const favorite = document.querySelector('.event-favorite');
  favorite.addEventListener('click', () => {
    const active = favorite.getAttribute('aria-pressed') !== 'true';
    favorite.setAttribute('aria-pressed', String(active));
    favorite.textContent = active ? '♥ В избранном' : '♡ В избранное';
  });
}

function selectTab(selected, tabs) {
  tabs.forEach((tab) => {
    const active = tab === selected;
    tab.setAttribute('aria-selected', String(active));
    tab.tabIndex = active ? 0 : -1;
    document.querySelector(`#${tab.getAttribute('aria-controls')}`).hidden = !active;
  });
}

function registrationPage(id) {
  const event = events.find((item) => item.id === id) ?? events[0];
  return `
    <main id="main-content" class="page shell registration-page">
      <header class="page-heading">
        <h1>Регистрация на мероприятие</h1>
        <p>Заполните данные. Поля со звёздочкой обязательны.</p>
      </header>
      <div class="registration-layout">
        <form class="registration-form" novalidate>
          <fieldset>
            <legend>Контактные данные</legend>
            <label for="full-name">Имя и фамилия <span aria-hidden="true">*</span></label>
            <input id="full-name" name="fullName" autocomplete="name" required />
            <p class="field-error" id="full-name-error"></p>

            <label for="email">E-mail <span aria-hidden="true">*</span></label>
            <input id="email" name="email" type="email" autocomplete="email" required />
            <p class="field-error" id="email-error"></p>

            <label for="team">Группа / команда</label>
            <input id="team" name="team" autocomplete="organization" />

            <fieldset class="choice-group">
              <legend>Формат участия <span aria-hidden="true">*</span></legend>
              <label><input type="radio" name="format" value="Очно" required /> Очно</label>
              <label><input type="radio" name="format" value="Онлайн" /> Онлайн</label>
            </fieldset>
            <p class="field-error" id="format-error"></p>

            <label for="comment">Комментарий</label>
            <textarea id="comment" name="comment" rows="4" placeholder="Например, вопрос организатору..."></textarea>

            <label class="agreement">
              <input type="checkbox" name="agreement" required />
              <span>Я согласен с <a href="#/rules">правилами участия</a></span>
            </label>
            <p class="field-error" id="agreement-error"></p>
          </fieldset>
          <div class="form-actions">
            <button class="button button--primary submit-button" type="submit">Отправить заявку</button>
            <a class="button button--secondary" href="#/events/${event.id}">Отмена</a>
          </div>
        </form>
        <aside class="form-help" aria-labelledby="form-help-title">
          <h2 id="form-help-title">Состояния формы</h2>
          <div class="form-state"><h3>1. Ошибка обязательного поля</h3><label for="demo-email">E-mail *</label><input id="demo-email" value="student@" readonly aria-describedby="demo-error" /><p class="state-error" id="demo-error">Введите корректный e-mail</p></div>
          <div class="form-state"><h3>2. Отправка</h3><button type="button" class="button state-loading" disabled>Отправка…</button><p>Кнопка недоступна до завершения.</p></div>
          <div class="form-state"><h3>3. Успех</h3><div class="state-success"><strong>✓ Заявка принята</strong><p>Подтверждение отправлено на почту.</p><a href="#/my-events">Перейти в «Мои события» →</a></div></div>
        </aside>
      </div>
      <section class="success-panel" hidden tabindex="-1" aria-labelledby="success-title">
        <span aria-hidden="true">✓</span>
        <h2 id="success-title">Заявка принята</h2>
        <p>Подтверждение отправлено на указанную почту.</p>
        <a class="button button--primary" href="#/my-events">Перейти в «Мои события»</a>
      </section>
    </main>`;
}

function initRegistration() {
  const form = document.querySelector('.registration-form');
  const button = document.querySelector('.submit-button');
  const success = document.querySelector('.success-panel');
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    clearErrors(form);
    const data = new FormData(form);
    let valid = true;
    valid = validateRequired(form.fullName, 'Введите имя и фамилию') && valid;
    valid = validateEmail(form.email) && valid;
    if (!data.get('format')) {
      showError(
        form.querySelector('[name="format"]'),
        'format-error',
        'Выберите формат участия',
      );
      valid = false;
    }
    if (!form.agreement.checked) {
      showError(form.agreement, 'agreement-error', 'Подтвердите согласие с правилами');
      valid = false;
    }
    if (!valid) {
      form.querySelector('[aria-invalid="true"]')?.focus();
      return;
    }
    button.disabled = true;
    button.textContent = 'Отправка…';
    window.setTimeout(() => {
      form.closest('.registration-layout').hidden = true;
      success.hidden = false;
      success.focus();
    }, 700);
  });
}

function validateRequired(input, message) {
  if (input.value.trim()) return true;
  showError(input, `${input.id}-error`, message);
  return false;
}

function validateEmail(input) {
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (pattern.test(input.value)) return true;
  showError(input, 'email-error', 'Введите корректный e-mail');
  return false;
}

function showError(input, errorId, message) {
  input.setAttribute('aria-invalid', 'true');
  input.setAttribute('aria-describedby', errorId);
  document.querySelector(`#${errorId}`).textContent = message;
}

function clearErrors(form) {
  form.querySelectorAll('[aria-invalid="true"]').forEach((input) => {
    input.removeAttribute('aria-invalid');
    input.removeAttribute('aria-describedby');
  });
  form.querySelectorAll('.field-error').forEach((error) => {
    error.textContent = '';
  });
}

const app = document.querySelector('#app');

function render() {
  const route = window.location.hash.slice(1) || '/events';
  const parts = route.split('/').filter(Boolean);
  let content;
  let active = 'catalog';
  let initPage = () => {};

  if (parts[0] === 'events' && parts[1]) {
    content = eventPage(parts[1]);
    initPage = initEvent;
  } else if (parts[0] === 'register') {
    content = registrationPage(parts[1]);
    active = 'profile';
    initPage = initRegistration;
  } else if (parts[0] === 'my-events') {
    content = `<main id="main-content" class="page shell"><h1>Мои события</h1><p>Здесь появятся мероприятия, на которые вы зарегистрировались.</p><a class="button button--primary" href="#/events">Открыть каталог</a></main>`;
    active = '';
  } else {
    content = catalogPage();
    initPage = initCatalog;
  }

  app.innerHTML = `${renderHeader(active)}${content}<footer class="site-footer"><div class="shell">CampusFlow · учебный проект</div></footer>`;
  initHeader();
  initPage();
  window.scrollTo({ top: 0 });
}

window.addEventListener('hashchange', render);
render();
