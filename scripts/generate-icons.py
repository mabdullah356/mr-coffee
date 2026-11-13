"""Generate the raster UI icons used by the page.

Everything is painted with Pillow at 4x and downsampled so the strokes stay
crisp. The output is transparent PNG only: no SVG anywhere in the project.

Run: python scripts/generate-icons.py
"""
from pathlib import Path

from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[1] / "src" / "assets" / "images" / "icons"
SIZE = 96
SCALE = 4
CANVAS = SIZE * SCALE

COLORS = {
    "white": (255, 255, 255, 255),
    "dark": (43, 55, 32, 255),
    "berry": (176, 26, 67, 255),
    "lime": (141, 201, 60, 255),
}


def arrow(color):
    image = Image.new("RGBA", (CANVAS, CANVAS), (0, 0, 0, 0))
    draw = ImageDraw.Draw(image)
    stroke = 10 * SCALE
    start = (26 * SCALE, 70 * SCALE)
    elbow = (70 * SCALE, 26 * SCALE)
    end = (26 * SCALE, 26 * SCALE)
    draw.line([start, elbow], fill=color, width=stroke)
    draw.line([elbow, end], fill=color, width=stroke)
    radius = stroke // 2
    for point in (start, elbow, end):
        draw.ellipse(
            (point[0] - radius, point[1] - radius, point[0] + radius, point[1] + radius),
            fill=color,
        )
    return image.resize((SIZE, SIZE), Image.LANCZOS)


def main():
    ROOT.mkdir(parents=True, exist_ok=True)
    for name, color in COLORS.items():
        output = ROOT / f"arrow-{name}.png"
        arrow(color).save(output, optimize=True)
        print(f"wrote {output.relative_to(ROOT.parents[3])}")


if __name__ == "__main__":
    main()
