export function renderHeader(active = '') {
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

export function initHeader() {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.main-nav');
  toggle?.addEventListener('click', () => {
    const isOpen = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!isOpen));
    nav?.classList.toggle('is-open', !isOpen);
  });
}
