/* ==========================================================================
   Mistria Crop Profit Calculator
   ========================================================================== */

'use strict';

const IMG_DIR = 'assets/crops/';

const state = {
  season: 'spring',
  cropId: 'turnip',
  qty: 1,
  day: 1,
};

/* ------------------------------------------------------------------- maths */

/**
 * Work out what a planting is worth by the last day of the season.
 *
 * A crop planted on day D is ready on day D + growthTime -- so a Turnip
 * (4 days) planted on day 1 is harvested on day 5. Anything ripening after
 * day 28 never gets picked, so the seed cost is a straight loss.
 *
 * Regrowing crops keep producing every regrowTime days after that first
 * harvest, for as long as the season lasts.
 */
function calculate(crop, qty, plantDay) {
  const seedCost = crop.seedPrice * qty;
  const perPlant = crop.yieldPerPlant || 1;

  const harvestDays = [];
  let day = plantDay + crop.growthTime;

  if (crop.regrowTime) {
    while (day <= SEASON_LENGTH) {
      harvestDays.push(day);
      day += crop.regrowTime;
    }
  } else if (day <= SEASON_LENGTH) {
    harvestDays.push(day);
  }

  const items = harvestDays.length * perPlant * qty;
  const revenue = items * crop.sellPrice;

  return {
    seedCost,
    harvestDays,
    items,
    revenue,
    profit: revenue - seedCost,
    /* the day it *would* have ripened, even when that falls past day 28 */
    firstRipeDay: plantDay + crop.growthTime,
  };
}

/* ------------------------------------------------------------------ format */

const nf = new Intl.NumberFormat('en-US');

const money = (n) => `${n < 0 ? '-' : ''}${nf.format(Math.abs(n))}t`;

const plural = (n, one, many) => `${nf.format(n)} ${n === 1 ? one : many}`;

const cropsInSeason = (season) => CROPS.filter((c) => c.season === season);

const cropById = (id) => CROPS.find((c) => c.id === id);

/* ---------------------------------------------------------------- elements */

const el = {
  seasonTabs: document.getElementById('season-tabs'),
  cropGrid: document.getElementById('crop-grid'),
  qty: document.getElementById('qty'),
  qtyNote: document.getElementById('qty-note'),
  day: document.getElementById('day'),
  daySlider: document.getElementById('day-slider'),
  dayNote: document.getElementById('day-note'),
  result: document.getElementById('result'),
  status: document.getElementById('result-status'),
  calendar: document.getElementById('calendar'),
  compareBody: document.querySelector('#compare tbody'),
};

/* ----------------------------------------------------------------- seasons */

function renderSeasonTabs() {
  el.seasonTabs.innerHTML = '';

  SEASONS.forEach((season) => {
    const label = document.createElement('label');
    label.className = 'season-tab';

    const input = document.createElement('input');
    input.type = 'radio';
    input.name = 'season';
    input.value = season.id;
    input.checked = season.id === state.season;
    input.addEventListener('change', () => selectSeason(season.id));

    const span = document.createElement('span');
    span.innerHTML = `<span aria-hidden="true">${season.emoji}</span>`;
    span.append(season.name);

    label.append(input, span);
    el.seasonTabs.append(label);
  });
}

function selectSeason(seasonId) {
  state.season = seasonId;

  /* keep the current crop if it grows here, otherwise fall back to the
     cheapest seed in the new season so the calculator is never empty */
  const list = cropsInSeason(seasonId);
  if (!list.some((c) => c.id === state.cropId)) {
    state.cropId = list.reduce((a, b) => (a.seedPrice <= b.seedPrice ? a : b)).id;
  }

  renderCropGrid();
  update();
}

/* ------------------------------------------------------------------- crops */

