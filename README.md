# Kyson Wang / 王化康 — Personal Portfolio

Single-page personal site for **Kyson Wang (王化康)** — foreign-trade and optical-fiber operations at Sightes.

## Stack

- **Next.js** (App Router) + TypeScript + Tailwind CSS
- **GSAP** + ScrollTrigger — section reveals (transform / opacity only)
- **Lenis** — smooth scroll, synced to the GSAP ticker
- **Three.js** + **React Three Fiber** + **Drei** — hero fiber-optic / light-particle canvas
- Accessibility: `prefers-reduced-motion` disables canvas + smooth scroll; canvas pauses when off-screen; DPR capped

## Information architecture

1. **Hero** — name, bilingual title, R3F abstract fiber field
2. **About** — Sightes / trade + fiber ops
3. **Work** — 2–3 placeholder case studies (clearly labeled)
4. **Skills** — Outlook, Excel, supply-chain ops (not a fake React list)
5. **Contact** — email, GitHub, X

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Production build

```bash
npm run build
npm start
```

## Contact

- Email: kyson.wang@sightestech.com
- GitHub: [Kyson0531](https://github.com/Kyson0531)
- X: [@Kyson0531](https://x.com/Kyson0531)
