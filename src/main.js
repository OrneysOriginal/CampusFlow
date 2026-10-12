import { initHeader, renderHeader } from './components/header.js';
import { catalogPage, initCatalog } from './pages/catalog.js';
import { eventPage, initEvent } from './pages/event.js';
import { initRegistration, registrationPage } from './pages/registration.js';
import './styles/base.css';
import './styles/components.css';
import './styles/pages.css';
import './styles/responsive.css';
import './styles/mock-alignment.css';

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