function renderCropGrid() {
  el.cropGrid.innerHTML = '';

  cropsInSeason(state.season).forEach((crop) => {
    const label = document.createElement('label');
    label.className = 'crop-option';

    const input = document.createElement('input');
    input.type = 'radio';
    input.name = 'crop';
    input.value = crop.id;
    input.checked = crop.id === state.cropId;
    input.addEventListener('change', () => {
      state.cropId = crop.id;
      update();
    });

    const card = document.createElement('div');
    card.className = 'crop-card';

    const img = document.createElement('img');
    img.src = IMG_DIR + crop.image;
    img.alt = '';                 /* decorative: the name is right below it */
    img.width = 48;
    img.height = 48;
    img.loading = 'lazy';

    const name = document.createElement('span');
    name.className = 'crop-name';
    name.textContent = crop.name;

    const price = document.createElement('span');
    price.className = 'crop-price';
    price.textContent = `${money(crop.seedPrice)} seed`;

    const badges = document.createElement('span');
    badges.className = 'badges';
    if (crop.tree) badges.append(badge('badge-tree', 'tree', 'fruit tree'));
    if (crop.postRepair) {
      badges.append(badge('badge-repair', '★', 'stocked after the General Store is repaired'));
    }

    card.append(img, name, price, badges);
    label.append(input, card);
    el.cropGrid.append(label);
  });
}

function badge(className, text, description) {
  const span = document.createElement('span');
  span.className = `badge ${className}`;
  span.textContent = text;
  span.title = description;
  /* the visible glyph is shorthand, so spell it out for screen readers */
  span.setAttribute('aria-label', description);
  span.setAttribute('role', 'img');
  return span;
}

/* ----------------------------------------------------------------- results */

function renderResult(crop, calc) {
  const harvested = calc.harvestDays.length > 0;
  const lastDay = harvested ? calc.harvestDays[calc.harvestDays.length - 1] : null;

  el.result.innerHTML = '';

  /* --- headline ------------------------------------------------------- */
  const headline = document.createElement('div');
  headline.className = `result-headline ${calc.profit >= 0 ? 'is-good' : 'is-bad'}`;

  const sprite = document.createElement('img');
  sprite.className = 'result-sprite';
  sprite.src = IMG_DIR + crop.image;
  sprite.alt = '';
  sprite.width = 64;
  sprite.height = 64;

  const text = document.createElement('p');
  text.style.margin = '0';

  const amount = document.createElement('strong');
  amount.className = 'amount';
  amount.textContent = `${calc.profit >= 0 ? '+' : ''}${money(calc.profit)}`;

  const amountLabel = document.createElement('span');
  amountLabel.className = 'amount-label';
  /* the sign on the number already says win or lose, so the label stays
     neutral -- "−70t lost on ..." reads as a double negative */
  amountLabel.textContent =
    `profit from ${nf.format(state.qty)} × ${crop.name} planted on day ${state.day}`;

  const amountSub = document.createElement('span');
  amountSub.className = 'amount-sub';
  amountSub.textContent = harvested
    ? `${plural(calc.harvestDays.length, 'harvest', 'harvests')} — ` +
      `first on day ${calc.harvestDays[0]}, last on day ${lastDay}`
    : `Ready on day ${calc.firstRipeDay}, which is after the season ends on day ${SEASON_LENGTH}.`;

  text.append(amount, amountLabel, amountSub);
  headline.append(sprite, text);

  /* --- breakdown ------------------------------------------------------ */
  const breakdown = document.createElement('dl');
  breakdown.className = 'breakdown';

  const rows = [
    ['Seeds bought', `${nf.format(state.qty)} × ${money(crop.seedPrice)}`],
    ['Seed cost', `−${money(calc.seedCost)}`],
    ['Items harvested', harvested ? nf.format(calc.items) : '0'],
    ['Sale income', `+${money(calc.revenue)}`],
    ['Profit per plant', money(Math.round((calc.profit / state.qty) * 100) / 100)],
    ['Growth time', plural(crop.growthTime, 'day', 'days') +
      (crop.regrowTime ? `, then every ${plural(crop.regrowTime, 'day', 'days')}` : '')],
  ];

  rows.forEach(([term, value]) => {
    const wrapper = document.createElement('div');
    const dt = document.createElement('dt');
    dt.textContent = term;
    const dd = document.createElement('dd');
    dd.textContent = value;
    wrapper.append(dt, dd);
    breakdown.append(wrapper);
  });

  el.result.append(headline, breakdown);

  /* --- caveats -------------------------------------------------------- */
  const notes = [];

  if (!harvested) {
    notes.push(
      `A ${crop.name} planted on day ${state.day} would not be ready until day ` +
      `${calc.firstRipeDay}. The season ends on day ${SEASON_LENGTH}, so the plant ` +
      `dies in the ground and the ${money(calc.seedCost)} spent on seed is lost. ` +
      `Plant by day ${SEASON_LENGTH - crop.growthTime} to break even on time.`
    );
  }

  if (crop.tree) {
    notes.push(
      'Fruit trees survive the season change — they keep bearing fruit every ' +
      'year, so a tree that misses this season is not really wasted money. ' +
      'This calculator only counts the current 28 days.'
    );
  }

  if (crop.postRepair) {
    notes.push(
      `${crop.name} seed is only stocked at the General Store after the ` +
      '"Repair the General Store" quest is finished.'
    );
  }

  notes.forEach((textContent) => {
    const p = document.createElement('p');
    p.className = 'note';
    p.textContent = textContent;
    el.result.append(p);
  });
}

