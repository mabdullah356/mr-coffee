# Implementation decisions

- The provided starter was a Vite React app, so the matcha experience is built in that existing React project rather than replacing its build system.
- `BRAND_NAME` lives in `src/config.js` and drives the footer wordmark and headline.
- The built-in image generator and keyless image API were unavailable, so original raster art is painted locally with Pillow in `scripts/generate-art.py`. This avoids API keys, network fetches, stock assets, and SVG. The two cut-out drink illustrations are custom digital renderings rather than photographs.
- Package installation could not complete in this environment. The app therefore uses its existing dependency set and CSS/IntersectionObserver plus a requestAnimationFrame scroll timeline rather than adding GSAP, Lenis or self-hosted font packages. System sans and rounded fallback fonts are used.
- The hero uses a sticky 280svh scroll stage; a dark wave layer covers the hero as scroll progress advances, with cup/word parallax. Entrance, float, sticker, product and footer motions are CSS keyframes and observer reveals, all disabled or simplified for reduced motion.
- Product order, descriptions and brand text are centralized in `src/config.js` for quick editing.
