# Greenleaf Matcha

A responsive React landing page for a matcha drink brand.

## Run locally

```sh
npm install
npm run dev
```

## Build and checks

```sh
npm run build
npm run check:nosvg
npm run lint
```

## Customize

- Change the brand name in `src/config.js` (`BRAND_NAME`). The footer headline and oversized wordmark update with it.
- Update the drink names and copy in the `products` array in `src/config.js`.
- Adjust the color tokens at the top of `src/App.css`.
- Main scenes are in `src/components/`: `Hero`, `Intro`, `ProductStack`, and `Footer`.

The current artwork is drawn in CSS. See `ASSETS.md` and `DECISIONS.md` for the image-generation and dependency constraints from this environment.
