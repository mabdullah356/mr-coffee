# Greenleaf Matcha

A responsive React landing page for a matcha drink brand. Built with Vite, React 19, GSAP and Lenis.

## Run locally

```sh
npm install
npm run dev
```

## Build and checks

```sh
npm run build
npm run lint
npm run check:nosvg
```

`check:nosvg` fails if any SVG file or reference is added to the project. All artwork in the page is raster (PNG/WebP).

## Customize

- Change the brand name in `src/config.js` (`BRAND_NAME`). The footer headline and oversized wordmark update with it.
- Update the drink names and copy in the `products` array in `src/config.js`.
- Adjust the color and typography tokens in `src/styles/tokens.css`.
- Main scenes are in `src/components/`: `Preloader`, `Hero`, `Intro`, `ProductStack`, and `Footer`.
- Scroll orchestration lives in `src/hooks/useSmoothScroll.js` (Lenis synced to the GSAP ticker) and each scene's `ScrollTrigger` setup.

## Assets

Decorative raster artwork is generated locally with Pillow and NumPy (no API key needed). Install those Python packages with `python -m pip install pillow numpy`, then rebuild it with `python scripts/generate-art.py`. The hero, product panels, strawberry accents, and Coffee Ritual section use local WebP photographs; see `ASSETS.md` for their sources and licenses.

The small raster arrow icons used by the nav, hero stamp and product cards are generated separately:

```sh
python scripts/generate-icons.py
```

See `ASSETS.md` for the full asset list and `DECISIONS.md` for motion and performance notes.
