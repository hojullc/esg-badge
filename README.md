# 🌱 esg-badge

> Zero-dependency ESG score badge & widget — embed Environmental, Social, Governance ratings on any website.

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![GitHub release](https://img.shields.io/github/v/release/hojullc/esg-badge)](https://github.com/hojullc/esg-badge/releases)

## Features

- **Zero dependencies** — pure JS, 6 KB minified
- **Donut chart gauges** for E, S, and G pillars with letter grades (A+ → F)
- **Light & dark themes** out of the box
- **Compact mode** for tight layouts
- **Fully accessible** — ARIA labels, `role="region"`, readable without color
- Works with ESM, AMD, or plain `<script>` tags

## Install

**CDN (fastest)**
```html
<script src="https://cdn.jsdelivr.net/gh/hojullc/esg-badge@1/src/esg-badge.js"></script>
```

**npm**
```bash
npm install esg-badge
```

## Quick start

```html
<div id="esg-badge"></div>
<script src="esg-badge.js"></script>
<script>
ESGBadge.create({
  container: '#esg-badge',
  company:   'Acme Corp',
  scores:    { E: 82, S: 76, G: 90 },
  theme:     'light',
  updated:   'Q3 2026',
});
</script>
```

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `container` | string \| Element | `'#esg-badge'` | CSS selector or DOM element |
| `company` | string | `'Company'` | Company name shown in badge |
| `scores` | object | `{E:72,S:65,G:80}` | Environmental, Social, Governance scores (0–100) |
| `overall` | number \| null | `null` | Override overall score (defaults to average of E/S/G) |
| `theme` | `'light'`\|`'dark'` | `'light'` | Color(theme |
| `compact` | boolean | `false` | Hide pillar detail row |
| `link` | string \| null | `null` | Wrap badge in an anchor tag |
| `updated` | string \| null | `null` | Update date string shown below company name |

## API

```js
// Create and mount
const badge = ESGBadge.create({ ... });

// Update scores later
badge.update({ scores: { E: 88, S: 80, G: 92 } });

// Remove from DOM
badge.destroy();
```

## Grade scale

| Score | Grade |
|-------|-------|
| 90–100 | A+ |
| 80–89 | A |
| 70–79 | B |
| 60–69 | C |
| 50–59 | D |
| < 50 | F |

## Demo

Open `demo/index.html` in your browser or see the [live demo](https://github.com/hojullc/esg-badge).

## License

MIT © [Hoju LLC](https://hoju.us)
