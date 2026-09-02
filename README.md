# 王化康 · Kyson — CSS-native personal site

Static personal site for 王化康 / Kyson (Sightes · 外贸运营 · 光纤产品).

## Stack

- `index.html` + `styles.css` + minimal `script.js` (email copy only)
- CSS View Transitions (`@view-transition`) + scroll-driven `animation-timeline: view()`
- `prefers-reduced-motion: reduce` disables VT and scroll animations
- No React / Three.js / GSAP / WebGL

## Preview

```bash
python3 -m http.server 8080
# open http://localhost:8080
```

Or open `index.html` directly in a Chromium-based browser (View Transitions + scroll-driven animations work best there).

## Branch

`feature/css-native-portfolio` — CSS-first alternative to the Next.js portfolio branch.
