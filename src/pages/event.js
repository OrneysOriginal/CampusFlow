import { eventDetails, events } from '../data/events.js';

export function eventPage(id) {
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
              <ul>${eventDetails.program.map((item) => `<li>${item}</li>`).join('')}</ul>
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

export function initEvent() {
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
