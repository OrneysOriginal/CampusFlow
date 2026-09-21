export function filtersPanel() {
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
