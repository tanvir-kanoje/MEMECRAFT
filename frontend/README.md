# ✦ MEMECRAFT // Frontend Studio

This directory contains the client-side single page application for **MEMECRAFT**, built with **React**, **Vite**, **Lucide Icons**, and **Canvas Confetti**.

**Live Production URL:** [https://d2tuc83mjm02el.cloudfront.net](https://d2tuc83mjm02el.cloudfront.net)

---

## 🎨 Visual System & Architecture

* **White Alabaster Canvas:** Clean, high-contrast base (`#FFFFFF`) with frosted glassmorphism cards.
* **Electric Blue & Cyan Gradients:** Primary brand accents and interactive elements.
* **Holi Powder Bursts:** Multi-layered, floating animated powder clouds drifting softly behind the white cards.
* **Non-Overlapping 3-Column Grid:** Structured layout featuring:
  * `01 // REALITY` (Telemetry and expression data)
  * Monumental Split-Face Portal (Interactive morph slider)
  * `02 // THE MEME TWIN` (Classical serif typography and match affinity metrics)
* **100% Unobstructed Meme Visibility:** Images use `object-fit: contain` with zero floating badges or dark vignette overlays.
* **Web Audio API Engine:** Synthesized camera shutter clicks and celebratory arpeggio chimes without external audio assets.

---

## 🛠️ Development Setup

```bash
# Install dependencies
npm install

# Start local dev server
npm run dev
```

The app will start at `http://localhost:5173/`.

---

## 📦 Production Build & S3 Upload

```bash
# Build optimized assets
npm run build
```

Compiled files are placed in `dist/`. Upload the contents of `dist/` to your AWS S3 frontend bucket and invalidate your CloudFront distribution cache:

```bash
aws s3 sync dist/ s3://college-meme-craft-frontend-2026/ --delete
aws cloudfront create-invalidation --distribution-id YOUR_DIST_ID --paths "/*"
```
