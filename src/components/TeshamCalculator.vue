<template>
  <div class="page">
    <!-- Header -->
    <header>
      <div class="logo-wrap">
        <svg class="logo-svg" width="72" height="54" viewBox="0 0 100 72" fill="none">
          <defs>
            <linearGradient id="mg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#F5E199" />
              <stop offset="50%" stop-color="#C9A227" />
              <stop offset="100%" stop-color="#7A5C10" />
            </linearGradient>
            <linearGradient id="mg2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#C9A227" />
              <stop offset="100%" stop-color="#5a3e0a" />
            </linearGradient>
            <filter id="gl">
              <feGaussianBlur stdDeviation="1.8" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <polygon points="50,3 86,59 14,59" fill="url(#mg)" filter="url(#gl)" />
          <polygon points="20,31 37,59 3,59" fill="url(#mg2)" opacity=".7" />
          <polygon points="80,35 97,59 63,59" fill="url(#mg2)" opacity=".6" />
          <polyline points="50,3 57,21 52,30 61,43 50,59" stroke="#0a0a0a" stroke-width="1.5" fill="none" opacity=".45" />
          <line x1="14" y1="59" x2="86" y2="59" stroke="url(#mg)" stroke-width="1.5" />
        </svg>
        <div class="brand-name">ТЕШАМ</div>
        <div class="brand-tagline">Калькулятор рассрочки</div>
      </div>
      <div class="orn">
        <div class="orn-l" />
        <div class="orn-d" />
        <div class="orn-l r" />
      </div>
    </header>

    <!-- Tabs -->
    <div class="tabs-sec">
      <div class="tabs-lbl">Выберите тариф</div>
      <div class="tabs">
        <div class="tab-slider" :class="{ right: mode === 'without' }" />
        <button
          class="tab-btn"
          :class="{ on: mode === 'with' }"
          @click="mode = 'with'"
        >С взносом</button>
        <button
          class="tab-btn"
          :class="{ on: mode === 'without' }"
          @click="mode = 'without'"
        >Без взноса</button>
      </div>
    </div>

    <!-- Card -->
    <div class="calc-card">
      <div class="card-accent" />
      <div class="card-body">

        <div class="sec-tag">
          <div class="sec-tag-line" />
          <div class="sec-tag-txt">Параметры расчёта</div>
          <div class="sec-tag-line" />
        </div>

        <!-- Price -->
        <div class="field">
          <div class="field-top"><span class="fl">Стоимость товара</span></div>
          <div class="inp-wrap">
            <span class="inp-ico">₽</span>
            <input
              v-model="priceInput"
              class="inp"
              type="text"
              inputmode="numeric"
              placeholder="Введите сумму"
              @input="onPriceInput"
            >
          </div>
        </div>

        <!-- Down payment (only with mode) -->
        <div v-show="mode === 'with'" class="field">
          <div class="field-top">
            <span class="fl">Первый взнос</span>
            <span v-show="dpBadge" class="fbadge" style="display: inline-block;">{{ dpBadge }}</span>
          </div>
          <div class="inp-wrap" :class="{ 'inp-wrap--floating': isDownpayFloating }">
            <span class="inp-ico">₽</span>
            <input
              v-model="downpayInput"
              class="inp"
              type="text"
              inputmode="numeric"
              @input="onDownpayInput"
              @focus="isDownpayFocused = true"
              @blur="isDownpayFocused = false"
            >
            <label class="inp-flabel">{{ dpPlaceholder }}</label>
          </div>
          <div v-show="dpBelowMin" class="f-err" style="display: block;">Взнос ниже минимального (20% от цены товара)</div>
        </div>

        <!-- Slider -->
        <div class="sl-field">
          <div class="sl-head">
            <div><div class="sl-lbl">Срок рассрочки</div></div>
            <div class="sl-disp">
              <div class="sl-num">{{ months }}</div>
              <div class="sl-unit">МЕСЯЦЕВ</div>
              <div class="sl-pct">ставка: {{ ratePct }}%</div>
            </div>
          </div>
          <div class="sl-track">
            <div class="sl-bg" />
            <div class="sl-fill" :style="{ width: sliderFillPct + '%' }" />
            <input
              v-model.number="months"
              type="range"
              min="3"
              max="24"
              step="1"
            >
          </div>
          <div class="sl-marks">
            <span class="sl-mark">3 мес.</span>
            <span class="sl-mark">12 мес.</span>
            <span class="sl-mark">24 мес.</span>
          </div>
        </div>

        <!-- Ornamental divider -->
        <div class="od">
          <div class="od-l" />
          <div class="od-c">
            <div class="od-dot" />
            <div class="od-dot big" />
            <div class="od-dot" />
          </div>
          <div class="od-l" />
        </div>

      </div>

      <!-- Results -->
      <div class="res-sec">
        <div class="sec-tag" style="margin-bottom: 20px;">
          <div class="sec-tag-line" />
          <div class="sec-tag-txt">Результат расчёта</div>
          <div class="sec-tag-line" />
        </div>

        <div v-if="!price" class="res-empty">Введите стоимость для расчёта</div>
        <div v-else-if="dpBelowMin" class="res-empty">Скорректируйте первый взнос</div>
        <template v-else>
          <div class="res-main">
            <div class="res-main-lbl">Ежемесячный платёж</div>
            <div class="res-main-val">{{ fmt(monthly) }}</div>
            <div class="res-main-sub">на {{ months }} месяцев</div>
          </div>
          <div class="res-grid">
            <div v-if="mode === 'with'" class="rc">
              <div class="rc-lbl">Первый взнос</div>
              <div class="rc-val">{{ fmt(dpUsed) }}</div>
            </div>
            <div class="rc" :class="{ span2: mode !== 'with' }">
              <div class="rc-lbl">Цена товара</div>
              <div class="rc-val">{{ fmt(price) }}</div>
            </div>
            <div class="rc span2">
              <div class="rc-lbl">Общая сумма рассрочки</div>
              <div class="rc-val">{{ fmt(total) }}</div>
            </div>
          </div>
        </template>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
