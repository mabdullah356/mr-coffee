# Assets

## Generated imagery

The artwork in this version was generated locally with the original Pillow renderer in `scripts/generate-art.py`. It uses no API key, downloads, stock photos, or SVGs. Run `python scripts/generate-art.py` to reproduce the images.

## CSS-built artwork in the current version

- `src/assets/images/hero/hero-sky.webp` — 1800×1100; noisy blue sky with soft painted cloud layers.
- `src/assets/images/products/drink-hazelnut.png` — 960×1560; transparent layered matcha and oat milk cup, ice, glass glints and condensation.
- `src/assets/images/products/drink-strawberry.png` — 960×1560; transparent strawberry, milk and matcha cup.
- `src/assets/images/leaves/leaf-branch.png` — 720×720; transparent botanical branch line art.
- `src/assets/images/footer/matcha-powder.webp` — 1500×950; low-key matcha powder mound illustration.
- `src/assets/images/brand/brand-mark.png` — 256×256; original Greenleaf roundel; used to render `public/favicon.png` (64×64).

The transparent PNG outputs were checked by the generator for zero-alpha corner pixels. The hero cup composition reuses the two drink cut-outs with CSS-rendered forearms and the hill stays a CSS shape.
