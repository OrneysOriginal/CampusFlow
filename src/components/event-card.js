export function eventCard(event) {
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
