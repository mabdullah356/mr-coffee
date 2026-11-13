# Assets

The hero, drink panels, coffee ritual, and strawberry accents use real-object photography stored locally as WebP. Other decorative artwork, UI icons, and stickers are raster PNGs generated with Pillow and NumPy. The site does not use SVGs.

## Rebuild

```sh
python -m pip install pillow numpy
python scripts/generate-art.py
python scripts/generate-icons.py
```

`generate-art.py` paints the scene artwork. `generate-icons.py` paints the four arrow icons with 4x supersampling for smooth edges. `public/favicon.png` is derived from the brand mark.

## Scene imagery

| File | Size | Notes |
| --- | --- | --- |
| `src/assets/images/hero/hero-matcha-hand.webp` | 1800x1200 | Full-bleed photograph of a hand holding iced matcha. LCP image. |
| `src/assets/images/hero/hero-hill.png` | 2560x700 | Transparent foreground hill. |
| `src/assets/images/wave/wave-edge.png` | 2400x420 | Transparent wave crest tiled three times in the transition. |
| `src/assets/images/products/drink-hazelnut.webp` | 1000x1500 | Photograph of a glass iced matcha latte, used in the hazelnut product panel. |
| `src/assets/images/products/drink-strawberry.webp` | 1000x1500 | Photograph of a layered strawberry matcha latte. |
| `src/assets/images/coffee/coffee-pour.webp` | 1200x801 | Photograph of a barista pouring steamed milk into coffee for the Coffee Ritual section. |
| `src/assets/images/fruit/strawberry-whole.webp` | 700x700 | Close-up strawberry photograph used as a circular product-card accent. |
| `src/assets/images/fruit/strawberry-cluster.webp` | 700x700 | Close-up strawberry cluster photograph used as a circular product-card accent. |
| `src/assets/images/footer/matcha-powder.webp` | 1500x950 | Low-key matcha powder mound. |
| `src/assets/images/preloader/whisk-bowl.png` | 512x512 | Preloader whisk bowl. |

## Photo sources

These photographs are served from local WebP files. Matcha and strawberry photos use the [Unsplash License](https://unsplash.com/license); the coffee photo uses the [Pexels License](https://www.pexels.com/license/).

| Asset | Original photo |
| --- | --- |
| `hero-matcha-hand.webp` | [Unsplash photo 1658144176998-20ee07642ff6](https://images.unsplash.com/photo-1658144176998-20ee07642ff6) |
| `drink-hazelnut.webp` | [Unsplash photo 1717603545758-88cc454db69b](https://images.unsplash.com/photo-1717603545758-88cc454db69b) |
| `drink-strawberry.webp` | [Unsplash photo 1749104028327-a33087ea4f47](https://images.unsplash.com/photo-1749104028327-a33087ea4f47) |
| `coffee-pour.webp` | [Pexels photo 302899](https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg) |
| `strawberry-whole.webp` | [Unsplash photo 1601004890684-d8cbf643f5f2](https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2) |
| `strawberry-cluster.webp` | [Unsplash photo 1464965911861-746a04b4bca6](https://images.unsplash.com/photo-1464965911861-746a04b4bca6) |

## Decoration and UI

| File | Size | Notes |
| --- | --- | --- |
| `src/assets/images/brand/brand-mark.png` | 256x256 | Roundel used in the nav; source for `public/favicon.png`. |
| `src/assets/images/brand/cursor-matcha.png` | 256x256 | Custom cursor on fine-pointer devices. |
| `src/assets/images/stickers/sticker-cat.png` | 400x400 | Intro sticker. |
| `src/assets/images/stickers/sticker-bow.png` | 400x400 | Intro sticker. |
| `src/assets/images/stickers/sticker-gummy.png` | 400x400 | Intro sticker. |
| `src/assets/images/stickers/sticker-matcha.png` | 400x400 | Intro sticker. |
| `src/assets/images/stickers/sticker-label.png` | 600x300 | Intro label sticker. |
| `src/assets/images/icons/arrow-white.png` | 96x96 | Raster arrow for dark backgrounds. |
| `src/assets/images/icons/arrow-dark.png` | 96x96 | Raster arrow for light backgrounds. |
| `src/assets/images/icons/arrow-lime.png` | 96x96 | Raster arrow for the hero stamp. |
| `src/assets/images/icons/arrow-berry.png` | 96x96 | Raster arrow for the berry card. |
| `src/assets/images/social/icon-facebook.png` | 128x128 | Footer social icon. |
| `src/assets/images/social/icon-instagram.png` | 128x128 | Footer social icon. |
| `src/assets/images/social/icon-x.png` | 128x128 | Footer social icon. |
| `src/assets/images/social/icon-youtube.png` | 128x128 | Footer social icon. |

## Transparency checks

Generated PNG cut-outs use transparent corners. Photographs are opaque WebP images and are displayed with `object-fit: cover`; the hill and wave remain transparent raster overlays.