// Markup rate (%) per term in months — copied from original tesham95.netlify.app
const RW: Record<number, number> = {
  3: 17, 4: 18, 5: 19, 6: 20, 7: 25, 8: 27, 9: 29, 10: 31, 11: 33, 12: 35,
  13: 37, 14: 39, 15: 42, 16: 45, 17: 48, 18: 51, 19: 54, 20: 58, 21: 62, 22: 65, 23: 68, 24: 70,
}
const RWO: Record<number, number> = {
  3: 24, 4: 25, 5: 27, 6: 29, 7: 33, 8: 35, 9: 38, 10: 40, 11: 43, 12: 46,
  13: 49, 14: 52, 15: 56, 16: 60, 17: 64, 18: 68, 19: 72, 20: 76, 21: 80, 22: 84, 23: 87, 24: 90,
}

const mode = ref<'with' | 'without'>('with')
const priceInput = ref('')
const downpayInput = ref('')
const months = ref(12)

function fmt (n: number): string {
  return Math.round(n).toLocaleString('ru-RU') + ' ₽'
}

// Numeric formatter — strips non-digits, formats with spaces, preserves caret
function formatNumberInput (raw: string): string {
  const digits = raw.replace(/\s/g, '').replace(/[^\d]/g, '')
  if (!digits) return ''
  return Number.parseInt(digits, 10).toLocaleString('ru-RU')
}

function onPriceInput (e: Event) {
  const el = e.target as HTMLInputElement
  const cursorFromEnd = el.value.length - (el.selectionEnd ?? el.value.length)
  const formatted = formatNumberInput(el.value)
  priceInput.value = formatted
  nextTick(() => {
    const newPos = formatted.length - cursorFromEnd
    try { el.setSelectionRange(newPos, newPos) } catch { /* */ }
  })
}

function onDownpayInput (e: Event) {
  const el = e.target as HTMLInputElement
  const cursorFromEnd = el.value.length - (el.selectionEnd ?? el.value.length)
  const formatted = formatNumberInput(el.value)
  downpayInput.value = formatted
  nextTick(() => {
    const newPos = formatted.length - cursorFromEnd
    try { el.setSelectionRange(newPos, newPos) } catch { /* */ }
  })
}

function parseRaw (val: string): number {
  const digits = val.replace(/\s/g, '').replace(/[^\d]/g, '')
  return Number.parseFloat(digits) || 0
}

const price = computed(() => parseRaw(priceInput.value))
const downpay = computed(() => parseRaw(downpayInput.value))

