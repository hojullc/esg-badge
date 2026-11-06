/*!
 * esg-badge v1.0.0
 * Zero-dependency ESG score badge & widget for any website.
 * MIT License — https://github.com/hojullc/esg-badge
 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory()
    : typeof define === 'function' && define.amd ? define(factory)
    : (global.ESGBadge = factory());
}(typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : this, function () {
  'use strict';

  const GRADE = s =>
    s >= 90 ? 'A+' : s >= 80 ? 'A' : s >= 70 ? 'B' : s >= 60 ? 'C' : s >= 50 ? 'D' : 'F';

  const COLOR = s => s >= 70 ? '#22c55e' : s >= 50 ? '#f59e0b' : '#ef4444';

  const PILLAR_COLOR = { E: '#22c55e', S: '#3b82f6', G: '#8b5cf6' };

  function arc(cx, cy, r, pct) {
    const a = pct / 100 * 360;
    const rad = (a - 90) * Math.PI / 180;
    const x = cx + r * Math.cos(rad);
    const y = cy + r * Math.sin(rad);
    if (a >= 360) return `M ${cx - r} ${cy} A ${r} ${r} 0 1 1 ${cx - r + 0.001} ${cy}`;
    return `M ${cx} ${cy - r} A ${r} ${r} 0 ${a > 180 ? 1 : 0} 1 ${x} ${y}`;
  }

  function donut(score, color, label, size = 80) {
    const r = size * 0.35, sw = size * 0.1, cx = size / 2, cy = size / 2;
    return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" role="img" aria-label="${label} score ${score}">
      <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="rgba(0,0,0,.1)" stroke-width="${sw}"/>
      <path d="${arc(cx, cy, r, score)}" fill="none" stroke="${color}" stroke-width="${sw}" stroke-linecap="round"/>
      <text x="${cx}" y="${cy}" text-anchor="middle" dominant-baseline="central"
        font-size="${size * .22}px" font-weight="700" fill="${color}">${score}</text>
      <text x="${cx}" y="${cy + size * .24}" text-anchor="middle" font-size="${size * .14}px"
        fill="currentColor" opacity=".6">${label}</text>
    </svg>`;
  }

  class ESGBadge {
    constructor(options = {}) {
      this.options = Object.assign({
        container: '#esg-badge',
        company: 'Company',
        scores: { E: 72, S: 65, G: 80 },
        overall: null,
        theme: 'light',
        compact: false,
        link: null,
        updated: null,
      }, options);
      this._container = null;
    }

    _overall() {
      const { E, S, G } = this.options.scores;
      return this.options.overall !== null ? this.options.overall : Math.round((E + S + G) / 3);
    }

    _css(dark) {
      return {
        bg: dark ? '#1a1a2e' : '#ffffff',
        fg: dark ? '#e2e8f0' : '#1a202c',
        border: dark ? 'rgba(255,255,255,.12)' : 'rgba(0,0,0,.08)',
        sub: dark ? 'rgba(255,255,255,.45)' : '#64748b',
        track: dark ? 'rgba(255,255,255,.1)' : 'rgba(0,0,0,.1)',
      };
    }

    _buildHTML() {
      const { company, scores, theme, compact, link, updated } = this.options;
      const overall = this._overall();
      const grade = GRADE(overall);
      const oc = COLOR(overall);
      const dark = theme === 'dark';
      const c = this._css(dark);

      const pillars = ['E', 'S', 'G'].map(k =>
        `<div style="text-align:center;flex:1">${donut(scores[k], PILLAR_COLOR[k], k, 72)}</div>`
      ).join('');

      const scoreLabel = { E: 'Environmental', S: 'Social', G: 'Governance' };
      const legendItems = ['E', 'S', 'G'].map(k =>
        `<span style="color:${PILLAR_COLOR[k]};font-weight:600">${scoreLabel[k]}</span>`
      ).join(' · ');

      const header = `<div style="display:flex;align-items:center;gap:14px">
        ${donut(overall, oc, 'ESG', compact ? 60 : 72)}
        <div>
          <div style="font-size:${compact ? 1.1 : 1.5}rem;font-weight:900;line-height:1;color:${oc}">${grade}</div>
          <div style="font-size:.7rem;text-transform:uppercase;letter-spacing:.06em;color:${c.sub};margin-top:3px">ESG Rating</div>
          <div style="font-size:.85rem;font-weight:600;color:${c.fg};margin-top:6px">${company}</div>
          ${updated ? `<div style="font-size:.68rem;color:${c.sub};margin-top:3px">Updated ${updated}</div>` : ''}
        </div>
      </div>`;

      const details = compact ? '' : `
    <div style="display:flex;gap:8px;margin-top:16px;border-top:1px solid ${c.border};padding-top:16px">${pillars}</div>
        <div style="font-size:.68rem;color:${c.sub};margin-top:10px;text-align:center">${legendItems}</div>`;

      const inner = header + details;
      const content = link
        ? `<a href="${link}" style="text-decoration:none;color:inherit;display:block">${inner}</a>`
        : inner;

      return `<div role="region" aria-label="ESG Score for ${company}"
        style="background:${c.bg};color:${c.fg};border:1px solid ${c.border};border-radius:16px;
               padding:${compact ? '14px 18px' : '20px 24px'};box-shadow:0 4px 24px rgba(0,0,0,.08);
               font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;
               display:inline-block;min-width:${compact ? 180 : 220}px">
        ${content}
      </div>`;
    }

    mount() {
      const sel = this.options.container;
      const el = typeof sel === 'string' ? document.querySelector(sel) : sel;
      if (!el) { console.warn('[ESGBadge] Container not found:', sel); return this; }
      this._container = el;
      el.innerHTML = this._buildHTML();
      return this;
    }

    update(opts = {}) {
      Object.assign(this.options, opts);
      if (this._container) this._container.innerHTML = this._buildHTML();
      return this;
    }

    destroy() {
      if (this._container) this._container.innerHTML = '';
      this._container = null;
      return this;
    }

    static create(options) { return new ESGBadge(options).mount(); }
  }

  return ESGBadge;
}));