/* ---------------------------------------------------------------- calendar */

function renderCalendar(crop, calc) {
  const harvestSet = new Set(calc.harvestDays);
  const harvested = calc.harvestDays.length > 0;
  const lastHarvest = harvested ? calc.harvestDays[calc.harvestDays.length - 1] : null;

  el.calendar.innerHTML = '';

  const perHarvest = (crop.yieldPerPlant || 1) * state.qty;

  for (let day = 1; day <= SEASON_LENGTH; day++) {
    const li = document.createElement('li');

    let glyph = '';
    let description;

    if (harvestSet.has(day)) {
      li.className = 'day-harvest';
      glyph = '✦';
      description = `Day ${day}: harvest ${plural(perHarvest, 'item', 'items')} ` +
        `worth ${money(perHarvest * crop.sellPrice)}`;
    } else if (day === state.day) {
      li.className = 'day-plant';
      glyph = '🌱';
      description = `Day ${day}: planted ${nf.format(state.qty)} ${crop.name}`;
    } else if (day < state.day) {
      description = `Day ${day}: nothing planted yet`;
    } else if (!harvested) {
      /* in the ground, but the season ends before it ripens */
      li.className = 'day-wasted';
      glyph = '✕';
      description = `Day ${day}: still growing, and it will not ripen in time`;
    } else if (day < lastHarvest) {
      li.className = 'day-grow';
      description = `Day ${day}: growing`;
    } else {
      description = `Day ${day}: finished, nothing left to pick`;
    }

    const number = document.createElement('span');
    number.textContent = day;

    const mark = document.createElement('span');
    mark.className = 'glyph';
    mark.setAttribute('aria-hidden', 'true');
    mark.textContent = glyph;

    li.append(mark, number);
    li.title = description;
    li.setAttribute('aria-label', description);
    el.calendar.append(li);
  }
}

/* ------------------------------------------------------------- comparison */

function renderCompare() {
  el.compareBody.innerHTML = '';

  const rows = cropsInSeason(state.season)
    .map((crop) => ({ crop, calc: calculate(crop, state.qty, state.day) }))
    .sort((a, b) => b.calc.profit - a.calc.profit);

  rows.forEach(({ crop, calc }) => {
    const tr = document.createElement('tr');
    if (crop.id === state.cropId) tr.className = 'is-current';

    const th = document.createElement('th');
    th.scope = 'row';

    const cell = document.createElement('span');
    cell.className = 'crop-cell';

    const img = document.createElement('img');
    img.src = IMG_DIR + crop.image;
    img.alt = '';
    img.width = 28;
    img.height = 28;
    img.loading = 'lazy';

    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = crop.name;
    button.addEventListener('click', () => {
      state.cropId = crop.id;
      renderCropGrid();
      update();

      /* hand focus to the matching card up in the picker: that scrolls it into
         view and leaves keyboard users somewhere sensible, which a bare
         scrollIntoView would not */
      const radio = el.cropGrid.querySelector(`input[value="${crop.id}"]`);
      if (radio) radio.focus();
    });

    cell.append(img, button);
    th.append(cell);
    tr.append(th);

    const cells = [
      money(crop.seedPrice),
      money(crop.sellPrice) + ((crop.yieldPerPlant || 1) > 1 ? ` ×${crop.yieldPerPlant}` : ''),
      `${crop.growthTime}d${crop.regrowTime ? ` +${crop.regrowTime}d` : ''}`,
      String(calc.harvestDays.length),
    ];

    cells.forEach((value) => {
      const td = document.createElement('td');
      td.textContent = value;
      tr.append(td);
    });

    const profitCell = document.createElement('td');
    profitCell.className = calc.profit >= 0 ? 'profit-good' : 'profit-bad';
    profitCell.textContent = `${calc.profit >= 0 ? '+' : ''}${money(calc.profit)}`;
    tr.append(profitCell);

    el.compareBody.append(tr);
  });
}