const ratePct = computed(() => (mode.value === 'with' ? RW : RWO)[months.value])
const sliderFillPct = computed(() => ((months.value - 3) / 21) * 100)

const minDP = computed(() => price.value * 0.20)

const dpUsed = computed(() => {
  if (mode.value !== 'with') return 0
  return downpay.value > 0 ? downpay.value : minDP.value
})

const dpBelowMin = computed(() =>
  mode.value === 'with' && downpay.value > 0 && downpay.value < minDP.value,
)

const dpBadge = computed(() => {
  if (mode.value !== 'with' || downpay.value <= 0 || price.value <= 0) return ''
  return Math.round((downpay.value / price.value) * 100) + '% от цены'
})

const dpPlaceholder = computed(() => {
  if (price.value <= 0) return 'Минимум 20% от стоимости товара'
  return 'Минимум 20%: ' + fmt(minDP.value)
})

// Floating-label state for the down payment input — placeholder slides up
// when the input is focused or has any value (Vuetify-style behaviour).
const isDownpayFocused = ref(false)
const isDownpayFloating = computed(() => isDownpayFocused.value || downpayInput.value.length > 0)

const total = computed(() => price.value * (1 + (ratePct.value ?? 0) / 100))
const monthly = computed(() => {
  if (mode.value === 'with') {
    return (total.value - dpUsed.value) / months.value
  }
  return total.value / months.value
})
</script>

<style scoped>
.page {
  position: relative;
  z-index: 1;
  padding: 0 16px 80px;
  max-width: 480px;
  margin: 0 auto;
}

/* ── HEADER ── */
header {
  text-align: center;
  padding: 44px 0 32px;
  animation: fdD .7s ease both;
}
@keyframes fdD {
  from { opacity: 0; transform: translateY(-18px); }
  to   { opacity: 1; transform: none; }
}

.logo-wrap {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}
.logo-svg { filter: drop-shadow(0 0 22px rgba(201, 162, 39, .45)); }
.brand-name {
  font-family: 'EB Garamond', serif;
  font-size: 34px;
  font-weight: 600;
  letter-spacing: .32em;
  color: var(--gold);
  text-shadow: 0 0 32px rgba(201, 162, 39, .35);
}
.brand-tagline {
  font-size: 9px;
  letter-spacing: .38em;
  color: var(--muted);
  text-transform: uppercase;
  font-weight: 300;
}

.orn {
  display: flex;
  align-items: center;
  gap: 10px;
  justify-content: center;
  margin-top: 24px;
}
.orn-l {
  flex: 1;
  max-width: 60px;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--gold-d));
}
.orn-l.r { background: linear-gradient(90deg, var(--gold-d), transparent); }
.orn-d {
  width: 5px;
  height: 5px;
  background: var(--gold);
  transform: rotate(45deg);
  box-shadow: 0 0 7px rgba(201, 162, 39, .6);
}

/* ── TABS ── */
.tabs-sec {
  margin-bottom: 24px;
  animation: fdU .7s .25s ease both;
}
@keyframes fdU {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: none; }
}

.tabs-lbl {
  text-align: center;
  font-size: 11px;
  letter-spacing: .35em;
  color: var(--dim);
  text-transform: uppercase;
  margin-bottom: 14px;
}

