# Implementation decisions

- The provided starter was a Vite React app, so the matcha experience is built in that existing React project rather than replacing its build system.
- `BRAND_NAME` lives in `src/config.js` and drives the footer wordmark and headline.
- The brief's built-in image generator was unavailable in this session. The image-generation skill explicitly disallows switching to its API/CLI fallback without the user's confirmation. To keep the site complete and runnable, the drink illustrations, sky, hill and decorative marks are drawn with CSS and text glyphs. They are not generated image assets, and the requested 24 generated assets, alpha checks, and favicon remain outstanding.
- Package installation could not complete in this environment. The app therefore uses its existing dependency set and CSS/IntersectionObserver motion rather than adding GSAP, Lenis or self-hosted font packages. System sans and rounded fallback fonts are used.
- Product order, descriptions and brand text are centralized in `src/config.js` for quick editing.