/* -------------------------------------------------------------- the inputs */

function clamp(value, min, max, fallback) {
  const n = Math.floor(Number(value));
  if (!Number.isFinite(n)) return fallback;
  return Math.min(max, Math.max(min, n));
}

function readInputs() {
  const rawQty = el.qty.value.trim();
  const rawDay = el.day.value.trim();

  state.qty = clamp(rawQty, 1, 999, 1);
  state.day = clamp(rawDay, 1, SEASON_LENGTH, 1);

  /* only nudge the field when the typed value was actually out of range --
     rewriting it on every keystroke makes the input impossible to use */
  const qtyBad = rawQty !== '' && String(state.qty) !== rawQty;
  const dayBad = rawDay !== '' && String(state.day) !== rawDay;

  el.qtyNote.textContent = qtyBad
    ? `Rounded to ${state.qty}. Enter a whole number from 1 to 999.`
    : '1 to 999 plants.';
  el.qtyNote.classList.toggle('is-error', qtyBad);

  el.dayNote.textContent = dayBad
    ? `Rounded to day ${state.day}. A season runs from day 1 to day ${SEASON_LENGTH}.`
    : `A season is ${SEASON_LENGTH} days long.`;
  el.dayNote.classList.toggle('is-error', dayBad);

  el.daySlider.value = state.day;
}

/*
 * Dragging the day slider fires a change per pixel, so the spoken summary
 * waits for the user to settle before it says anything.
 */
let announceTimer;

function announce(crop, calc) {
  clearTimeout(announceTimer);
  announceTimer = setTimeout(() => {
    const outcome = calc.harvestDays.length
      ? `${plural(calc.harvestDays.length, 'harvest', 'harvests')}, ` +
        `${plural(calc.items, 'item', 'items')} sold`
      : `no harvest, the crop is not ready until day ${calc.firstRipeDay}`;

    el.status.textContent =
      `${nf.format(state.qty)} ${crop.name} planted on day ${state.day}: ` +
      `${outcome}. Profit ${money(calc.profit)}.`;
  }, 400);
}

function update() {
  const crop = cropById(state.cropId);
  const calc = calculate(crop, state.qty, state.day);

  renderResult(crop, calc);
  renderCalendar(crop, calc);
  renderCompare();
  announce(crop, calc);

  document.title = `${crop.name}: ${calc.profit >= 0 ? '+' : ''}${money(calc.profit)} — Mistria Crop Profit Calculator`;
}

/* --------------------------------------------------------------- start up */

el.qty.addEventListener('input', () => { readInputs(); update(); });
el.day.addEventListener('input', () => { readInputs(); update(); });

el.daySlider.addEventListener('input', () => {
  el.day.value = el.daySlider.value;
  readInputs();
  update();
});

/* snap the typed value into range once the user is finished with the field */
[el.qty, el.day].forEach((input) => {
  input.addEventListener('blur', () => {
    input.value = input === el.qty ? state.qty : state.day;
    readInputs();
    update();
  });
});

renderSeasonTabs();
renderCropGrid();
readInputs();
update();