.tabs {
  display: grid;
  grid-template-columns: 1fr 1fr;
  border: 1px solid rgba(201, 162, 39, .2);
  border-radius: 14px;
  overflow: hidden;
  background: var(--blk2);
  position: relative;
}
.tab-slider {
  position: absolute;
  top: 0;
  left: 0;
  width: 50%;
  height: 100%;
  background: linear-gradient(135deg, #b8900a, #e8c030, #b8900a);
  border-radius: 13px;
  transition: transform .35s cubic-bezier(.4, 0, .2, 1);
  z-index: 0;
}
.tab-slider.right { transform: translateX(100%); }

.tab-btn {
  position: relative;
  z-index: 1;
  padding: 16px 10px;
  border: none;
  background: transparent;
  color: var(--muted);
  font-family: 'Montserrat', sans-serif;
  font-size: 11px;
  font-weight: 500;
  letter-spacing: .1em;
  text-transform: uppercase;
  cursor: pointer;
  transition: color .3s, transform .12s;
  user-select: none;
  touch-action: manipulation;
}
.tab-btn.on { color: #0a0a0a; font-weight: 700; }
.tab-btn:active { transform: scale(.96); }

/* ── CARD ── */
.calc-card {
  background: var(--blk2);
  border: 1px solid rgba(201, 162, 39, .15);
  border-radius: 22px;
  overflow: hidden;
  animation: fdU .7s .4s ease both;
  box-shadow: 0 0 60px rgba(0, 0, 0, .6), inset 0 1px 0 rgba(201, 162, 39, .1);
}
.card-accent {
  height: 2px;
  background: linear-gradient(90deg, transparent 5%, var(--gold-d) 30%, var(--gold-l) 50%, var(--gold-d) 70%, transparent 95%);
}
.card-body { padding: 28px 22px 0; }

.sec-tag {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 24px;
}
.sec-tag-line {
  height: 1px;
  flex: 1;
  background: rgba(201, 162, 39, .1);
}
.sec-tag-txt {
  font-size: 8px;
  letter-spacing: .32em;
  color: var(--dim);
  text-transform: uppercase;
  white-space: nowrap;
}

/* ── FIELDS ── */
.field { margin-bottom: 22px; }
.field-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 9px;
}
.fl {
  font-size: 11px;
  letter-spacing: .2em;
  color: var(--muted);
  text-transform: uppercase;
  font-weight: 500;
}

.fbadge {
  font-size: 9px;
  color: var(--gold);
  background: rgba(201, 162, 39, .1);
  border: 1px solid rgba(201, 162, 39, .2);
  border-radius: 20px;
  padding: 2px 9px;
  letter-spacing: .05em;
}

.inp-wrap { position: relative; }
.inp-ico {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--dim);
  font-size: 14px;
  pointer-events: none;
  font-family: 'Playfair Display', serif;
}
.inp {
  width: 100%;
  height: 56px;
  background: var(--blk3);
  border: 1px solid rgba(201, 162, 39, .12);
  border-radius: 12px;
  color: var(--txt);
  font-size: 20px;
  font-family: 'Playfair Display', serif;
  line-height: 56px;
  padding: 0 16px 6px 34px;
  outline: none;
  transition: border-color .25s, box-shadow .25s;
  -moz-appearance: textfield;
  appearance: textfield;
}
.inp::-webkit-outer-spin-button,
.inp::-webkit-inner-spin-button { -webkit-appearance: none; }
.inp::placeholder {
  color: #5a4a28;
  font-size: 13px;
  font-family: 'Montserrat', sans-serif;
  line-height: 56px;
}
.inp:focus {
  border-color: rgba(201, 162, 39, .5);
  background: var(--blk4);
  box-shadow: 0 0 0 3px rgba(201, 162, 39, .08);
}

/* Floating label — sits at center of input when empty/blurred,
   slides to the top border when focused or has a value (Vuetify-style). */
.inp-flabel {
  position: absolute;
  left: 30px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 13px;
  font-family: 'Montserrat', sans-serif;
  color: #5a4a28;
  pointer-events: none;
  background: transparent;
  padding: 0;
  white-space: nowrap;
  transition: top .18s ease, font-size .18s ease, color .18s ease,
              padding .18s ease, letter-spacing .18s ease, background .18s ease;
  z-index: 1;
}
.inp-wrap--floating .inp-flabel {
  top: 0;
  font-size: 10px;
  color: var(--gold);
  background: var(--blk2);
  padding: 0 6px;
  letter-spacing: .08em;
}

.f-hint {
  font-size: 10px;
  color: var(--dim);
  margin-top: 7px;
  letter-spacing: .04em;
  line-height: 1.5;
}
.f-err {
  font-size: 10px;
  color: #c0613a;
  margin-top: 7px;
  letter-spacing: .04em;
}

/* ── SLIDER ── */
.sl-field { margin-bottom: 26px; }
.sl-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 16px;
}
.sl-lbl {
  font-size: 11px;
  letter-spacing: .2em;
  color: var(--muted);
  text-transform: uppercase;
  font-weight: 500;
}
.sl-disp { text-align: right; }
.sl-num {
  font-family: 'Playfair Display', serif;
  font-size: 52px;
  color: var(--gold);
  line-height: 1;
  text-shadow: 0 0 18px rgba(201, 162, 39, .35);
}
.sl-unit {
  font-size: 12px;
  color: var(--muted);
  letter-spacing: .14em;
  margin-top: 1px;
}
.sl-pct {
  font-size: 12px;
  color: var(--dim);
  letter-spacing: .07em;
  margin-top: 1px;
}

