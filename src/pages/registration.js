import { events } from '../data/events.js';

export function registrationPage(id) {
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

export function initRegistration() {
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
