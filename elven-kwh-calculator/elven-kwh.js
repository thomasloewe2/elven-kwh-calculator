(function(){
  // --- Utils ---
  function parseLocaleNumber(str){
    if (typeof str !== 'string') str = String(str ?? '');
    str = str.trim().replace(/\s/g, '');
    if (!str) return NaN;

    const lastComma = str.lastIndexOf(',');
    const lastDot   = str.lastIndexOf('.');

    if (lastComma === -1 && lastDot === -1){
      return Number(str.replace(/[^\d-]/g, ''));
    }

    let decimalSep = -1;
    if (lastComma === -1) decimalSep = lastDot;
    else if (lastDot === -1) decimalSep = lastComma;
    else decimalSep = Math.max(lastComma, lastDot);

    let intPart, fracPart;
    if (decimalSep === -1){
      intPart = str.replace(/[^\d-]/g, '');
      return Number(intPart);
    } else {
      intPart  = str.slice(0, decimalSep).replace(/[^\d-]/g, '');
      fracPart = str.slice(decimalSep+1).replace(/[^\d]/g, '');
      return Number(intPart + '.' + fracPart);
    }
  }

  function formatDK(n, digits){
    if (!isFinite(n)) return '-';
    return n.toLocaleString('da-DK', {
      minimumFractionDigits: digits,
      maximumFractionDigits: digits
    });
  }

  function el(tag, cls, html){
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  }

  // --- Component ---
  class ElvenKwhCalc {
    constructor(root){
      this.root = root;
      this.build();
      this.bind();
      this.update();
    }

    build(){
      const wrapper = el('div', 'elven-kwh-wrap');

      wrapper.innerHTML = `
        <div class="elven-kwh-card" role="group" aria-label="Elven kWh calculator">
          <div class="elven-kwh-grid">
            <label class="elven-kwh-field">
              <span>Vil du beregne forbrug pr. gang eller pr. time?</span>
              <select class="elven-mode" aria-label="Beregningstype">
                <option value="per_use">Pr. gang</option>
                <option value="per_hour">Pr. time</option>
              </select>
            </label>

            <label class="elven-kwh-field elven-field-per-use">
              <span>Varighed pr. gang (minutter)</span>
              <input type="text" inputmode="decimal" class="elven-duration-min" placeholder="fx 90" aria-label="Varighed pr. gang (minutter)">
            </label>

            <label class="elven-kwh-field elven-field-per-use">
              <span>Antal anvendelser pr. uge</span>
              <input type="text" inputmode="decimal" class="elven-uses-per-week" placeholder="fx 5" aria-label="Anvendelser pr. uge">
            </label>

            <label class="elven-kwh-field elven-field-per-hour">
              <span>Antal timer pr. uge</span>
              <input type="text" inputmode="decimal" class="elven-hours-per-week" placeholder="fx 10" aria-label="Timer pr. uge">
            </label>

            <label class="elven-kwh-field">
              <span>Apparatets effekt (Watt)</span>
              <input type="text" inputmode="decimal" class="elven-watt" placeholder="fx 2000" aria-label="Effekt i Watt">
            </label>

            <label class="elven-kwh-field">
              <span>Elpris (kr./kWh)</span>
              <input type="text" inputmode="decimal" class="elven-price" placeholder="fx 2,50" aria-label="Elpris i kr./kWh">
            </label>
          </div>

          <div class="elven-kwh-results">
            <h4>Resultat</h4>
            <div class="elven-kwh-table" role="table" aria-label="Resultater">
              <div class="elven-row" role="row">
                <div role="cell">Pr. enhed (gang/time)</div>
                <div role="cell"><span class="r-unit-kwh">-</span> kWh · <span class="r-unit-kr">-</span> kr.</div>
              </div>
              <div class="elven-row" role="row">
                <div role="cell">Pr. dag (est.)</div>
                <div role="cell"><span class="r-day-kwh">-</span> kWh · <span class="r-day-kr">-</span> kr.</div>
              </div>
              <div class="elven-row" role="row">
                <div role="cell">Pr. uge</div>
                <div role="cell"><span class="r-week-kwh">-</span> kWh · <span class="r-week-kr">-</span> kr.</div>
              </div>
              <div class="elven-row" role="row">
                <div role="cell">Pr. måned (est.)</div>
                <div role="cell"><span class="r-month-kwh">-</span> kWh · <span class="r-month-kr">-</span> kr.</div>
              </div>
              <div class="elven-row" role="row">
                <div role="cell">Pr. år (est.)</div>
                <div role="cell"><span class="r-year-kwh">-</span> kWh · <span class="r-year-kr">-</span> kr.</div>
              </div>
            </div>
            <p class="elven-note">Bemærk: Måned ≈ 4,345 uger, år = 52 uger.</p>
          </div>
        </div>
      `;

      this.root.appendChild(wrapper);

      // Refs
      this.selMode   = wrapper.querySelector('.elven-mode');
      this.fPerUse   = wrapper.querySelectorAll('.elven-field-per-use');
      this.fPerHour  = wrapper.querySelector('.elven-field-per-hour');

      this.inDurationMin   = wrapper.querySelector('.elven-duration-min');
      this.inUsesPerWeek   = wrapper.querySelector('.elven-uses-per-week');
      this.inHoursPerWeek  = wrapper.querySelector('.elven-hours-per-week');
      this.inWatt          = wrapper.querySelector('.elven-watt');
      this.inPrice         = wrapper.querySelector('.elven-price');

      this.rUnitKwh  = wrapper.querySelector('.r-unit-kwh');
      this.rUnitKr   = wrapper.querySelector('.r-unit-kr');
      this.rDayKwh   = wrapper.querySelector('.r-day-kwh');
      this.rDayKr    = wrapper.querySelector('.r-day-kr');
      this.rWeekKwh  = wrapper.querySelector('.r-week-kwh');
      this.rWeekKr   = wrapper.querySelector('.r-week-kr');
      this.rMonthKwh = wrapper.querySelector('.r-month-kwh');
      this.rMonthKr  = wrapper.querySelector('.r-month-kr');
      this.rYearKwh  = wrapper.querySelector('.r-year-kwh');
      this.rYearKr   = wrapper.querySelector('.r-year-kr');

      // Defaults from data-attributes (if provided)
      const defPrice = this.root.getAttribute('data-default-price') || '';
      const defWatt  = this.root.getAttribute('data-default-watt') || '';
      if (defPrice) this.inPrice.value = defPrice;
      if (defWatt)  this.inWatt.value  = defWatt;

      // Helpful initial values if nothing set
      if (!this.inPrice.value) this.inPrice.value = '2,50';
      if (!this.inWatt.value)  this.inWatt.value  = '2000';
      this.inDurationMin.value = '90';
      this.inUsesPerWeek.value = '5';
      this.inHoursPerWeek.value = '10';
    }

    bind(){
      const onInput = () => this.update();
      [this.selMode, this.inDurationMin, this.inUsesPerWeek, this.inHoursPerWeek, this.inWatt, this.inPrice]
        .forEach(el => el.addEventListener('input', onInput));
    }

    update(){
      const mode = this.selMode.value;

      // Toggle visibility
      this.fPerUse.forEach(el => el.classList.toggle('elven-hidden', mode !== 'per_use'));
      this.fPerHour.classList.toggle('elven-hidden', mode !== 'per_hour');

      // Read inputs
      const W     = parseLocaleNumber(this.inWatt.value);
      const price = parseLocaleNumber(this.inPrice.value);

      let unitHours, weekHours;
      if (mode === 'per_use'){
        const minutes = parseLocaleNumber(this.inDurationMin.value);
        const usesW   = parseLocaleNumber(this.inUsesPerWeek.value);
        unitHours = (minutes / 60);
        weekHours = unitHours * usesW;
      } else {
        const hoursW = parseLocaleNumber(this.inHoursPerWeek.value);
        unitHours = 1;
        weekHours = hoursW;
      }

      const unitKwh  = (W * unitHours) / 1000;
      const unitKr   = unitKwh * price;

      const weekKwh  = (W * weekHours) / 1000;
      const weekKr   = weekKwh * price;

      const dayKwh   = weekKwh / 7;
      const dayKr    = weekKr / 7;

      const monthKwh = weekKwh * 4.345;
      const monthKr  = weekKr  * 4.345;

      const yearKwh  = weekKwh * 52;
      const yearKr   = weekKr  * 52;

      this.rUnitKwh.textContent  = isFinite(unitKwh)  ? formatDK(unitKwh, 3) : '-';
      this.rUnitKr.textContent   = isFinite(unitKr)   ? formatDK(unitKr, 2)  : '-';
      this.rDayKwh.textContent   = isFinite(dayKwh)   ? formatDK(dayKwh, 3)  : '-';
      this.rDayKr.textContent    = isFinite(dayKr)    ? formatDK(dayKr, 2)   : '-';
      this.rWeekKwh.textContent  = isFinite(weekKwh)  ? formatDK(weekKwh, 3) : '-';
      this.rWeekKr.textContent   = isFinite(weekKr)   ? formatDK(weekKr, 2)  : '-';
      this.rMonthKwh.textContent = isFinite(monthKwh) ? formatDK(monthKwh, 3): '-';
      this.rMonthKr.textContent  = isFinite(monthKr)  ? formatDK(monthKr, 2) : '-';
      this.rYearKwh.textContent  = isFinite(yearKwh)  ? formatDK(yearKwh, 3) : '-';
      this.rYearKr.textContent   = isFinite(yearKr)   ? formatDK(yearKr, 2)  : '-';
    }
  }

  // Hydrate all instances
  document.addEventListener('DOMContentLoaded', function(){
    document.querySelectorAll('.elven-kwh-calculator').forEach(node => new ElvenKwhCalc(node));
  });
})();