.sl-track {
  position: relative;
  margin-bottom: 10px;
  height: 28px;
  display: flex;
  align-items: center;
}
.sl-bg {
  position: absolute;
  left: 0;
  right: 0;
  height: 3px;
  background: rgba(201, 162, 39, .08);
  border-radius: 10px;
}
.sl-fill {
  position: absolute;
  left: 0;
  height: 3px;
  background: linear-gradient(90deg, var(--gold-d), var(--gold-l));
  border-radius: 10px;
  box-shadow: 0 0 8px rgba(201, 162, 39, .4);
  pointer-events: none;
  transition: width .05s;
}

.sl-track input[type=range] {
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 28px;
  background: transparent;
  cursor: pointer;
  position: relative;
  z-index: 2;
  touch-action: none;
}
.sl-track input[type=range]::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: radial-gradient(circle at 35% 35%, #f5e199, #c9a227);
  border: 2px solid #0a0a0a;
  box-shadow: 0 0 0 1px rgba(201, 162, 39, .5), 0 0 14px rgba(201, 162, 39, .5);
  transition: box-shadow .2s, transform .2s;
}
.sl-track input[type=range]:active::-webkit-slider-thumb {
  box-shadow: 0 0 0 1px rgba(201, 162, 39, .9), 0 0 22px rgba(201, 162, 39, .8);
  transform: scale(1.15);
}
.sl-track input[type=range]::-moz-range-thumb {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: linear-gradient(135deg, #f5e199, #c9a227);
  border: 2px solid #0a0a0a;
  box-shadow: 0 0 10px rgba(201, 162, 39, .5);
}

.sl-marks {
  display: flex;
  justify-content: space-between;
}
.sl-mark {
  font-size: 9px;
  color: var(--dim);
  letter-spacing: .05em;
}

/* ── DIVIDER ── */
.od {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 4px 0 0;
}
.od-l {
  flex: 1;
  height: 1px;
  background: rgba(201, 162, 39, .08);
}
.od-c {
  display: flex;
  gap: 5px;
  align-items: center;
}
.od-dot {
  width: 3px;
  height: 3px;
  background: var(--gold-d);
  border-radius: 50%;
}
.od-dot.big {
  width: 4px;
  height: 4px;
  background: var(--gold);
  box-shadow: 0 0 5px rgba(201, 162, 39, .5);
}

/* ── RESULTS ── */
.res-sec {
  padding: 0 22px 32px;
  margin-top: 28px;
}
.res-empty {
  text-align: center;
  padding: 28px 0;
  color: var(--dim);
  font-size: 12px;
  letter-spacing: .1em;
}

.res-main {
  background: linear-gradient(135deg, #1a1300, #251900);
  border: 1px solid rgba(201, 162, 39, .3);
  border-radius: 16px;
  padding: 24px 20px;
  text-align: center;
  margin-bottom: 14px;
  position: relative;
  overflow: hidden;
}
.res-main::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--gold), transparent);
}
.res-main-lbl {
  font-size: 10px;
  letter-spacing: .38em;
  color: var(--muted);
  text-transform: uppercase;
  margin-bottom: 8px;
}
.res-main-val {
  font-family: 'Playfair Display', serif;
  font-size: 52px;
  font-weight: 500;
  color: var(--gold);
  line-height: 1;
  text-shadow: 0 0 32px rgba(201, 162, 39, .4);
}
.res-main-sub {
  font-size: 10px;
  color: var(--dim);
  margin-top: 5px;
  letter-spacing: .09em;
}

.res-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}
.rc {
  background: var(--blk3);
  border: 1px solid rgba(201, 162, 39, .08);
  border-radius: 12px;
  padding: 15px 16px;
}
.rc-lbl {
  font-size: 10px;
  letter-spacing: .2em;
  color: var(--dim);
  text-transform: uppercase;
  margin-bottom: 8px;
}
.rc-val {
  font-family: 'Playfair Display', serif;
  font-size: 22px;
  color: var(--txt);
}
.rc.span2 { grid-column: 1 / -1; }
</style>